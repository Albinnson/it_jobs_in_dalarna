import {Popup} from "react-leaflet";
import PropTypes from "prop-types";
import React from "react";
import './PopupCompany.css';

import Atea from '../img/atea.jpg';
import CGI from '../img/cgi.jpg';
import Knowit from '../img/knowit.jpg';
import Headlight from '../img/headlight.jpg';
import Xlent from '../img/xlent.jpg';
import Panang from '../img/panang.jpg';
import Tension from '../img/tension.jpg';
import Nethouse from '../img/nethouse.jpg';
import ITSystem from '../img/itsystem.jpg';
import Triatech from '../img/triatech.jpg';

export default class CompaniesLocation extends React.Component {
	state = {
		resPlanerareKey: "888044d8-84d6-4c05-a7c8-08927fb9a9cd",
		userStop: {
			isSet: false,
			ID: "",
		},
		companyStop: {
			isSet: false,
			ID: "",
		},
		trip: {
			start: "",
			startTime: "",
			stop: "",
			stopTime: "",
			name: "",
			isSet: false,
		},
	};

	static getImageByCompanyName(param, link) {
		console.log(param);
		switch (param) {
			case 'Atea':
				return <a href={link}> <img src={Atea} width={'133px'} alt={'Link to Atea web page'}/></a>;
			case 'CGI':
				return <a href={link}> <img src={CGI} width={'133px'} alt={'Link to CGI web page'}/></a>;
			case 'Knowit':
				return <a href={link}> <img src={Knowit} width={'133px'} alt={'Link to Knowit web page'}/></a>;
			case 'Headlight':
				return <a href={link}> <img src={Headlight} width={'133px'} alt={'Link to Headlight web page'}/></a>;
			case 'Xlent':
				return <a href={link}> <img src={Xlent} width={'133px'} alt={'Link to Xlent web page'}/></a>;
			case 'Panang':
				return <a href={link}> <img src={Panang} width={'133px'} alt={'Link to Panang web page'}/></a>;
			case 'Tension':
				return <a href={link}> <img src={Tension} width={'133px'} alt={'Link to Tension web page'}/></a>;
			case 'Nethouse':
				return <a href={link}> <img src={Nethouse} width={'133px'} alt={'Link to NetHouse web page'}/></a>;
			case 'IT System Dalarna':
				return <a href={link}> <img src={ITSystem} width={'133px'} alt={'Link to IT System Dalarna web page'}/></a>;
			case 'Triatech':
				return <a href={link}> <img src={Triatech} width={'133px'} alt={'Link to Tritech web page'}/></a>;

			default:
				return '';
		}
	}

	getBussFromUserLocation(userLat, userLng, companyLat, companyLng) {

		let userStops = `https://api.resrobot.se/v2/location.nearbystops?key=${this.state.resPlanerareKey}&originCoordLat=${userLat}&originCoordLong=${userLng}&format=json`;
		let companyStops = `https://api.resrobot.se/v2/location.nearbystops?key=${this.state.resPlanerareKey}&originCoordLat=${companyLat}&originCoordLong=${companyLng}&format=json`;

		var self = this;
		fetch(userStops)
			.then(function (response) {
				console.log(response);
				response.json()
					.then(function (data) {
						console.log(data);
						self.setState({
							userStop: {
								isSet: true,
								ID: data.StopLocation[0].id,
							}
						});
					}).catch(error => console.error('Error json():', error))
			}).catch(error => console.error('Error response: ', error));
		fetch(companyStops)
			.then(function (response) {
				console.log(response);
				response.json()
					.then(function (data) {
						console.log(data);
						self.setState({
							companyStop: {
								isSet: true,
								ID: data.StopLocation[0].id,
							}
						});
					}).catch(error => console.error('Error json():', error))
			}).catch(error => console.error('Error response: ', error));

	};

	getTrip() {
		var self = this;
		let tripUrl = `https://api.resrobot.se/v2/trip?key=${this.state.resPlanerareKey}&originId=${this.state.userStop.ID}&destId=${this.state.companyStop.ID}&originWalk=0&destWalk=0&passlist=0&format=json`;
		fetch(tripUrl)
			.then(function (response) {
				console.log(response);
				response.json()
					.then(function (data) {
						console.log(data);
						self.setState({
							trip: {
								start: data.Trip[0].LegList.Leg[0].Origin.name,
								startTime: data.Trip[0].LegList.Leg[0].Origin.time,
								stop: data.Trip[0].LegList.Leg[0].Destination.name,
								stopTime: data.Trip[0].LegList.Leg[0].Destination.time,
								name: data.Trip[0].LegList.Leg[0].name,
								isSet: true,
							}
						});
					}).catch(error => console.error('Error json():', error))
			}).catch(error => console.error('Error response: ', error));
	}

	render() {
		return (
			<Popup>
				<div className="popupCompanyDiv">
					<div className="popupCompanyImageDiv">
						{CompaniesLocation.getImageByCompanyName(this.props.AllAPIs.name, this.props.AllAPIs.webpage)}
					</div>

					{/*<p>Name: {this.props.AllAPIs.name}</p>*/}
					{/*<p>Webpage: {this.props.AllAPIs.webpage}</p>*/}

					<span><strong>Leadiga Jobb i {this.props.AllAPIs.city}</strong></span><br/>
					<span>{this.props.AllAPIs.platsannonser} platsannonser</span><br/>
					<span>{this.props.AllAPIs.ledigajobb} jobb</span><br/>

					<button
						onClick={() => {
							this.getBussFromUserLocation(this.props.userLat, this.props.userLng, this.props.companyLat, this.props.companyLng)
						}}>Next
						buss
					</button>
					<div>{this.state.userStop.isSet && this.state.companyStop.isSet && !this.state.trip.isSet ?
						this.getTrip() : ''}</div>

					<div>{this.state.trip.isSet ?
						<div>
							<p>{this.state.trip.name}</p>
							<p>Start: {this.state.trip.startTime} <br/>{this.state.trip.start} </p>
							<p>Stop: {this.state.trip.stopTime} <br/>{this.state.trip.stop}</p>
						</div>: ''}</div>

				</div>
			</Popup>

		)
	}

}

CompaniesLocation.propTypes = {
	AllAPIs: PropTypes.object,
	i: PropTypes.number,
	userLat: PropTypes.string,
	userLng: PropTypes.string,
	companyLat: PropTypes.string,
	companyLng: PropTypes.string,
	haveUserLocation: PropTypes.bool,   //Behövs den?
};