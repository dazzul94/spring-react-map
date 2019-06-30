const React = require('react');
import jQuery from "jquery";
window.$ = window.jQuery = jQuery;

import PlaceGrid from './placeGrid.js';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            placeList : [],
            // 장소 검색 객체를 생성합니다
            placeObject: new kakao.maps.services.Places()
          };
        this.handleSearch = this.handleSearch.bind(this);
        this.placesSearchCB = this.placesSearchCB.bind(this);
        this.displayPagination = this.displayPagination.bind(this);
    }

    
    // 검색함수 입니다
    handleSearch(e) {
        e.preventDefault();
        
        var keyword = $('#search').val();
        if (!keyword.replace(/^\s+|\s+$/g, '')) {
            alert('키워드를 입력해주세요!');
            return false;
        }
        // 키워드로 장소를 검색합니다
        this.state.placeObject.keywordSearch(keyword, this.placesSearchCB); 
        window.location = "#";
        }
        
        // 키워드 검색 완료 시 호출되는 콜백함수 입니다
        placesSearchCB (data, status, pagination) {
            if (status === 'OK') {
                this.setState({
                    placeList: data
                });
                this.displayPagination(pagination);
            } else {
                // 오류 처리
                this.setState({
                    placeList: []
                })
            }
        }
        
        // 검색결과 목록 하단에 페이지번호를 표시는 함수입니다
        displayPagination(pagination) {
            var paginationEl = document.getElementById('pagination'),
                fragment = document.createDocumentFragment(),
                i; 

            // 기존에 추가된 페이지번호를 삭제합니다
            while (paginationEl.hasChildNodes()) {
                paginationEl.removeChild (paginationEl.lastChild);
            }

            for (i=1; i<=pagination.last; i++) {
                var el = document.createElement('a');
                el.href = "#";
                el.innerHTML = i;

                if (i===pagination.current) {
                    el.className = 'on';
                } else {
                    el.onclick = (function(i) {
                        return function() {
                            pagination.gotoPage(i);
                        }
                    })(i);
                }

                fragment.appendChild(el);
            }
            paginationEl.appendChild(fragment);
        }

        render() {
            return (
                <div>
                    <input id="search" type="text" placeholder="검색창" className="field"/>
                    <button onClick={this.handleSearch}>Search</button>
                    <PlaceGrid 
                        data={this.state.placeList}
                        placeObj={this.state.placeObject}/>
                    <div id="pagination"></div>
                </div>
		)
	}
}
export default Search;