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
  const [searchCity, setSearchCity] = useState("");
  const [country, setCountry] = useState("");
  const [temperature, setTemperature] = useState("");
  const [weatherCondition, setWeatherCondition] = useState("");
  const [loading, setLoading] = useState(true);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("weatherFavorites");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("weatherFavorites", JSON.stringify(favorites));
  }, [favorites]);

  const fetchWeatherByCity = async (cityName) => {
    try {
      setLoading(true);
      const apiKey = process.env.REACT_APP_API_KEY;
      const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
      const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

      const [weatherResponse, forecastResponse] = await Promise.all([
        fetch(weatherURL),
        fetch(forecastURL),
      ]);

      if (!weatherResponse.ok || !forecastResponse.ok) {
        throw new Error("Ville non trouvée");
      }

      const weatherData = await weatherResponse.json();
      const forecastData = await forecastResponse.json();

      setCity(weatherData.name);
      setCountry(weatherData.sys.country);
      setTemperature(weatherData.main.temp);
      setWeatherCondition(weatherData.weather[0].main);
      setShowFavorites(false);

      const dailyForecasts = forecastData.list
        .filter((item, index) => index % 8 === 0)
        .slice(0, 5)
        .map((item) => ({
          date: new Date(item.dt * 1000).toLocaleDateString("fr-FR", {
            weekday: "long",
          }),
          temp: Math.round(item.main.temp),
          condition: item.weather[0].main,
        }));

      setForecast(dailyForecasts);
      setError("");
    } catch (error) {
      setError("Ville non trouvée. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = () => {
    const cityInfo = { name: city, country };

    if (favorites.some((f) => f.name === city && f.country === country)) {
      setFavorites(
        favorites.filter((f) => !(f.name === city && f.country === country))
      );
    } else {
      setFavorites([...favorites, cityInfo]);
    }
  };

  const isFavorite = () => {
    return favorites.some((f) => f.name === city && f.country === country);
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const apiKey = process.env.REACT_APP_API_KEY;
          const reverseGeoURL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;

          const response = await fetch(reverseGeoURL);
          const data = await response.json();
          if (data.length > 0) {
            fetchWeatherByCity(data[0].name);
          }
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
          setLoading(false);
          setError("Erreur de géolocalisation. Veuillez réessayer.");
        }
      );
    } else {
      setError("La géolocalisation n'est pas supportée par votre navigateur.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherByCity("Paris");
  }, []);

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case "clear":
        return clearDayIcon;
      case "clouds":
        return cloudyIcon;
      case "rain":
        return rainyIcon;
      case "snow":
        return snowyIcon;
      default:
        return clearDayIcon;
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      fetchWeatherByCity(searchCity);
    }
  };

  const removeFavorite = (cityToRemove, countryToRemove) => {
    setFavorites(
      favorites.filter(
        (f) => !(f.name === cityToRemove && f.country === countryToRemove)
      )
    );
  };

  return (
    <div className="App">
      <div className="nav-container">
        <div className="search-container">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder="Rechercher une ville..."
              className="search-input"
            />
            <button type="submit" className="search-button">
              Rechercher
            </button>
          </form>
        </div>
        <div className="nav-buttons">
          <button
            className={`nav-button ${!showFavorites ? "active" : ""}`}
            onClick={() => setShowFavorites(false)}
          >
            Météo
          </button>
          <button
            className={`nav-button ${showFavorites ? "active" : ""}`}
            onClick={() => setShowFavorites(true)}
          >
            Favoris
          </button>
          <button
            className="nav-button"
            onClick={getLocation}
            title="Utiliser ma position"
          >
            📍 Ma position
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showFavorites ? (
        <div className="favorites-container">
          <h2>Mes Villes Favorites</h2>
          {favorites.length === 0 ? (
            <p className="no-favorites">Aucune ville en favori</p>
          ) : (
            <div className="favorites-grid">
              {favorites.map((fav, index) => (
                <div key={index} className="favorite-item-container">
                  <button
                    className="favorite-item"
                    onClick={() => fetchWeatherByCity(fav.name)}
                  >
                    {fav.name}, {fav.country}
                  </button>
                  <button
                    className="remove-favorite"
                    onClick={() => removeFavorite(fav.name, fav.country)}
                    title="Supprimer des favoris"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : loading ? (
        <div className="loader">
          <img src={loader} alt="loader" />
        </div>
      ) : (
        <div className="weather-container">
          <div className="current-weather">
            <div className="city-header">
              <h1>
                {city}, {country}
              </h1>
              <button
                className={`favorite-button ${isFavorite() ? "active" : ""}`}
                onClick={toggleFavorite}
              >
                {isFavorite() ? "★" : "☆"}
              </button>
            </div>
            <div className="weather-info">
              <img
                src={getWeatherIcon(weatherCondition)}
                alt="Weather Icon"
                className="weather-icon"
              />
              <div className="temperature">{Math.round(temperature)}°C</div>
              <div className="condition">{weatherCondition}</div>
            </div>
          </div>

          <div className="forecast">
            <h2>Prévisions sur 5 jours</h2>
            <div className="forecast-container">
              {forecast.map((day, index) => (
                <div key={index} className="forecast-day">
                  <div className="day-name">{day.date}</div>
                  <img
                    src={getWeatherIcon(day.condition)}
                    alt="Weather Icon"
                    className="forecast-icon"
                  />
                  <div className="forecast-temp">{day.temp}°C</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
