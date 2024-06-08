import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080", // Replace with your actual server address
  timeout: 10000, // Request timeout after 10000ms (10 seconds)
  headers: {
    "Content-Type": "application/json",
  },
});

// Fetches the current sensor data from the server
export const fetchData = async () => {
  try {
    const response = await apiClient.get("/data");
    return response.data; // Return the data directly
  } catch (error) {
    console.error("Error:", error);
    throw error; // Rethrow to handle it in the component
  }
};

// Updates the temperature threshold
export const updateTemperatureThresholdChange = async (temperature) => {
  try {
    await apiClient.post("/settings/temperature-threshold", {
      temperatureThreshold: temperature,
    });
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Updates the humidity threshold
export const updateHumidityThresholdChange = async (humidity) => {
  try {
    await apiClient.post("/settings/humidity-threshold", {
      humidityThreshold: humidity,
    });
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
