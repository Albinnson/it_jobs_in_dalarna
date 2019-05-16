// TODO när popup öppnas första gången kommer bilderna utanför på heroku

// TODO Gör klart komponeneter, med miniumum krav för funktion design

//TODO PopupUser: Next buss komponenten fungerar ej i egen koponent
//TODO PupupUser Extra: Byt markör. När positionen ändras, ändras inte platsen för närmast hållplats.
//TODO PupupUser Extra: Zooma när vi har användarens location. Om användarens location är utanför dalarna visa en generell zoom över dalarna

// TODO PopupCompany: Text Design, Ta bort muspekare på bilder.
// TODO Extra PopupCompany: Knapp som visar bussar till företaget från användaarens position

//TODO Design: Footer, Div struktur
//TODO Design extra: Titta på liknande sidor för inspiration

// TODO Kommentera koden på svenska
// TODO Ta bort de states, komponenter och kod som inte används
// TODO Presentation: JSX, Web Pack, Komponenter, React Lifecyckel

//TODO Hosting: Starta ett nytt projekt med git, där endast de filerna / webpack som används är med
//TODO Hosting: Hitta en server för att hosta applikationen

//TODO OLD: Dessa todo är gammla och antagligen omskrivna ovan
//TODO OLD: Lägg till trafikrobot API för att visa resor
//TODO OLD: Skriv kod för att göra en generell zoom om location inte är i Dalarna
//TODO OLD: Resrobot: När positionen ändras, ändras inte platsen för närmast hållplats
//TODO OLD: Resrobot: Stolptider, det ska gå att se busstider till de olika företagen
//TODO OLD: Nästa buss är hårdkodat med ett ID, byta det till IDet som returneras av resrobot

// heroku login
// h17erial@du.se
// -:4mDXKuStDs49M


import React, {Component} from 'react';

import {Map, TileLayer, Marker, Popup, LayersControl, CircleMarker} from 'react-leaflet';
import L from 'leaflet';
import './App.css';
import {Footer} from './Footer';
import NextBuss from './componenets/NextBuss';
import PopupUser from './componenets/PopupUser';
import CompaniesLocation from './CompaniesLocation';
import PopupCompany from './componenets/PopupCompany';
import News from './componenets/News'
import Header from './componenets/Header'

//Images
import Partners from './img/partners.png';

import cgi from './img/cgi.jpg';
import PropTypes from "prop-types";

//Fix for bug in leaflet-react, code below replace the broken link that has some extra code in the end.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
	iconUrl: require('leaflet/dist/images/marker-icon.png'),
	shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

class App extends Component {
	state = {
		location: {
			lat: 60.48734,
			lng: 15.40957,
		},
		userLocation: {
			lat: 0,
			lng: 0,
		},
		userBusStop: "Borlänge Studieplan",
		companyBusStop: "",
		userBusStopID: "740000001",
		companyBusStopID: "740001587",
		haveUsersLocation: false,
		zoom: 10,
		companies: [],
		haveCompanies: false,
		jobs: [],
		haveJobs: false,
		haveAllAPIs: false,
		allAPIs: [],
		test: "http://users.du.se/~h17erial/bilder/dhl.jpg",
		resRobotKey: "888044d8-84d6-4c05-a7c8-08927fb9a9cd",
		resRobotLat: 60.48734,
		resRobotLng: 15.40957,
		resRobot: [],
		haveResRobot: false,
		tidRobotKey: "c2d33a0c-6b6b-4529-817b-6354d7f01774",
		tidRobot: [],
		haveTidRobot: false,
		openWeather: [],
		haveOpenWeather: false,
		newsapi: "291363f270604336a173f0a58211b179",
		scienceNews: [],
		haveScienceNews: false,
		travelData: [],
		haveTravelData: false,
		busDeptTime: "",
		busStopName: "",
		busStopDirection: "",
		reseplanerareKey: "d8-84d6-4c05-a7c8-08927fb9a9cd",
		stolptidtabellerKey: "26dc26e69-0d3a-4dcb-be98-9c3f6e36b983",

	};

	//Hjälpmetod för att sätta användarens position
	setLocation() {
		window.navigator.geolocation.getCurrentPosition((success) => {
			this.setState({

				//Varför vill vi sätta båda? Location skall bara ändras om den är i dalarna
				location: {
					lat: success.coords.latitude,
					lng: success.coords.longitude
				},
				userLocation: {
					lat: success.coords.latitude,
					lng: success.coords.longitude
				},
				haveUsersLocation: true,
			});
			this.getYourNearestStation();
			this.getWeather();

		})
	}

