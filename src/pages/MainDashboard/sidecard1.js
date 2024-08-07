import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { FaMinus, FaPlus } from 'react-icons/fa'; // Import icons from react-icons
import './sidecard.css';
const CountCard = ({ title, baseColor, details }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className="count-card" style={{ borderColor: baseColor, color: 'white', background: 'rgb(33, 150, 243)'}}>
      <div className="expand-toggle">
        <button className="expand-button" onClick={toggleExpand}>
          {expanded ? <FaMinus /> : <FaPlus />}
        </button>
      </div>
      <Card.Header style={{ fontWeight: 'bold', fontSize: '1.1em' }}> GoNoGo Status : {title}</Card.Header>
      <Card.Body style={{ display: expanded ? 'block' : 'none', textAlign: 'left' }}>
        <ul style={ {listStyleType: 'none', paddingLeft: 0 }}>
          {details.map((detail, index) => (
            <li key={index}>
              <strong>{detail.label}:</strong> {detail.value}
            </li>
          ))}
        </ul>
      </Card.Body>
    </Card>
  );
};

export default CountCard;
