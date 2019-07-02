import { reduce } from 'when';

const React = require('react');
const ReactDOM = require('react-dom');

class Ranking extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { searchHistories } = this.props;

        let resultMap = {};
        let arr = [];
        searchHistories.map( (searchHistory) => {
            arr.push(searchHistory.entity.keyWord);
        })

        // 중복제거
        for (let i in arr) {
            if (!(arr[i] in resultMap))
                resultMap[arr[i]] = [];
            resultMap[arr[i]].push(arr[i]);
        }

        // 객체배열
        let keys = Object.keys(resultMap);
        let keyMap = [];
        keys.map( key => {
            keyMap.push( { key : key, count: resultMap[key].length } );
        })
        return (
            <div className="nav">
                <h4 style={{textAlign:"center"}}>Ranking</h4>
                <ul className="nav-list">
                    {keyMap && keyMap.length > 0?
                        keyMap.sort( (a,b) => {
                            return b.count - a.count;
                        }).slice(0,10)
                        .map( (keyMap, idx) =>{
                            return (
                                <li key={idx} className="nav-item">
                                    <a href="" className="nav-link">
                                        <span style={{color:"red"}}>{idx+1}</span> {keyMap.key}({keyMap.count})
                                    </a>
                                </li>
                                )
                            })
                        :null
                    }
                </ul>
            </div>)
    }
}
export default Ranking;