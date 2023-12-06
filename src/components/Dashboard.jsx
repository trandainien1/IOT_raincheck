import React from "react";
import GeneralInfo from "./GeneralInfo";
import MeasurementContainer from "./MeasurementContainer";
import "./Dashboard.css";
import PullClothButton from "./PullClothButton";
import WeatherInfo from "./WeatherInfo";
import cloudy from "../imgs/cloudy.svg";
import TodayWeather from "./TodayWeather";

const Dashboard = () => {
  // const cloudy = "../imgs/cloudy.svg"; // replace with your actual path
  const element = { value: 33, img: cloudy, day: "Tomorrow", date: "2/2/2023" };
  const array = new Array(7).fill(element);
  console.log(array);

  return (
    <>
      <div className="main-dashboard">
        <GeneralInfo />
        <MeasurementContainer />
      </div>
      <div className="side-dashboard">
        <PullClothButton />
        <h5>FORCAST THIS WEEK</h5>
        <TodayWeather value={33} img={cloudy} />
        {array.map((item) => (
          <WeatherInfo
            day={item.day}
            date={item.date}
            value={item.value}
            img={cloudy}
          />
        ))}
      </div>
    </>
  );
};

export default Dashboard;
