const React = require('react');

class Search extends React.Component {
    constructor(props) {
		super(props);
    }
    
	render() {
		return (
			<div>
				<input type="text" placeholder="검색창" className="field"/>
			</div>
		)
	}
}
export default Search;