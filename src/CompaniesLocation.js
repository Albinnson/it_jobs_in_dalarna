import {LayersControl, Map, Marker, Popup} from "react-leaflet";
import {Footer} from "./Footer";
import PropTypes from "prop-types";
import React from "react";


export default class CompaniesLocation extends React.Component {

	render() {
		return (
			<div>
				{this.props.haveAllAPIs ?
					<LayersControl>
						{this.props.allAPIs.map((key, i) => {
							return <Marker
								position={[this.props.allAPIs[i].lng, this.props.allAPIs[i].lat]}>
								<Popup>
									<div className="popupDiv">
										<img src={this.props.allAPIs[i].image} className="popupImage"/>

										{this.props.allAPIs[i].name} <br/>
										<a href={this.props.allAPIs[i].webpage}> {this.props.allAPIs[i].webpage} </a>
										<p>Lediga jobb
											i {this.props.allAPIs[i].city}: {this.props.allAPIs[i].ledigajobb} ({this.props.allAPIs[i].platsannonser} annonser)</p>


										{/*<button onClick={this.getNextBus(this.state.userBusStopID, this.state.userBusStopID)}>*/}
										{/*	Nästa buss*/}
										{/*</button>*/}

										{/*<Footer*/}
										{/*	name={this.state.busStopName}*/}
										{/*	time={this.state.busDeptTime}*/}
										{/*	destination={this.state.busStopDirection}*/}
										{/*/>*/}

									</div>
								</Popup>
							</Marker>
						})}
					</LayersControl>
					: ''
				}
			</div>
		);
	}
}

CompaniesLocation.propTypes = {
	aveAllAPIs: PropTypes.bool,
	AllAPIs: PropTypes.array,
	userBusStopID: PropTypes.string,
};











