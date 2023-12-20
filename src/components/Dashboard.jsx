import React from "react";
import GeneralInfo from "./GeneralInfo";
import MeasurementContainer from "./MeasurementContainer";
import "./Dashboard.css";
import PullClothButton from "./PullClothButton";
import WeatherInfo from "./WeatherInfo";
import Clouds from "../imgs/light.svg";
import Rain from "../imgs/rain.svg";
import Drizzle from "../imgs/cloudy.svg";
import Thunderstorm from "../imgs/thunder.svg";
import TodayWeather from "./TodayWeather";
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../config/fire";
import Timer from "./Timer";
import CustomSlider from "./CustomSlider";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import { Box } from "@mui/material";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";

const formatDate = (dateString) => {
  const dateObject = new Date(dateString);
  const dayOfWeek = dateObject.getDay();

  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const formattedDate = `${dateObject.getDate().toString().padStart(2, "0")}/${(
    dateObject.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${dateObject.getFullYear()}`;

  return {
    dayOfWeek: weekdays[dayOfWeek],
    formattedDate: formattedDate,
  };
};

const Dashboard = () => {
  // for sliders
  const motor_time_marks = [
    {
      value: 1,
      label: "1s",
    },
    {
      value: 25,
      label: "25s",
    },
    {
      value: 50,
      label: "50s",
    },
  ];

  const totalMarks = 5;
  const maxValue = 1024;
  const step = maxValue / (totalMarks - 1);

  const rain_limit_marks = Array.from({ length: totalMarks }, (_, i) => ({
    value: i * step,
    label: `${i * step}`,
  }));

  // console.log(marks);

  const [inputValue1, setInputValue1] = useState("");
  const [inputValue2, setInputValue2] = useState("");
  let [storedValues, setStoredValues] = useState([]);
  let [count, setCount] = useState([]);
  let [motor, setRunMotor] = useState(false);

  const saveDataToFirestore = async () => {
    const docRef = await doc(db, "WebController", "VysXNFiC6Vnwrt1uxs2d");

    setDoc(docRef, {
      motorStatus: motor,
    });
  };

  const saveMotorPullTimeToFireStore = async (value) => {
    const docRef = await doc(db, "WebController", "K0aemSyiC5SAJB5Qz6RH");

    setDoc(docRef, {
      motorPullTime: value,
    });
  };

  const saveCountToFirestore = async () => {
    const docRef = await doc(db, "Count", "qGqYRGfZmmlDF7pZlbcr");

    setDoc(docRef, {
      count: count,
    });
  };

  const fetchDataFromFirestore = () => {
    const query = collection(db, "EspData");
    const unsubscribe = onSnapshot(query, (querySnapshot) => {
      let temporaryArr = [];
      querySnapshot.forEach((doc) => {
        temporaryArr.push(doc.data());
      });

      for (let i = 0; i < temporaryArr.length - 1; i++) {
        for (let j = i + 1; j < temporaryArr.length; j++) {
          // console.log(temporaryArr[i].id, temporaryArr[j].id);
          if (Number(temporaryArr[i].id) > Number(temporaryArr[j].id)) {
            let tmp = temporaryArr[i];
            temporaryArr[i] = temporaryArr[j];
            temporaryArr[j] = tmp;
          }
        }
      }

      console.log("Stored value", temporaryArr);
      console.log("Count", temporaryArr);
      setCount(temporaryArr.length + 1);
      console.log("Count", count);
      setStoredValues(temporaryArr);
    });

    const query2 = collection(db, "WebController");

    const unsubscribe2 = onSnapshot(query2, (querySnapshot) => {
      const temporaryArr = [];
      querySnapshot.forEach((doc) => {
        temporaryArr.push(doc.data());
      });

      let data = temporaryArr[0]["motorStatus"];
      console.log("Nạp dữ liệu từ motor từ firestore");
      if (motor === undefined) setRunMotor(data);
    });

    return [unsubscribe, unsubscribe2];
  };

  const fetchMotorPullTime = (setDefault) => {
    const docRef = doc(db, "WebController", "K0aemSyiC5SAJB5Qz6RH");

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        console.log("Motor Pull Time:", docSnap.data().motorPullTime);
        setDefault(docSnap.data().motorPullTime);
      } else {
        console.log("No such document!");
      }
    });

    // Remember to unsubscribe when the component unmounts
    return unsubscribe;
  };

  const fetchRainLimit = (setDefault) => {
    const docRef = doc(db, "WebController", "810hsIvfih8cn515waHm");

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        console.log("Rain limit:", docSnap.data().rainLimit);
        setDefault(docSnap.data().rainLimit);
      } else {
        console.log("No such document!");
      }
    });

    // Remember to unsubscribe when the component unmounts
    return unsubscribe;
  };

  const saveRainLimitToFireStore = async (value) => {
    const docRef = await doc(db, "WebController", "810hsIvfih8cn515waHm");

    setDoc(docRef, {
      rainLimit: value,
    });
  };

  useEffect(() => {
    const unsubscribes = fetchDataFromFirestore();
    return () => {
      unsubscribes[0]();
      unsubscribes[1]();
    };
  }, []);

  useEffect(() => {
    saveDataToFirestore();
  }, [motor]);

  useEffect(() => {
    saveCountToFirestore();
  }, [count]);

  let latest_value = storedValues[storedValues.length - 1];

  const activateMotor = () => {
    console.log("Chuyển trạng thái motor: ", motor);
    setRunMotor((motor) => !motor);
  };

  const [todayWeather, setTodayWeather] = useState({ value: 0, image: Clouds });
  const [restDays, setRestDays] = useState([]);
  const [location, setLocation] = useState("Loading...");
  const [wind, setWind] = useState("");
  const [pressure, setPressure] = useState(0);
  const apiKey = "5ababf5df792a59de71aae06ede839dd";
  const cityId = "1566083"; // Thành phố Hồ Chí Minh
  const url =
    "http://api.openweathermap.org/data/2.5/forecast?id=" +
    cityId +
    "&APPID=" +
    apiKey +
    "&units=imperial";

  // -------------------------- Hy fetch --------------------
  fetch(url)
    .then((response) => {
      if (response.status === 429) {
        throw new Error("Too many requests");
      }
      return response.json();
    })
    .then((data) => {
      const collection = data.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );

      const cityName = data.city.name + ", " + data.city.country;
      const wind = (collection[0].wind.speed * 3.6).toFixed(1) + " km/h"
      const pressure = (collection[0].main.pressure) + " hpa"

      setLocation(cityName)
      setWind(wind)
      setPressure(pressure)

      const weatherImages = {
        Clouds: Clouds,
        Rain: Rain,
        Drizzle: Drizzle,
        Thunderstorm: Thunderstorm,
      };

      // Use it in your code like this:
      const dailyForecast = collection.map((item) => {
        const image = weatherImages[item.weather[0].main];
        var val = ((item.main.temp_max - 32) * 5) / 9;
        return [
          {
            day: formatDate(item.dt_txt).dayOfWeek,
            date: formatDate(item.dt_txt).formattedDate,
            value: val.toFixed(1),
            image: image,
          },
        ];
      });

      const [firstDay, ...restDays] = dailyForecast;
      setTodayWeather({
        value: firstDay[0].value,
        image: firstDay[0].image,
      });
      const tmp = restDays.flat(1);
      console.log(tmp);
      setRestDays(tmp);
    })
    .catch((error) => console.error("Error: ", error));

  // -------------------------- Hy fetch --------------------

  return (
    <div className="dashboard">
      <div className="main-dashboard" style={{ overflow: "auto" }}>
        <GeneralInfo location={location} wind={wind} pressure={pressure} />
        {latest_value !== undefined ? (
          <MeasurementContainer
            light={latest_value.Light}
            rain={latest_value.Rain}
            temp={latest_value.Temperature}
            humidity={latest_value.Humidity}
          />
        ) : (
          <MeasurementContainer />
        )}
        <div className="slider">
          <Box
            sx={{
              display: "flex",
              gap: "12px",
              justifyContent: "space-between",
              backgroundColor: "white",
              padding: "8px",
              borderRadius: "12px",
              margin: "6px",
              width: '44%',
              alignItems: 'center'
            }}
          >
            <WaterDropIcon color="primary" />
            <CustomSlider
              marks={motor_time_marks}
              saveData={saveMotorPullTimeToFireStore}
              fetchData={fetchMotorPullTime}
              min={1}
              max={50}
              side="small"
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: "12px",
              justifyContent: "space-between",
              backgroundColor: "white",
              padding: "8px",
              borderRadius: "12px",
              margin: "6px",
              width: '44%',
              alignItems: 'center'
            }}
          >
            <SettingsBackupRestoreIcon color="primary" />
            <CustomSlider
              marks={rain_limit_marks}
              saveData={saveRainLimitToFireStore}
              fetchData={fetchRainLimit}
              min={0}
              max={1024}
            />
          </Box>
        </div>

        <Timer activateMotor={activateMotor} />
      </div>
      <div className="side-dashboard">
        <PullClothButton activateMotor={activateMotor} />
        <h5>FORECAST THIS WEEK</h5>
        <TodayWeather value={todayWeather.value} img={todayWeather.image} />
        {restDays.map((item, index) => (
          <WeatherInfo
            day={item.day}
            date={item.date}
            value={item.value}
            img={item.image}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
