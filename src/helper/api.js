import axios from "axios";

// Fetches the current sensor data from the server
export const fetchData = async () => {
  try {
    const response = await axios.get("/data");
    return response.data; // Return the data directly
  } catch (error) {
    console.error("Error:", error);
    throw error; // Rethrow to handle it in the component
  }
};

// Updates the temperature threshold
export const updateTemperatureThreshold = async (temperature) => {
  try {
    await axios.post("/setTemperatureThreshold", { temperature });
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Updates the humidity threshold
export const updateHumidityThreshold = async (humidity) => {
  try {
    await axios.post("/humidity/humidity-data", { humidity: humidity });
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
