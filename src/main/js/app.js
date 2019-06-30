'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const when = require('when');
const client = require('./client');

const follow = require('./follow'); // function to hop multiple links by "rel"

const stompClient = require('./websocket-listener');

const root = '/api';

import Search from './search.js';
import SearchHistories from './searchHistories.js';

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			searchHistories: [], 
			attributes: [], 
			page: 1, 
			pageSize: 45, 
			links: {}, 
			loggedInManager: this.props.loggedInManager
		};

		this.onCreate = this.onCreate.bind(this);
		this.refreshAndGoToLastPage = this.refreshAndGoToLastPage.bind(this);
		this.onNavigate = this.onNavigate.bind(this);
	}

	componentDidMount() {
		// searchHistries 조회
		this.loadFromServer(this.state.pageSize);
		stompClient.register([
			{route: '/search/newSearchHistory', callback: this.refreshAndGoToLastPage}
		]);
	}

	onCreate(newSearchHistory) {
		follow(client, root, ['searchHistories']).done(response => {
			client({
				method: 'POST',
				path: response.entity._links.self.href,
				entity: newSearchHistory,
				headers: {'Content-Type': 'application/json'}
			})
		})
	}

	// tag::websocket-handlers[]
	refreshAndGoToLastPage(message) {
		follow(client, root, [{
			rel: 'searchHistories',
			params: {size: this.state.pageSize}
		}]).done(response => {
			if (response.entity._links.last !== undefined) {
				this.onNavigate(response.entity._links.last.href);
			} else {
				this.onNavigate(response.entity._links.self.href);
			}
		})
	}
	
	onNavigate(navUri) {
		client({
			method: 'GET',
			path: navUri
		}).then(searchHistoryCollection => {
			this.links = searchHistoryCollection.entity._links;
			this.page = searchHistoryCollection.entity.page;

			return searchHistoryCollection.entity._embedded.searchHistories.map(searchHistory =>
					client({
						method: 'GET',
						path: searchHistory._links.self.href
					})
			);
		}).then(searchHistoryPromises => {
			return when.all(searchHistoryPromises);
		}).done(searchHistories => {
			this.setState({
				page: this.page,
				searchHistories: searchHistories,
				attributes: Object.keys(this.schema.properties),
				pageSize: this.state.pageSize,
				links: this.links
			});
		});
	}	

	loadFromServer(pageSize) {
		follow(client, root, [
				{rel: 'searchHistories', params: {size: pageSize}}]
		).then(searchHistoryCollection => {
			return client({
				method: 'GET',
				path: searchHistoryCollection.entity._links.profile.href,
				headers: {'Accept': 'application/schema+json'}
			}).then(schema => {
				// tag::json-schema-filter[]
				/**
				 * Filter unneeded JSON Schema properties, like uri references and
				 * subtypes ($ref).
				 */
				Object.keys(schema.entity.properties).forEach(function (property) {
					if (schema.entity.properties[property].hasOwnProperty('format') &&
						schema.entity.properties[property].format === 'uri') {
						delete schema.entity.properties[property];
					}
					else if (schema.entity.properties[property].hasOwnProperty('$ref')) {
						delete schema.entity.properties[property];
					}
				});

				this.schema = schema.entity;
				this.links = searchHistoryCollection.entity._links;
				return searchHistoryCollection;
			});
		}).then(searchHistoryCollection => {
			this.page = searchHistoryCollection.entity.page;
			return searchHistoryCollection.entity._embedded.searchHistories.map(searchHistory =>
					client({
						method: 'GET',
						path: searchHistory._links.self.href
					})
			);
		}).then(searchHistoryPromises => {
			return when.all(searchHistoryPromises);
		}).done(searchHistories => {
			this.setState({
				page: this.page,
				searchHistories: searchHistories,
				attributes: Object.keys(this.schema.properties),
				pageSize: pageSize,
				links: this.links
			});
		});
	}

	render() {
		return (
			<div>
				<SearchHistories page={this.state.page}
							  	 searchHistories={this.state.searchHistories}
							  	 links={this.state.links}
							  	 pageSize={this.state.pageSize}
							  	 attributes={this.state.attributes}
							  	 onNavigate={this.onNavigate}
							  	 onUpdate={this.onUpdate}
							  	 onDelete={this.onDelete}
							  	 updatePageSize={this.updatePageSize}
							  	 loggedInManager={this.state.loggedInManager}/>
				<Search attributes={this.state.attributes} onCreate={this.onCreate}/>
			</div>
		)
	}
}

ReactDOM.render(
	<App loggedInManager={document.getElementById('managername').innerHTML } />,
	document.getElementById('react')
)

