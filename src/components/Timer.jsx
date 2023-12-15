import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { db } from "../config/fire";
import { setDoc, doc, onSnapshot } from "@firebase/firestore";

const getCurrentTime = () => {
  const currentTime = new Date();
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();

  return {
    hour: hours,
    minute: minutes,
  };
};

const Timer = ({ activateMotor }) => {
  const [value, setValue] = useState();
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [settingTime, setSettingtime] = useState();

  const fetchSettingTime = () => {
    const docRef = doc(db, "WebController", "0FQlxxAfGoaXjSHYPaUB");

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setSettingtime(docSnap.data());
      } else {
        console.log("No such document!");
      }
    });

    // Remember to unsubscribe when the component unmounts
    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = fetchSettingTime();

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const timeIntervalId = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);

    return () => clearInterval(timeIntervalId);
  }, []);

  const updateHourAndMinuteToFireStore = async (newHour, newMinute) => {
    const docRef = await doc(db, "WebController", "0FQlxxAfGoaXjSHYPaUB");

    setDoc(docRef, {
      hour: newHour,
      minute: newMinute,
    });
  };

  useEffect(() => {
    const timer = () => {
      return (
        currentTime.hour === settingTime.hour &&
        currentTime.minute === settingTime.minute
      );
    };

    if (currentTime !== undefined && settingTime !== undefined) {
      if (timer()) {
        activateMotor();
        setTimeout(activateMotor, 3000);
        // prompt("I'll pull the clothes in for you");
        updateHourAndMinuteToFireStore(
          settingTime.hour,
          settingTime.minute - 1
        );
      }

      console.log(currentTime, settingTime);
    }
  }, [currentTime, settingTime]);

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["TimePicker"]}>
          <TimePicker
            label="Controlled picker"
            value={value}
            onChange={(newValue) => {
              if (newValue !== undefined) {
                setValue(newValue);
                let date = new Date(newValue.format());

                updateHourAndMinuteToFireStore(
                  date.getHours(),
                  date.getMinutes()
                );
              }
            }}
          />
        </DemoContainer>
      </LocalizationProvider>
    </div>
  );
};

export default Timer;
