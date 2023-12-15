import React from "react";
import MeasurementCard from "./MeasurementCard";
import "./MeasurementContainer.css";
import temp_img from "../imgs/temperature.svg";
import humi_img from "../imgs/humidity.svg";
import light_img from "../imgs/light.svg";
import rain_img from "../imgs/rain.svg";

const MeasurementContainer = ({
  temp = 33,
  humidity = 123,
  light = "Day",
  rain = 1024,
}) => {
  return (
    <>
      <div className="temp-humid">
        <MeasurementCard
          className="Temperature"
          value={String(temp) + "℃"}
          img_url={temp_img}
        />
        <MeasurementCard
          className="Humidity"
          value={String(humidity) + "%"}
          img_url={humi_img}
        />
      </div>
      <div className="light-rain">
        {light == "1" ? (
          <MeasurementCard
            className="Light"
            value="Night"
            img_url={light_img}
          />
        ) : (
          <MeasurementCard className="Light" value="Day" img_url={light_img} />
        )}
        <MeasurementCard className="Rain" value={rain} img_url={rain_img} />
      </div>
    </>
  );
};

export default MeasurementContainer;
