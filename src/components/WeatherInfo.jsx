import React from "react";
import "./WeatherInfo.css";

const WeatherInfo = ({ day, date, value, img }) => {
  return (
    <div className="next-day">
      <div class="date-info">
        <p class="date-info-head">{day}</p>
        <p class="date-info-detail">{date}</p>
      </div>
      <p class="forcast-temp-next">{value} &#8451;</p>
      <img src={img} class="demonstrated-img" />
    </div>
  );
};

export default WeatherInfo;
