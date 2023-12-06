import React from "react";
import "./MeasurementCard.css";

const MeasurementCard = ({ className, value, img_url }) => {
  return (
    <div className={className.toLowerCase()}>
      <div class="val-field">
        <p class="heading">{className}</p>
        <p class="sub-head">Current {className}</p>
        <p class="val">{value}</p>
      </div>
      <img src={img_url} class="demonstrated-img" alt="icon" />
    </div>
  );
};

export default MeasurementCard;
