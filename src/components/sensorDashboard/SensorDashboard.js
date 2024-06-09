import React, { useState, useEffect } from "react";
import "./SensorDashboard.css";
import {
  fetchData,
  updateTemperatureThresholdChange,
  updateHumidityThresholdChange,
  fetchTemperature,
  fetchHumidity,
  getThresholdSettings,
  fetchHeaterStatusFromDB,
  fetchHumidifierStatusFromDB,
} from "../../helper/api.js";

const SensorDashboard = () => {
  const [temperatureThreshold, setTemperatureThreshold] = useState(24.0);
  const [humidityThreshold, setHumidityThreshold] = useState(50.0);
  const [humidity, setHumidity] = useState("0.0");
  const [temperature, setTemperature] = useState("0.0");
  const [heaterStatus, setHeaterStatus] = useState(false);
  const [humidifierStatus, setHumidifierStatus] = useState(false);
  const [temperatureResponse, setTemperatureResponse] = useState({
    id: "",
    temperatureLevel: 0.0,
    date: "",
  });
  const [temperatureDate, setTemperatureDate] = useState("");
  const [humidityResponse, setHumidityResponse] = useState({
    id: "",
    humidityLevel: 0.0,
    date: "",
  });
  const [humidityDate, setHumidityDate] = useState("");

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

    const fetchAndLogHumidity = async () => {
      try {
        const response = await fetchHumidity(); // API'dan sıcaklık verisini al
        //console.log(response);
        if (
          (humidityResponse.id != "" &&
            response.data.id != humidityResponse.id) ||
          humidityResponse.id == ""
        ) {
          setHumidityResponse(response.data);
          setHumidity(response.data.humidityLevel);
          setHumidityDate(extractTime(response.data.date));
        }
      } catch (error) {
        console.error("Sıcaklık alınırken hata oluştu:", error);
      }
    };

    /// Status
    const fetchHeaterStatus = async () => {
      const heaterStatusResponse = await fetchHeaterStatusFromDB();
      console.log(heaterStatusResponse);
      setHeaterStatus(heaterStatusResponse.data);
    };

    const fetchHumidifierStatus = async () => {
      const humidifierStatusResponse = await fetchHumidifierStatusFromDB();
      console.log(humidifierStatusResponse);
      setHumidifierStatus(humidifierStatusResponse.data);
    };

    const intervalId = setInterval(() => {
      fetchAndLogTemperature(); // Asenkron işlevi çağır
      fetchAndLogHumidity();
      fetchHeaterStatus();
      fetchHumidifierStatus();
    }, 5000); // Her 5 saniyede bir çağır

    /// Status
    const getHumidityStatus = async () => {};

    const getSettingsFromDatabase = async () => {
      const settingsFromDatabase = await getThresholdSettings();
      setTemperatureThreshold(settingsFromDatabase.data.temperatureThreshold);
      setHumidityThreshold(settingsFromDatabase.data.humidityThreshold);
    };

    getSettingsFromDatabase();

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
        <span className="red-color">Humidity:</span> <span>{humidity}%</span>{" "}
        <span>
          <span className="red-color">Date :</span> {humidityDate}
        </span>
      </p>
      <p>
        <span className="red-color">Temperature:</span>{" "}
        <span>{temperature}°C</span>{" "}
        <span>
          <span className="red-color">Date :</span> {temperatureDate}
        </span>
      </p>
      <p>
        Heater Status:{" "}
        <span className="status">
          {heaterStatus ? (
            <span className="yellow-color">ON</span>
          ) : (
            <span className="red-color">OFF</span>
          )}
        </span>
      </p>
      <p>
        Humidifier Status:{" "}
        <span className="status">
          {humidifierStatus ? (
            <span className="yellow-color">ON</span>
          ) : (
            <span className="red-color">OFF</span>
          )}
        </span>
      </p>
    </div>
  );
};

export default SensorDashboard;
