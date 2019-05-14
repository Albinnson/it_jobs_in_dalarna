import React from 'react';
import PropTypes from 'prop-types'
import {CircleMarker, Map, Popup} from "react-leaflet";

export default class PopupUser extends React.Component {
	state = {
		busDeptTime: "",
		busStopName: "",
		busStopDirection: "",
		travelData: [],
		haveTravelData: false,
	};

	getNextBus = (originId, destId) => (e) => {

		let date = (new Date().getFullYear() + "-" + ("0" + new Date().getDate()).slice(-2) + "-" + ("0" + new Date().getDay()).slice(-2));
		let time = ("0" + new Date().getHours()).slice(-2) + ":" + ("0" + new Date().getMinutes()).slice(-2);

		var url2 = `https://api.resrobot.se/v2/departureBoard?key=6dc26e69-0d3a-4dcb-be98-9c3f6e36b983&id=${originId}&date=${date}&time=${time}&passlist=0&maxJourneys=1&format=json`;
		var url = `https://api.resrobot.se/v2/departureBoard?key=6dc26e69-0d3a-4dcb-be98-9c3f6e36b983&id=${originId}&maxJourneys=1&format=json`;


		console.log(url);
		var self = this;
		fetch(url)
			.then(function (response) {
				console.log(response);
				response.json()
					.then(function (data) {

						console.log("fetch: departureBoard from PopupUser....");
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

	render() {
		return (
			<div>
				{this.props.haveUsersLocation ?
					<CircleMarker center={this.props.userLocation} fillColor="red"
					              color="gray" radius={15}>
						{this.props.haveOpenWeather && this.props.haveResRobot ?
							<Popup>

								<strong>Trafik</strong><br/>
								Your nearest station is: <br/>
								{this.props.resRobot.StopLocation[0].name} <br/>
								<br/>
								<strong>Weather</strong> <br/>
								temp: {this.props.openWeather.main.temp} <br/>
								weather: {this.props.openWeather.weather[0].description}<br/>
							</Popup>
							: ''
						}
					</CircleMarker>
					: ''
				}
			</div>
		);
	}
}

PopupUser.propTypes = {
	haveUsersLocation: PropTypes.bool,
	userLocation: PropTypes.string,

	haveOpenWeather: PropTypes.bool,
	openWeather: PropTypes.object,

	resRobot: PropTypes.object,
	haveResRobot: PropTypes.bool,

	travelData: PropTypes.object,
	haveTravelData: PropTypes.bool,

};