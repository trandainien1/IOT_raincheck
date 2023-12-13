import React, { useEffect, useState } from 'react';
import "./Statistics.css";
import { Line } from 'react-chartjs-2';
import { collection } from "firebase/firestore";
import { db } from "../config/fire";

const Statistics = () => {
    const [chartData, setChartData] = useState(null);

    const query = collection(db, "EspData");
    console.log(query)

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