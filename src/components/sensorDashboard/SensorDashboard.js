import React, { useState, useEffect } from "react";
import "./SensorDashboard.css";
import {
  fetchData,
  updateTemperatureThresholdChange,
  updateHumidityThresholdChange,
  fetchTemperature,
} from "../../helper/api.js";

const SensorDashboard = () => {
  const [temperatureThreshold, setTemperatureThreshold] = useState(24.0);
  const [humidityThreshold, setHumidityThreshold] = useState(50.0);
  const [humidity, setHumidity] = useState("0.0");
  const [temperature, setTemperature] = useState("0.0");
  const [heaterStatus, setHeaterStatus] = useState("OFF");
  const [humidifierStatus, setHumidifierStatus] = useState("OFF");
  const [temperatureResponse, setTemperatureResponse] = useState({
    id: "",
    temperatureLevel: 0.0,
    date: "",
  });
  const [temperatureDate, setTemperatureDate] = useState("");
  const [humidityResponse, setHumidityResponse] = useState({});

  const extractTime = (date) => {
    return date.split("T")[1].split(".")[0];
  };

  useEffect(() => {
    const fetchAndLogTemperature = async () => {
      try {
        const response = await fetchTemperature(); // API'dan sıcaklık verisini al
        if (
          (temperatureResponse.id != "" &&
            response.data.id != temperatureResponse.id) ||
          temperatureResponse.id == ""
        ) {
          setTemperatureResponse(response.data);
          setTemperature(response.data.temperatureLevel);
          setTemperatureDate(extractTime(response.data.date));
        }
      } catch (error) {
        console.error("Sıcaklık alınırken hata oluştu:", error);
      }
    };

    const intervalId = setInterval(() => {
      fetchAndLogTemperature(); // Asenkron işlevi çağır
    }, 2000); // Her 2 saniyede bir çağır

    return () => clearInterval(intervalId); // Cleanup fonksiyonu
  }, []);

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
        Temperature: <span>{temperature}°C</span>{" "}
        <span>Date : {temperatureDate}</span>
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
