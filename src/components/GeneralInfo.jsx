import React from "react";
import "./GeneralInfo.css";

const GeneralInfo = () => {
  return (
    <div className="general-info">
      <div class="location-date">
        <div class="location">
          <i class="bx bxs-map-pin"></i>
          <p class="location-name">TP. Hồ Chí Minh</p>
        </div>
        <p class="date">Tuesday, 29/12/2023</p>
      </div>

      <p class="time">4: 23 AM</p>

      <div class="hpa-wind">
        <div class="hpa">
          <i class="bx bxs-tree-alt"></i>
          <p class="hpa-val">12hpa</p>
        </div>
        <div class="wind">
          <i class="bx bx-wind"></i>
          <p class="wind-val">12 km/h</p>
        </div>
      </div>
    </div>
  );
};

export default GeneralInfo;
