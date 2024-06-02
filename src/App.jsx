import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
const key = 'b390bf9259ec5a75901b41e9d33bfef2';

function App() {
  const [weather, setWeather] = useState(null);
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCelsius, setIsCelsius] = useState(true);
  const [city, setCity] = useState('');


  const success = (pos) => {
    setCoords({
      lat: pos.coords.latitude,
      lon: pos.coords.longitude,
    });
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success);
  }, []);

  useEffect(() => {
    if (coords) {
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${key}`)
        .then((res) => {
          setWeather(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [coords]);

  useEffect(() => {
    if (weather) {
      setTimeout(() => {
        setLoading(false);
      }, 2000); // Esperar 2 segundos antes de cambiar loading a false
    }
  }, [weather]);

  const toggleTemperature = () => {
    setIsCelsius(!isCelsius);
  };

  const getTemperature = (kelvin) => {
    if (isCelsius) {
      return `${Math.round(kelvin - 273.15)}°C`;
    } else {
      return `${Math.round((kelvin - 273.15) * 9 / 5 + 32)}°F`;
    }
  };

  const handleSearch = () => {
    if (city) {
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`)
        .then((res) => {
          setWeather(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const getBackgroundImage = () => {
    if (weather) {
      const condition = weather.weather[0].main.toLowerCase();
      switch (condition) {
        case 'clear':
          return 'url(/images/clear-sky.jpg)';
        case 'clouds':
          return 'url(/images/cloudy.jpg)';
        case 'rain':
          return 'url(/images/rainy.jpg)';
        case 'snow':
          return 'url(/images/snowy.jpg)';
        case 'thunderstorm':
          return 'url(/images/thunderstorm.jpg)';
        default:
          return 'url(/images/moving-clouds.gif)'; // Usar un GIF animado como imagen por defecto
      }
    }
    return 'url(/images/moving-clouds.gif)'; // Usar un GIF animado como imagen por defecto
  };

  console.log(weather);

  return (
    <div className="App" style={{ backgroundImage: getBackgroundImage() }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        weather && (
          <div className="weather-container">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Buscar ciudad o país"
              className="search-input"
            />
            <button onClick={handleSearch} className="search-button">Buscar</button>
            <h1>{weather.name}, {weather.sys.country}</h1>
            <p>Condición: {weather.weather[0].description}</p>
            <p>Temperatura: {getTemperature(weather.main.temp)}</p>
            <p>Velocidad del viento: {weather.wind.speed} m/s</p>
            <p>Porcentaje de nubes: {weather.clouds.all}%</p>
            <p>Presión atmosférica: {weather.main.pressure} hPa</p>
            <button onClick={toggleTemperature} className="temp-toggle">
              {isCelsius ? 'Cambiar a °F' : 'Cambiar a °C'}
            </button>
          </div>
        )
      )}
    </div>
  );
}

export default App;
