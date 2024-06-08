import React, { useState, useEffect } from "react";
import "./SensorDashboard.css";
import {
  fetchData,
  updateTemperatureThreshold,
  updateHumidityThreshold,
} from "../helper/api.js";

const SensorDashboard = () => {
  const [temperatureThreshold, setTemperatureThreshold] = useState(24.0);
  const [humidityThreshold, setHumidityThreshold] = useState(50.0);
  const [humidity, setHumidity] = useState("--");
  const [temperature, setTemperature] = useState("--");
  const [heaterStatus, setHeaterStatus] = useState("OFF");
  const [humidifierStatus, setHumidifierStatus] = useState("OFF");

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleFetchData();
    }, 2000);
    return () => clearInterval(intervalId);
  }, []);

  const handleFetchData = async () => {
    try {
      const data = await fetchData();
      setHumidity(data.humidity);
      setTemperature(data.temperature);
      setHeaterStatus(data.heater ? "ON" : "OFF");
      setHumidifierStatus(data.humidifier ? "ON" : "OFF");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleTemperatureThresholdChange = async (e) => {
    const newThreshold = e.target.value;
    setTemperatureThreshold(newThreshold);
    try {
      await updateTemperatureThreshold(newThreshold);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleHumidityThresholdChange = async (e) => {
    const newThreshold = e.target.value;
    setHumidityThreshold(newThreshold);
    try {
      await updateHumidityThreshold(newThreshold);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container">
      <h1>ESP32 Sensor Dashboard</h1>
      <div>
        <label>Set Temperature Threshold (°C):</label>
        <input
          type="number"
          value={temperatureThreshold}
          onChange={handleTemperatureThresholdChange}
        />
        <button onClick={handleTemperatureThresholdChange}>
          Set Temperature
        </button>
      </div>
      <div>
        <label>Set Humidity Threshold (%):</label>
        <input
          type="number"
          value={humidityThreshold}
          onChange={handleHumidityThresholdChange}
        />
        <button onClick={handleHumidityThresholdChange}>Set Humidity</button>
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
