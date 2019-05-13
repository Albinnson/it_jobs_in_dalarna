//Det här är en stateless componenet.
import React, {Component} from 'react';
import NextBuss from "./componenets/NextBuss";

export const Footer = (props) => {

	return (
		<div>
			<h5>Nästa buss </h5>
			<span>{props.time} {props.destination}</span><br/>
			<span>{props.name}</span>
		</div>
	);
};

NextBuss.defaultProps = {

};

//
// export default Welcome;

// class Welcome extends Component {
// 	render() {
// 		return (
// 			<div>
// 				<h5>we are a non profit organization helping students in Dalarna to find work </h5>
// 			</div>
// 		);
// 	}
// }
//
// export default Welcome;