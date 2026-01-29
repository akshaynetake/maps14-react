import React from "react";
import "./mapCard.css";
import sample from "../../data/sample.jpg";

function MapCard({ data, onEnter, onLeave }) {
  if (!data) return null;

  return (
    <div
      className="hover-card"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="mp-c-i-container">
        <img
          src={sample}
          alt={data.name}
          className="hover-card-img"
          draggable={false}
        />
      </div>

      <div className="mp-c-c-container">
        <div className="hover-card-body">
          <div className="title">{data.name}</div>
          <div className="price">₹ {data.price}</div>
        </div>
      </div>
    </div>
  );
}

export default MapCard;
