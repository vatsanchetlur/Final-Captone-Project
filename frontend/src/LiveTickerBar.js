import React from 'react';
import { WeatherTicker } from './WeatherTicker';

export function LiveTickerBar() {
  return (
    <div className="tickers-row">
      <WeatherTicker />
    </div>
  );
}
