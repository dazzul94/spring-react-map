const React = require('react');

class SearchHistories extends React.Component {
    constructor(props) {
        super(props);

        
    }

    render() {
        const { searchHistories, loggedInUser } = this.props;
        return (
            <div id="recommend" className="invisible">
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
                                <div key={idx} className="item">
                                    {searchHistory.entity.keyWord}({searchHistory.entity.createdDtm}) <span className="text"></span>
                                </div>
                            )

                        })
						:<div className="item"><span className="text">최근 검색 이력이 없습니다.</span></div>
					}
            </div>
        )
	}
}
export default SearchHistories;