	// Hämtar jsondata från arbetsförmedlings API
	getJobAdvertisement() {
		console.log("entering getJobAdvertisement");
		let self = this;
		fetch("https://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/kommuner?lanid=20")
			.then(function (response) {
				console.log(response);
				response.json()
					.then(function (data) {

						self.setState({
							jobs: data.soklista.sokdata,
							haveJobs: true,
						}, self.findRoutes);

						//Anropar functionen efter att datan från arbetsförmedlingen är hämtad
						self.createFetchArray()
					}).catch(error => console.error('Error json():', error))
			}).catch(error => console.error('Error response: ', error));

	}

	// Sammanställer data från APIer till en array
	createFetchArray() {

		var mainArray = [];

		for (let i = 0; i < this.state.companies.length; i++) {
			var tempArray = [];
			var city = this.state.companies[i].properties.city;

			//Loop för att lägga till från Arbetsförmedlingens API
			for (let j = 0; j < this.state.jobs.length; j++) {

				if (city === this.state.jobs[j].namn) {
					tempArray.push({
						name: (this.state.companies[i].properties.name),
						webpage: this.state.companies[i].properties.webpage,
						city: this.state.companies[i].properties.city,
						lat: this.state.companies[i].geometry.coordinates[1],
						lng: this.state.companies[i].geometry.coordinates[0],
						image: this.state.companies[i].properties.image,
						id: (this.state.jobs[j].id),
						// city_jobs: this.state.jobs[j].namn,
						platsannonser: this.state.jobs[j].antal_platsannonser,
						ledigajobb: this.state.jobs[j].antal_ledigajobb
					});
					//Det kan matcha flera gånger, därför används break
					break;
				}
			}
			mainArray.push(tempArray[0]);
		}

		this.setState({
			haveAllAPIs: true,
			allAPIs: mainArray,
		});
	}

	// Hämtar data från local json-fil
	getCompanies() {
		let self = this;
		fetch("companies.json")
			.then(function (response) {
				response.json()
					.then(function (data) {
						console.log("start fetching data from local json file");
						self.setState({
							companies: data.features,
							haveCompanies: true,
						});
					}).catch(error => console.error('Error json():', error))
			}).catch(error => console.error('Error response: ', error));
		console.log("done with fetching from local json file");
		//
		this.getJobAdvertisement();
	}

	//TODO resrobot
	getYourNearestStation() {

		const resRobotAPIUrl = `https://api.resrobot.se/v2/location.nearbystops?key=${this.state.resRobotKey}&originCoordLat=${this.state.resRobotLat}&originCoordLong=${this.state.resRobotLng}&format=json`;
		console.log(resRobotAPIUrl);

		let self = this;
		fetch(resRobotAPIUrl)
			.then(function (response) {
				console.log(response);
				response.json()
					.then(function (data) {
						console.log("resRobot Fetch  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ");
						console.log(data);

						var busStop = data.StopLocation[0].name;
						console.log(busStop);

						self.setState({
							resRobot: data,
							haveResRobot: true,
							userBusStopID: data.StopLocation[0].id,
							userBusStop: data.StopLocation[0].name,
						}, self.findRoutes);

					}).catch(error => console.error('Error json():', error))
			}).catch(error => console.error('Error response: ', error))
	}

	//Hämtar in rutter till destination, API kräver ett ID för start hållplats / slut hållplats
	getTravelInfo() {

		console.log("Starting getTravelInfo...");
		const userBusStop = this.state.userBusStop;
		const resRobotAPIUrl = `https://api.resrobot.se/v2/trip.json?key=?key=${this.state.reseplanerareKey}&originCoordLat=${this.state.resRobotLat}&originCoordLong=${this.state.resRobotLng}&format=json`;

		// URL: https://api.resrobot.se/v2/trip.json?key=<KEY>&originId=740000001&destId=740001587&passlist=0&date=2019-05-09&time=09:15

		let self = this;
		fetch("index1.php?controller/")
			.then(function (response) {
				console.log(response);
				response.json()
					.then(function (data) {
						console.log(data);

					}).catch(error => console.error('Error json():', error))
			}).catch(error => console.error('Error response: ', error))

	}

