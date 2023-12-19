import React from "react";
import "./MeasurementCard.css";

const MeasurementCard = ({ className, value, img_url }) => {
  return (
    <div className={className.toLowerCase()}>
      <div className="val-field">
        <p className="heading">{className}</p>
        <p className="sub-head">Current {className}</p>
        <p className="val">{value}</p>
      </div>
      <img src={img_url} class="demonstrated-img" alt="icon" />
    </div>
  );
};

export default MeasurementCard;
