const React = require('react');

class SearchHistories extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { searchHistories, loggedInUser } = this.props;
        return (
            <div>
                최근검색어: 
                {(searchHistories && searchHistories.length > 0)?
						searchHistories.filter( searchHistory => {
							return (
                                searchHistory.entity.userAccount.name === loggedInUser
							)
						}).map( (searchHistory, idx) =>{
                            return (
                                searchHistory.entity.keyWord
                            )

                        })
						:null
					}
            </div>
        )
	}
}
export default SearchHistories;