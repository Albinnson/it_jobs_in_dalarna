import React from 'react';
import PropTypes from 'prop-types'

export default class NextBuss extends React.Component {

	render() {
		return (
			<div>
				{this.props.haveTravelData ?
					<div>
						<h5>Travel Information: Travel.js Departure[0].name</h5>
						<span>Tid: {this.props.travelPlan.Departure[0].time}</span><br/>
						<span>Till: {this.props.travelPlan.Departure[0].direction}</span><br/>
						<span>Info: {this.props.travelPlan.Departure[0].name}</span>

					</div>
					: ''
				}
			</div>
		);
	}
}

NextBuss.propTypes = {
	travelPlan: PropTypes.object,
	haveTravelData: PropTypes.bool,
};

