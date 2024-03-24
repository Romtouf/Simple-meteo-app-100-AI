// Import des icônes météorologiques
import React, { useState, useEffect } from "react";
import "./App.css";
import loader from "./assets/loader.svg";

import clearDayIcon from "./assets/soleil.webp";
import cloudyIcon from "./assets/nuages.webp";
import rainyIcon from "./assets/pluie.webp";
import snowyIcon from "./assets/neige.webp";

function App() {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [day, setDay] = useState("");
  const [temperature, setTemperature] = useState("");
  const [weatherCondition, setWeatherCondition] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherData = async (latitude, longitude) => {
      try {
        const apiKey = process.env.REACT_APP_API_KEY;
        const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
        const response = await fetch(apiURL);
        const data = await response.json();
        setCity(data.name);
        setCountry(data.sys.country);
        setDay(new Date().toLocaleDateString("fr-FR", { weekday: "long" }));
        setTemperature(data.main.temp);
        setWeatherCondition(data.weather[0].main);
        setLoading(false);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données météorologiques:",
          error
        );
      }
    };

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherData(latitude, longitude);
          },
          (error) => {
            console.error("Erreur de géolocalisation:", error);
          }
        );
      } else {
        console.error(
          "La géolocalisation n'est pas prise en charge par ce navigateur."
        );
      }
    };

    getLocation();
  }, []);

  // Fonction pour choisir l'icône en fonction de la condition météorologique
  const getWeatherIcon = () => {
    switch (weatherCondition.toLowerCase()) {
      case "clear":
        return clearDayIcon;
      case "clouds":
        return cloudyIcon;
      case "rain":
        return rainyIcon;
      case "snow":
        return snowyIcon;
      default:
        return null;
    }
  };

  return (
    <div className="App">
      {loading ? (
        <div className="loader">
          <img
            src={loader}
            alt="loader"
            style={{ width: "100px", height: "100px" }}
          />
        </div>
      ) : (
        <div>
          <h1>Météo</h1>
          <div className="infos">
            <p>{city}</p>
            <p>{country}</p>
            <p>{day}</p>
            <p>{temperature} °C</p>
            {weatherCondition && (
              <img
                src={getWeatherIcon()}
                alt="Weather Icon"
                style={{ width: "100px", height: "100px" }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
