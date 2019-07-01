'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const when = require('when');
const client = require('./client');

const follow = require('./follow'); // function to hop multiple links by "rel"

const stompClient = require('./websocket-listener');

const root = '/api';

import Search from './search.js';
import Ranking from './ranking.js';

class App extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			searchHistories: [], 
			attributes: [], 
			page: 1, 
			pageSize: 45, 
			links: {}, 
			loggedInUser: this.props.loggedInUser
		};

		this.onCreate = this.onCreate.bind(this);
		this.refreshAndGoToLastPage = this.refreshAndGoToLastPage.bind(this);
		this.onNavigate = this.onNavigate.bind(this);
	}

	componentDidMount() {

		// 최근검색어 조회
		this.loadFromServer(this.state.pageSize);

		stompClient.register([
			{route: '/search/newSearchHistory', callback: this.refreshAndGoToLastPage}
		]);
	}

	// 최근 검색어 등록
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

	// 목록 재조회
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
	
	// navigation 이동
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

	// 최근검색어 조회
	loadFromServer(pageSize) {
		follow(client, root, [
				{rel: 'searchHistories', params: {size: pageSize}}]
		).then(searchHistoryCollection => {
			return client({
				method: 'GET',
				path: searchHistoryCollection.entity._links.profile.href,
				headers: {'Accept': 'application/schema+json'}
			}).then(schema => {

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
			<div className="container">
				<Ranking page={this.state.page}
						 searchHistories={this.state.searchHistories}
						 links={this.state.links}
						 pageSize={this.state.pageSize}
						 attributes={this.state.attributes}
						 onNavigate={this.onNavigate}
						 onUpdate={this.onUpdate}
						 onDelete={this.onDelete}
						 updatePageSize={this.updatePageSize}
						 loggedInUser={this.state.loggedInUser}/>
				<div className="content">
					<Search attributes={this.state.attributes} 
							onCreate={this.onCreate}
							searchHistories={this.state.searchHistories}
							links={this.state.links}
							pageSize={this.state.pageSize}
							attributes={this.state.attributes}
							loggedInUser={this.state.loggedInUser}/>
				</div>
			</div>
		)
	}
}

ReactDOM.render(
	<App loggedInUser={document.getElementById('userName').innerHTML } />,
	document.getElementById('react')
)

