const React = require('react');

class SearchHistories extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { searchHistories, loggedInUser } = this.props;
        return (
            <div>
                <h4>최근검색어: </h4>
                {(searchHistories && searchHistories.length > 0)?
						searchHistories.filter( searchHistory => {
							return (
                                searchHistory.entity.userAccount.name === loggedInUser
							)
                        }).
                        sort( (a,b) => {
                            return new Date(b.entity.createdDtm) - new Date(a.entity.createdDtm);
                        })
                        .map( (searchHistory, idx) =>{
                            return (
                                <div key={idx}>
                                    <span>
                                        {searchHistory.entity.keyWord}({searchHistory.entity.createdDtm})
                                    </span>
                                    <br/>
                                </div>
                            )

                        })
						:null
					}
            </div>
        )
	}
}
export default SearchHistories;