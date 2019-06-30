const React = require('react');

class SearchHistories extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { searchHistories } = this.props;
        return (
            <div>
                최근검색어: 
                {(searchHistories && searchHistories.length > 0)?
						searchHistories.map( ( searchHistory, idx ) => {
							return (
                                idx == searchHistories.length - 1 ?`${searchHistory.entity.keyWord}`:`${searchHistory.entity.keyWord}, `
							)
						})
						:null
					}
            </div>
        )
	}
}
export default SearchHistories;