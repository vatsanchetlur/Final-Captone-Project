import React, { useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

// Simple SVG sparkline for demo
const Sparkline = ({ color }) => (
  <svg width="50" height="18" viewBox="0 0 50 18">
    <polyline
      fill="none"
      stroke={color}
      strokeWidth="2"
      points="0,15 10,10 20,12 30,7 40,12 50,5"
    />
  </svg>
);

const STOCKS = [
  {
    symbol: 'DOW JONES',
    name: 'Dow Jones Industrial Average',
    value: '44,828',
    change: '-182.44',
    isUp: false,
    color: '#e53935',
    sublabel: 'Dow Jones Industrial Avera...'
  },
  {
    symbol: 'S&P 500',
    name: "Standard & Poor's 500",
    value: '6,376',
    change: '+16.63',
    isUp: true,
    color: '#43a047',
    sublabel: "Standard & Poor's 500"
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    value: '215.03',
    change: '+0.88',
    isUp: true,
    color: '#43a047',
    sublabel: 'Apple Inc.'
  }
];

export function StockTicker() {
  const [stocks, setStocks] = useState(STOCKS);

  // Optionally, rotate or update stocks for demo effect
  useEffect(() => {
    // No rotation for now, static demo
  }, []);

  return (
    <div className="stock-ticker-widget">
      {stocks.map((stock, idx) => (
        <div className="stock-row" key={idx}>
          <div className="stock-main">
            <span className="stock-icon">
              {stock.isUp ? (
                <FaArrowUp color="#43a047" />
              ) : (
                <FaArrowDown color="#e53935" />
              )}
            </span>
            <span className="stock-title" style={{ color: stock.isUp ? '#43a047' : '#e53935' }}>
              {stock.symbol}
            </span>
            <span className="stock-value">{stock.value}</span>
            <span className="stock-chart">
              <Sparkline color={stock.color} />
            </span>
            <span className="stock-change" style={{ color: stock.isUp ? '#43a047' : '#e53935' }}>
              {stock.change}
            </span>
          </div>
          <div className="stock-sublabel">{stock.sublabel}</div>
        </div>
      ))}
    </div>
  );
}
