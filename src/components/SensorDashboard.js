import React, { useState, useEffect } from "react";
import "./SensorDashboard.css";
import {
  fetchData,
  updateTemperatureThresholdChange,
  updateHumidityThresholdChange,
} from "../helper/api.js";

const SensorDashboard = () => {
  const [temperatureThreshold, setTemperatureThreshold] = useState(24.0);
  const [humidityThreshold, setHumidityThreshold] = useState(50.0);
  const [humidity, setHumidity] = useState("--");
  const [temperature, setTemperature] = useState("--");
  const [heaterStatus, setHeaterStatus] = useState("OFF");
  const [humidifierStatus, setHumidifierStatus] = useState("OFF");

  useEffect(() => {}, []);

  // Threshold changing
  ////////////////////////////////////////////////////////////////////////
  const handleSetTemperatureThresholdChange = async () => {
    try {
      const response = await updateTemperatureThresholdChange(
        temperatureThreshold
      );
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSetHumidityThresholdChange = async () => {
    try {
      const response = await updateHumidityThresholdChange(humidityThreshold);
    } catch (e) {
      console.log(e);
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className="container">
      <h1>ESP32 Sensor Dashboard</h1>
      <div>
        <label>Set Temperature Threshold (°C):</label>
        <input
          type="number"
          value={temperatureThreshold}
          onChange={(e) => setTemperatureThreshold(e.target.value)}
        />
        <button onClick={handleSetTemperatureThresholdChange}>
          Set Temperature
        </button>
      </div>
      <div>
        <label>Set Humidity Threshold (%):</label>
        <input
          type="number"
          value={humidityThreshold}
          onChange={(e) => setHumidityThreshold(e.target.value)}
        />
        <button onClick={handleSetHumidityThresholdChange}>Set Humidity</button>
      </div>
      <p>
        Humidity: <span>{humidity}%</span>
      </p>
      <p>
        Temperature: <span>{temperature}°C</span>
      </p>
      <p>
        Heater Status: <span className="status">{heaterStatus}</span>
      </p>
      <p>
        Humidifier Status: <span className="status">{humidifierStatus}</span>
      </p>
    </div>
  );
};

export default SensorDashboard;
