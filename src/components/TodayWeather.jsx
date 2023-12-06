import React from "react";
import "./TodayWeather.css";

const TodayWeather = ({ value, img }) => {
  return (
    <div class="today">
      <div class="value">
        <p class="tag-heading">Today</p>
        <p class="forcast-temp">{value} &#8451;</p>
      </div>
      <img src={img} class="demonstrated-img" alt="icon" />
    </div>
  );
};

export default TodayWeather;
