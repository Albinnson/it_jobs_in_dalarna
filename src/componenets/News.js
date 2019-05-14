import React from "react";
import PropTypes from "prop-types";
import "./News.css"

export default class News extends React.Component {

	render() {
		return (
			<div className="FooterDiv">

				<div className="NewsDiv">
					<h3 className="Header">De senaste IT nyheterna</h3>
					{this.props.haveScienceNews ?
						<div>
							{this.props.scienceNews.map((key, i) => {
								return <span>
								{/*<p>{this.state.scienceNews.articles[i].author}</p>*/}
									{/*<p>{this.state.scienceNews.articles[i].content}</p>*/}

									<span>{this.props.scienceNews[i].title} <a
										href={this.props.scienceNews[i].url}> Läs mer </a></span><br/>
							</span>
							})}
						</div>
						: ''
					}
				</div>
			</div>
		)
	}
}

News.propTypes = {
	scienceNews: PropTypes.object,
	haveScienceNews: PropTypes.bool,
	// image: PropTypes.object
};
