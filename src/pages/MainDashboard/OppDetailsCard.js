import React, { Component } from "react";
import "../../styles/Card1.css";

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
    let { title, details, baseColor } = this.props;

    const cardStyle = {
        // backgroundImage: "linear-gradient(to right, white, grey)",

      backgroundColor: 'white',
      transition: "transform 0.3s ease",
    //   transform: this.state.isHovered ? "scale(1.05)" : "scale(1)",
      color: "#000", // Black text color
        innerHeight: '100px'
    };

    return (
      <div
        className="card"
        style={cardStyle}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <div className="card-body">
          {/* <h3 className="card-title">{title}</h3> */}
          

          <div className="card-details2">
            <table>
                <tbody>
                    {details.map((detail, index) => (
                        <tr key={index}>
                            <td><strong>{detail.label}:</strong></td>
                            <td>{detail.value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>


        </div>
      </div>
    );
  }
}