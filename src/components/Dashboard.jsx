import React from "react";
import GeneralInfo from "./GeneralInfo";
import MeasurementContainer from "./MeasurementContainer";
import "./Dashboard.css";
import PullClothButton from "./PullClothButton";
import WeatherInfo from "./WeatherInfo";
import cloudy from "../imgs/cloudy.svg";
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
} from "firebase/firestore";
// import "../config/fire";
import { db } from "../config/fire";

const Dashboard = () => {
  const element = { value: 33, img: cloudy, day: "Tomorrow", date: "2/2/2023" };
  const array = new Array(7).fill(element);

  const [inputValue1, setInputValue1] = useState("");
  const [inputValue2, setInputValue2] = useState("");
  let [storedValues, setStoredValues] = useState([]);
  let [count, setCount] = useState([]);
  // let [init, setInit] = useState(true);
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

    const unsubscribe = onSnapshot(query, (querySnapshot) => {
      let temporaryArr = [];
      querySnapshot.forEach((doc) => {
        temporaryArr.push(doc.data());
      });

      for (let i = 0; i < temporaryArr.length - 1; i++) {
        for (let j = i + 1; j < temporaryArr.length; j++) {
          console.log(temporaryArr[i].id, temporaryArr[j].id);
          if (Number(temporaryArr[i].id) > Number(temporaryArr[j].id)) {
            let tmp = temporaryArr[i];
            temporaryArr[i] = temporaryArr[j];
            temporaryArr[j] = tmp;
          }
        }
      }

      console.log("Stored value", temporaryArr);

      setStoredValues(temporaryArr);
      // if (init) {
      // setInit(false);
      // setCount(temporaryArr.length);
      // } else {
      setCount(temporaryArr.length + 1);
      // }
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

    // const query3 = collection(db, "Count");

    // const unsubscribe3 = onSnapshot(query3, (querySnapshot) => {
    //   if (!init) return;

    //   const temporaryArr = [];
    //   querySnapshot.forEach((doc) => {
    //     console.log(doc.data());
    //     temporaryArr.push(doc.data());
    //   });

    //   console.log("count", temporaryArr);
    //   let data = temporaryArr[0]["count"];

    //   setInit(false);
    //   setCount(data);
    // });

    return [unsubscribe, unsubscribe2];
  };

  useEffect(() => {
    const unsubscribes = fetchDataFromFirestore();
    return () => {
      unsubscribes[0]();
      unsubscribes[1]();
      // unsubscribes[2]();
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
        <h5>FORCAST THIS WEEK</h5>
        <TodayWeather value={33} img={cloudy} />
        {array.map((item, index) => (
          <WeatherInfo
            day={item.day}
            date={item.date}
            value={item.value}
            img={cloudy}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
