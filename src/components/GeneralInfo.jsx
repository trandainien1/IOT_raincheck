import React, { useEffect, useState } from "react";
import "./GeneralInfo.css";


const GeneralInfo = () => {
  const getFormattedTime = () => {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();
    const meridiem = hours >= 12 ? "PM" : "AM";

    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds} ${meridiem}`;
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
  const [location, setLocation] = useState("Loading...")
  const [wind, setWind] = useState('')
  const [pressure, setPressure] = useState(0)
  useEffect(() => {
    const timeIntervalId = setInterval(() => {
      setCurrentTime(getFormattedTime());
    }, 1000);

    const dateIntervalId = setInterval(() => {
      setCurrentDate(getCurrentDate());
    }, 60000); // Update the date every minute

    const apiKey = "5ababf5df792a59de71aae06ede839dd";
    const cityId = "1566083";
    const url =
      "http://api.openweathermap.org/data/2.5/forecast?id=" +
      cityId +
      "&APPID=" +
      apiKey +
      "&units=imperial";

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const cityName = data.city.name + ", " + data.city.country;
        const collection = data.list.filter((item) =>
          item.dt_txt.includes("12:00:00")
        );
        const wind = (collection[0].wind.speed * 3.6).toFixed(1) + " km/h"
        const pressure = (collection[0].main.pressure) + " hpa"

        setLocation(cityName)
        setWind(wind)
        setPressure(pressure)
      })
      .catch((error) => console.error("Error: ", error))

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

      <p className="time" id="current-time">{currentTime}</p>

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
