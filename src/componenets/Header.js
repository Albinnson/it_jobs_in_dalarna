import React, {Component} from 'react';
import Navbar from "react-bootstrap/Navbar";
import Logo from "../img/icon.png"
import "./Header.css"

class Header extends Component {
	render() {
		return (
			<div className="HeaderDiv">
				<Navbar bg="dark" variant="dark">
					<div className="HeaderInnerDiv">
						<img
							alt=""
							src={Logo}
							className="LogoImg"
						/>
						<span className="LogoText">{'IT'}</span><span className="LogoText2">{'Jobb Dalarna'}</span>
					</div>
				</Navbar>
			</div>
		)
	}
}

export default Header;