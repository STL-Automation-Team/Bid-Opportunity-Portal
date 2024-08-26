import React, { Component } from "react";
import "../../styles/Card.css";

export default class CountCard extends Component {
  state = {
    isHovered: false,
  };

  handleMouseEnter = () => {
    this.setState({ isHovered: true });
  };

  handleMouseLeave = () => {
    this.setState({ isHovered: false });
  };

  render() {
    let { title, count, baseColor, cardLogo, onClick } = this.props;

    const cardStyle = {
      backgroundColor: baseColor,
      transition: "transform 0.3s ease",
      transform: this.state.isHovered ? "scale(1.05)" : "scale(1)",
    };

    console.log(title + baseColor);
    return (
        <div
          className="card"
          style={cardStyle}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          onClick={onClick}
        >
          <div className="card-body">
            <h5 className="card-title" style={{ position: "static", textDecoration: "none" }}>
              {count}
            </h5>
            <p className="card-text" style={{ position: "static"}}>{title}</p>
            {/* <img className="col-sm-6 cardicon" src={cardLogo} alt="sans" /> */}
          </div>
        </div>
      
    );
  }
}
