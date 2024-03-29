import React, { useEffect, useState } from "react";
import "./Statistics.css";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
} from "firebase/firestore";
// import "../config/fire";
import { db } from "../config/fire";
import Chart from "chart.js/auto"; // Import the Chart class

const Statistics = () => {
  const [datasets, setData] = useState([]);
  const [count, setCount] = useState([]);

  const saveCountToFirestore = async () => {
    const docRef = await doc(db, "Count", "qGqYRGfZmmlDF7pZlbcr");

    setDoc(docRef, {
      count: count,
    });
  };

  const fetchDataFromFirestore = () => {
    console.log("go here");
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
      setCount(temporaryArr.length + 1);
      setData(temporaryArr);
    });

    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = fetchDataFromFirestore();
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    saveCountToFirestore();
  }, [count]);

  console.log("data", datasets);
  console.log("Count", count);

  const lastest20 = datasets.slice(-20);

  var labels = lastest20.map((data) => "ID " + data.id);
  var humidityData = lastest20.map((data) => parseFloat(data.Humidity));
  var lightData = lastest20.map((data) => parseFloat(data.Light));
  var rainData = lastest20.map((data) => parseFloat(data.Rain));
  var temperatureData = lastest20.map((data) => parseFloat(data.Temperature));
  console.log(datasets);

  const createLineChart = (canvasId, label, borderColor, data, type = "line") => {
    const ctx = document.getElementById(canvasId).getContext("2d");

    ctx.canvas.width = 520; // Set your desired width
    ctx.canvas.height = 200; // Set your desired height
    // Get the existing chart instance
    const existingChart = Chart.getChart(ctx);

    // If there's an existing chart, destroy it
    if (existingChart) {
      existingChart.destroy();
    }

    // Create a new chart
    return new Chart(ctx, {
      type: type,
      data: {
        labels: labels,
        datasets: [
          {
            label: label,
            borderColor: borderColor,
            backgroundColor: borderColor,
            borderWidth: 2,
            fill: false,
            hoverOffset: 4,
            data: data,
            tension: 0.1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            display: false,
          },
        },
        maintainAspectRatio: false, // Set to false to fix the height and width
        responsive: false, // Set to false to fix the height and width
      },
    });
  };

  useEffect(() => {
    createLineChart("humidChart", "Humidity", 'rgb(75, 192, 192)', humidityData, "bar");
    createLineChart("rainChart", "Rain", 'rgba(75, 192, 192, 0.2)', rainData);
    createLineChart("lightChart", "Light", 'rgba(153, 102, 255, 0.2)', lightData);
    createLineChart("temperatureChart", "Temperature", 'rgba(255, 159, 64, 0.2)', temperatureData);
  }, [lastest20]);
  return (
    <div className="chart-container">
      <div className="chart-item">
        <canvas id="humidChart"></canvas>
      </div>
      <div className="chart-item">
        <canvas id="rainChart"></canvas>
      </div>
      <div className="chart-item">
        <canvas id="lightChart"></canvas>
      </div>
      <div className="chart-item">
        <canvas id="temperatureChart"></canvas>
      </div>
    </div>
  );
};

export default Statistics;
