import React, { useEffect, useState } from "react";
import "./GeneralInfo.css";

const GeneralInfo = ({ location = "Loading", wind = "Loading", pressure = "Loading", }) => {
  const getFormattedTime = () => {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();
    const meridiem = hours >= 12 ? "PM" : "AM";

    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""
      }${seconds} ${meridiem}`;
  };

  const getCurrentDate = () => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const currentDate = new Date();
    const dayOfWeek = daysOfWeek[currentDate.getDay()];
    const dateOfMonth = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Months are zero-based
    const year = currentDate.getFullYear();
    const dateString = `${dayOfWeek}, ${dateOfMonth}/${month}/${year}`;

    return dateString;
  };

  const [currentTime, setCurrentTime] = useState(getFormattedTime());
  const [currentDate, setCurrentDate] = useState(getCurrentDate());

  useEffect(() => {
    const timeIntervalId = setInterval(() => {
      setCurrentTime(getFormattedTime());
    }, 1000);

    const dateIntervalId = setInterval(() => {
      setCurrentDate(getCurrentDate());
    }, 60000); // Update the date every minute	

    return () => {
      clearInterval(timeIntervalId);
      clearInterval(dateIntervalId);
    };
  }, []);
  return (
    <div className="general-info">
      <div className="location-date">
        <div className="location">
          <i className="bx bxs-map-pin"></i>
          <p className="location-name">{location}</p>
        </div>
        <p className="date">{currentDate}</p>
      </div>

      <p className="time" id="current-time">
        {currentTime}
      </p>

      <div className="hpa-wind">
        <div className="hpa">
          <i className="bx bxs-tree-alt"></i>
          <p className="hpa-val">{pressure}</p>
        </div>
        <div className="wind">
          <i className="bx bx-wind"></i>
          <p className="wind-val">{wind}</p>
        </div>
      </div>
    </div>
  );
};

export default GeneralInfo;
