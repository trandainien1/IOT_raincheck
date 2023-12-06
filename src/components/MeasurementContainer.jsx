import React from "react";
import MeasurementCard from "./MeasurementCard";
import "./MeasurementContainer.css";
import temp_img from "../imgs/temperature.svg";
import humi_img from "../imgs/humidity.svg";
import light_img from "../imgs/light.svg";
import rain_img from "../imgs/rain.svg";

const MeasurementContainer = () => {
  return (
    <>
      <div className="temp-humid">
        <MeasurementCard
          className="Temperature"
          value={String(33) + "℃"}
          img_url={temp_img}
        />
        <MeasurementCard
          className="Humidity"
          value={String(123) + "%"}
          img_url={humi_img}
        />
      </div>
      <div className="light-rain">
        <MeasurementCard className="Light" value={33} img_url={light_img} />
        <MeasurementCard className="Rain" value="Not rain" img_url={rain_img} />
      </div>
    </>
  );
};

export default MeasurementContainer;
