import React, { useState, useEffect } from 'react';
import { WiDaySunny, WiCloudy, WiDayCloudyHigh, WiRain, WiNightClear } from 'react-icons/wi';
import { CITIES } from './cities';

function getWeatherIcon(code) {
  // Open-Meteo weather codes: https://open-meteo.com/en/docs#api_form
  if ([0, 1].includes(code)) return <WiDaySunny size={24} />;
  if ([2, 3].includes(code)) return <WiDayCloudyHigh size={24} />;
  if ([45, 48].includes(code)) return <WiCloudy size={24} />;
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return <WiRain size={24} />;
  if ([95, 96, 99].includes(code)) return <WiNightClear size={24} />;
  return <WiCloudy size={24} />;
}

export function WeatherTicker() {
  const [cityIdx, setCityIdx] = useState(0);
  const [weather, setWeather] = useState(null);
  const city = CITIES[cityIdx];

  useEffect(() => {
    async function fetchWeather() {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&forecast_days=6&timezone=auto&temperature_unit=fahrenheit`;
      const res = await fetch(url);
      const data = await res.json();
      setWeather(data);
    }
    fetchWeather();
  }, [cityIdx]);

  if (!weather) return <div className="weather-widget">Loading...</div>;

  const current = weather.current_weather;
  const daily = weather.daily;
  const todayIdx = 0;

  return (
    <div className="weather-widget">
      {/* City Picker */}
      <div className="weather-header">
        <select
          className="weather-city-picker"
          value={cityIdx}
          onChange={e => setCityIdx(Number(e.target.value))}
          style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: 6, fontWeight: 500 }}
        >
          {CITIES.map((c, i) => (
            <option value={i} key={c.name} style={{ color: '#222' }}>{c.name}</option>
          ))}
        </select>
        <div className="weather-icon-sun">
          <WiDaySunny size={18} color="#FFD700" />
        </div>
      </div>
      {/* Current weather */}
      <div className="weather-current">
        <div className="weather-temp-large">{Math.round(current.temperature)}°</div>
        <div className="weather-condition-wrapper">
          <div className="weather-condition">
            {getWeatherIcon(current.weathercode)} {current.weathercode === 0 ? 'Clear' : 'Cloudy'}
          </div>
          <div className="weather-high-low">
            H:{Math.round(daily.temperature_2m_max[todayIdx])}° L:{Math.round(daily.temperature_2m_min[todayIdx])}°
          </div>
        </div>
      </div>
      {/* Forecast */}
      <div className="weather-forecast">
        {daily.time.map((day, idx) => (
          <div key={idx} className="forecast-day">
            <div className="forecast-day-number">{new Date(day).getDate()}</div>
            <div className="forecast-icon">{getWeatherIcon(daily.weathercode[idx])}</div>
            <div className="forecast-temp">{Math.round(daily.temperature_2m_max[idx])}°</div>
          </div>
        ))}
      </div>
    </div>
  );
}
