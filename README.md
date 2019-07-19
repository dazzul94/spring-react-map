# spring-react-map (2019-06-28 - 2019-07-03)

#### 1. Springboot + React - 카카오맵 API를 활용한 장소검색 서비스입니다.
- JAVA 8
- Spring Boot
- Maven
- H2
- React

#### 2. 외부 라이브러리 사용
- Thymeleaf: 서버에서 전달받은 값을 html로 쉽게 뿌리기 위해서 사용
- JPA, rest, lombok: JPA
- Spring Security: Springboot 기반 로그인 구현
- React: SPA(Single Page Application)으로 구현
- Web socket & stompjs: 여러 사용자가 이용할 때 실시간으로 데이터를 받아야하는 경우 (ex.검색어랭킹) 가 있기 때문에 소켓으로 구현
- H2: h2 메모리 데이터베이스 사용
- Tomcat: Executable jar 파일로 패키징시 실행할 때 tomcat이 필요

#### 3. Executable jar 형태로 만들어 Github에 업로드
- [Executable jar file Download](https://github.com/dazzul94/spring-react-map/raw/master/deploy/spring-react-map-0.0.1-SNAPSHOT.jar).
- java -jar spring-react-map-0.0.1-SNAPSHOT.jar

#### 4. 테스트 계정
- admin / 1111
- admin2 / 2222
- -> localhost:8080으로 접속
