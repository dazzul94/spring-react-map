const React = require('react');
const ReactDOM = require('react-dom');

class Ranking extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { searchHistories } = this.props;

        var resultMap = {};
        var arr = [];
        searchHistories.map( (searchHistory) => {
            arr.push(searchHistory.entity.keyWord);
        })

        // 중복제거
        for (var i in arr) {
            if (!(arr[i] in resultMap))
                resultMap[arr[i]] = [];
            resultMap[arr[i]].push(arr[i]);
        }

        // 객체배열
        var keys = Object.keys(resultMap);
        var keyMap = [];
        keys.map( key => {
            keyMap.push( { key : key, count: resultMap[key].length } );
        })
        return (
            <div>
            <h4>Ranking: </h4>

            {(keyMap && keyMap.length > 0)?
                keyMap.sort( (a,b) => {
                    return b.count - a.count;
                })
                .map( keyMap =>{
                    return (
                        <div key={keyMap.key}>
                            <span>
                                {keyMap.key}({keyMap.count})
                            </span>
                            <br/>
                        </div>
                    )

                })
                :null
            }
        </div>
    )}
}
export default Ranking;