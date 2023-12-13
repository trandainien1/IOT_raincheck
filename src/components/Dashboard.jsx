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
import { signOut } from "firebase/auth";
import { auth } from "../config/fire";
import { useEffect, useState } from "react";
import {
  getFirestore,
  addDoc,
  collection,
  onSnapshot,
  limitToLast,
  doc,
  setDoc,
  collectionGroup,
  getDocs
} from "firebase/firestore";
// import "../config/fire";
import { db } from "../config/fire";

const formatDate = (dateString) => {
  const dateObject = new Date(dateString);
  const dayOfWeek = dateObject.getDay();

  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const formattedDate = `${(dateObject.getDate()).toString().padStart(2, '0')}/${(dateObject.getMonth() + 1).toString().padStart(2, '0')}/${dateObject.getFullYear()}`;

  return {
    dayOfWeek: weekdays[dayOfWeek],
    formattedDate: formattedDate
  }
}

const Dashboard = () => {

  // Niên 
  const [inputValue1, setInputValue1] = useState("");
  const [inputValue2, setInputValue2] = useState("");
  let [storedValues, setStoredValues] = useState([]);
  let [count, setCount] = useState(0);
  let [init, setInit] = useState(true);
  let [motor, setRunMotor] = useState(false);

  const saveDataToFirestore = async () => {
    const docRef = await doc(db, "WebController", "VysXNFiC6Vnwrt1uxs2d");

    setDoc(docRef, {
      motorStatus: motor,
    });

    if (motor) {
      alert("Motor is on");
    } else {
      alert("Motor is off");
    }
  };

  const saveCountToFirestore = async () => {
    const docRef = await doc(db, "Count", "qGqYRGfZmmlDF7pZlbcr");

    setDoc(docRef, {
      count: count,
    });
  };

  const fetchDataFromFirestore = () => {
    const query = collection(db, "EspData");
    console.log(query)
    const unsubscribe = onSnapshot(query, (querySnapshot) => {
      let temporaryArr = [];
      querySnapshot.forEach((doc) => {
        temporaryArr.push(doc.data());
      });
      temporaryArr.sort((a, b) => (a.id > b.id ? true : false));
      console.log("Stored value", temporaryArr);

      setStoredValues(temporaryArr);
      setCount((count) => count + 1);
    });

    const query2 = collection(db, "WebController");

    const unsubscribe2 = onSnapshot(query2, (querySnapshot) => {
      const temporaryArr = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
        temporaryArr.push(doc.data());
      });

      let data = temporaryArr[0]["motorStatus"];
      setRunMotor(data);
    });

    const query3 = collection(db, "Count");

    const unsubscribe3 = onSnapshot(query3, (querySnapshot) => {
      if (!init) return;

      const temporaryArr = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
        temporaryArr.push(doc.data());
      });

      console.log("count", temporaryArr);
      let data = temporaryArr[0]["count"];

      setCount(data);
      setInit(false);
    });

    return [unsubscribe, unsubscribe2, unsubscribe3];
    // return [unsubscribe3];
  };

  useEffect(() => {
    const unsubscribes = fetchDataFromFirestore();
    return () => {
      unsubscribes[0]();
      unsubscribes[1]();
      unsubscribes[2]();
    };
  }, []);

  useEffect(() => {
    saveDataToFirestore();
  }, [motor]);

  useEffect(() => {
    saveCountToFirestore();
  }, [count]);

  console.log("Motor status", motor);

  let latest_value = storedValues[storedValues.length - 1];

  console.log("latest value: ", storedValues[storedValues.length - 1]);

  const activateMotor = () => {
    setRunMotor((motor) => !motor);
    // saveDataToFirestore();
  };

  // Hy

  const [todayWeather, setTodayWeather] = useState({ value: 0, image: Clouds })
  const [restDays, setRestDays] = useState([])

  const apiKey = "c0387600d0061b5c23cb9006ded2dc14";
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
      const collection = data.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );

      const weatherImages = {
        Clouds: Clouds,
        Rain: Rain,
        Drizzle: Drizzle,
        Thunderstorm: Thunderstorm,
      };

      // Use it in your code like this:
      const dailyForecast = collection.map(item => {
        const image = weatherImages[item.weather[0].main]
        var val = (item.main.temp_max - 32) * 5 / 9;
        return [
          {
            day: formatDate(item.dt_txt).dayOfWeek,
            date: formatDate(item.dt_txt).formattedDate,
            value: val.toFixed(1),
            image: image
          }
        ]
      })

      const [firstDay, ...restDays] = dailyForecast;
      console.log(firstDay)
      setTodayWeather({
        value: firstDay[0].value,
        image: firstDay[0].image
      })
      const tmp = restDays.flat(1)
      setRestDays(tmp)
    })
    .catch((error) => console.error("Error: ", error));
  return (
    <div className="dashboard">
      <button
        className="signout-btn"
        onClick={() => {
          signOut(auth);
        }}
      >
        Sign out
      </button>
      <div className="main-dashboard">
        <GeneralInfo />
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