	getNextBus = (originId, destId) => (e) => {

		let date = (new Date().getFullYear() + "-" + ("0" + new Date().getDate()).slice(-2) + "-" + ("0" + new Date().getDay()).slice(-2));
		let time = ("0" + new Date().getHours()).slice(-2) + ":" + ("0" + new Date().getMinutes()).slice(-2);

		var url2 = `https://api.resrobot.se/v2/departureBoard?key=0b245f24-07d3-464e-9838-9e1b9fd5530a&id=${originId}&date=${date}&time=${time}&passlist=0&maxJourneys=1&format=json`;
		var url = `https://api.resrobot.se/v2/departureBoard?key=0b245f24-07d3-464e-9838-9e1b9fd5530a&id=${originId}&maxJourneys=1&format=json`;

		console.log(url);
		var self = this;
		fetch(url)
			.then(function (response) {
				console.log(response);
				response.json()
					.then(function (data) {

						console.log("fetch: departureBoard....");
						console.log(data);

						self.setState({
							busDeptTime: data.Departure[0].time,
							busStopName: data.Departure[0].name,
							busStopDirection: data.Departure[0].direction,
							travelData: data,
							haveTravelData: true,
						}, self.findRoutes);

					}).catch(error => console.error('Error json():', error))
			}).catch(error => console.error('Error response: ', error))

	};

	//Hämtar väder från openweater API
	getWeather() {
		const openWeatherAPIUrl = "http://api.openweathermap.org/data/2.5/weather?lat=" + this.state.location.lat + "&lon=" + this.state.location.lng + "&APPID=f1dfc66d861c916faf761fa9273970df&units=metric"
		console.log(openWeatherAPIUrl);

		let self = this;
		fetch(openWeatherAPIUrl)
			.then(function (response) {
				console.log(response);
				response.json()
					.then(function (data) {

						console.log("open weather:");
						console.log(data);
						// console.log(data.weather[0].description);
						// console.log(data.main.temp);
						// console.log(data.wind.speed);

						self.setState({
							openWeather: data,
							haveOpenWeather: true,
						});

					}).catch(error => console.log('Error json():', error));
			}).catch(error => console.log('Error response: ', error));

	}

	getNews() {
		// Populära vetenskaps nyheter i sverige
		var url3 = 'https://newsapi.org/v2/top-headlines?country=se&category=science&apiKey=291363f270604336a173f0a58211b179';

		let self = this;
		fetch(url3)
			.then(function (response) {
				console.log(response);
				response.json()
					.then(function (data) {
						console.log("News by Google");
						console.log(data);
						console.log(data.articles[0].author);

						self.setState({
							scienceNews: data,
							haveScienceNews: true,
						});

					}).catch(error => console.error('Error json():', error))
			}).catch(error => console.error('Error response: ', error))

	}

	componentDidMount() {
		this.setLocation();
		this.getYourNearestStation();
		this.getCompanies();
		this.getNews();
		this.getNextBus();
		this.getTravelInfo()
	}

	render() {
		const position = [this.state.location.lat, this.state.location.lng];

		console.log("Printing position from render()");
		console.log(position);
		console.log(position[0]);

		return <div className="MainDiv">

			{/*<NextBuss haveTravelData={this.state.haveTravelData}*/}
			{/*          travelPlan={this.state.travelData}*/}
			{/*/>*/}
			<Header/>

			<Map className="map"
			     center={position}
			     zoom={this.state.zoom}>

				<TileLayer attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

				<PopupUser userLocation={position}
				           haveUsersLocation={this.state.haveUsersLocation}
				           openWeather={this.state.openWeather}
				           resRobot={this.state.resRobot}
				           haveOpenWeather={this.state.haveOpenWeather}
				           haveResRobot={this.state.haveResRobot}
				           travelData={this.state.travelData}
				           haveTravelData={this.state.haveTravelData}/>


				{this.state.haveAllAPIs ?
					<LayersControl>
						{this.state.allAPIs.map((key, i) => {
							return <Marker
								position={[this.state.allAPIs[i].lat, this.state.allAPIs[i].lng]}>

								<PopupCompany AllAPIs={this.state.allAPIs[i]}
								              userLat={this.state.userLocation.lat}
								              userLng={this.state.userLocation.lng}
								              companyLat={this.state.allAPIs[i].lat}
								              companyLng={this.state.allAPIs[i].lng}
								              haveUserLocation={this.state.haveUsersLocation}
								/>

							</Marker>
						})}
					</LayersControl>
					: ''
				}

			</Map>


			<div className="row">
				<div className="column1"><News haveScienceNews={this.state.haveScienceNews}
				                              scienceNews={this.state.scienceNews.articles}
				/>
				</div>



				<div className="column2 partners">
					<h3 className="column">Våra sammarbets Partners</h3>
					<img src={Partners} width='500px'/>
				</div>
			</div>

		</div>
			;
	}
}

export default App;

