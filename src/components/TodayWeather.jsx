import React from "react";
import "./TodayWeather.css";

const TodayWeather = ({ value, img }) => {
  return (
    <div className="today">
      <div className="value">
        <p className="tag-heading">Today</p>
        <p className="forcast-temp">{value} &#8451;</p>
      </div>
      <img src={img} className="demonstrated-img" alt="icon" />
    </div>
  );
};

export default TodayWeather;
