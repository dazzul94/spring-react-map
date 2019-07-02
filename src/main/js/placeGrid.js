const React = require('react');
import Modal from 'react-modal';

const customStyles = {
	content : {
	  top                   : '50%',
	  left                  : '50%',
	  right                 : 'auto',
	  bottom                : 'auto',
	  marginRight           : '-50%',
	  transform             : 'translate(-50%, -50%)'
	}
};
Modal.setAppElement('body')

class PlaceList extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
			modalIsOpen: false,
			clickedPlace: {}
		  };
	   
		this.openModal = this.openModal.bind(this);
		this.afterOpenModal = this.afterOpenModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.handleBtnClick = this.handleBtnClick.bind(this);
		this.displayMarker = this.displayMarker.bind(this);

	}
	openModal() {
		this.setState({modalIsOpen: true});
	}
	
	// 지도에 마커를 표시하는 함수입니다
	displayMarker(place) {
			
		// 마커를 생성하고 지도에 표시합니다
		var marker = new kakao.maps.Marker({
			map: map,
			position: new kakao.maps.LatLng(place.y, place.x) 
		});

		// 마커에 클릭이벤트를 등록합니다
		kakao.maps.event.addListener(marker, 'click', function() {
			// 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
			infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
			infowindow.open(map, marker);
		});
	}
	afterOpenModal() {
		var thisPlace = this.state.clickedPlace;
		// 마커를 클릭하면 장소명을 표출할 인포윈도우 입니다
		var infowindow = new kakao.maps.InfoWindow({zIndex:1});

		var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
			mapOption = {
				center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
				level: 3 // 지도의 확대 레벨
			};  

		// 지도를 생성합니다    
		var map = new kakao.maps.Map(mapContainer, mapOption); 
		// 주소-좌표 변환 객체를 생성합니다
		var geocoder = new kakao.maps.services.Geocoder();
		// 주소로 좌표를 검색합니다
		geocoder.addressSearch(thisPlace.address_name, function(result, status) {

    	// 정상적으로 검색이 완료됐으면 
     	if (status === kakao.maps.services.Status.OK) {

			var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

			// 결과값으로 받은 위치를 마커로 표시합니다
			var marker = new kakao.maps.Marker({
				map: map,
				position: coords
        });

        // 인포윈도우로 장소에 대한 설명을 표시합니다
        var infowindow = new kakao.maps.InfoWindow({
            content: '<div style="width:150px;text-align:center;padding:6px 0;">' + thisPlace.place_name + '(' + thisPlace.address_name +  ')' + '</div>'
        });
        infowindow.open(map, marker);

        // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
        map.setCenter(coords);
    } 
});    
	}
	
	closeModal() {
		this.setState({modalIsOpen: false});
	}
	
	// 키워드 검색 완료 시 호출되는 콜백함수 입니다
	handleBtnClick (place) {
		this.openModal();
		this.setState({
			clickedPlace: place
		})
	}
	
    render() {
		const { data } = this.props;
		const { clickedPlace } = this.state;
        return(
			<div style={{paddingTop:'20px'}}>
				<Modal
					isOpen={this.state.modalIsOpen}
					onAfterOpen={this.afterOpenModal}
					onRequestClose={this.closeModal}
					style={customStyles}
					contentLabel="place detail"
				>
					<h2 ref={subtitle => this.subtitle = subtitle}>{clickedPlace.place_name}</h2>
					<a href={`https://map.kakao.com/link/map/${clickedPlace.id}`} target="_blank">카카오 지도 바로가기</a>
					<button style={{float:'right'}} className="defaultBtn" onClick={this.closeModal}>close</button>
					<table>
						<tbody>
							<tr>
								<td style={{background:"#eee"}}>전체 지번 주소</td>
								<td>{clickedPlace.address_name}</td>
								<td style={{background:"#eee"}}>카테고리 그룹 코드</td>
								<td>{clickedPlace.category_group_code}</td>
							</tr>
							<tr>
								<td style={{background:"#eee"}}>카테고리 그룹명</td>
								<td>{clickedPlace.category_group_name}</td>
								<td style={{background:"#eee"}}>카테고리 이름</td>
								<td>{clickedPlace.category_name}</td>
							</tr>
							<tr>
								<td style={{background:"#eee"}}>중심좌표까지의 거리</td>
								<td>{clickedPlace.distance}</td>
								<td style={{background:"#eee"}}>전화번호</td>
								<td>{clickedPlace.phone}</td>
							</tr>
							<tr>
								<td style={{background:"#eee"}}>장소 상세페이지 URL</td>
								<td>{clickedPlace.place_url}</td>
								<td style={{background:"#eee"}}>전체 도로명 주소</td>
								<td>{clickedPlace.road_address_name}</td>
							</tr>
							<tr>
								<td style={{background:"#eee"}}>x 좌표값</td>
								<td>{clickedPlace.x}</td>
								<td style={{background:"#eee"}}>y 좌표값</td>
								<td>{clickedPlace.y}</td>
							</tr>
						</tbody>
					</table>
					<div id="map" style={{width:"100%",height:'350px'}}></div>
				</Modal>
				<div style={{width:'750px'}}>
					<table>
					<thead>
						<tr>
							<th>주소</th>
							<th>이름</th>
							<th>전화번호</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{(data && data.length > 0)?
							data.map( ( data, idx ) => {
								return (
									<tr key={idx}>
										<th>{data.address_name}</th>
										<td>{data.place_name}</td>
										<td>{data.phone}</td>
										<td><button className="defaultBtn" onClick={(e) => this.handleBtnClick(data)}>More</button></td>
									</tr>
								)
							})
							:<tr>
								<td colSpan="4">조회된 정보가 없습니다.</td>
							</tr>
						}
					</tbody>
					</table>
				</div>
			</div>
			
		)
	}
}
export default PlaceList;