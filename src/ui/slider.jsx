import React from 'react';

const Slider = ({ min, max, step, value, onValueChange, className = "" }) => {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onValueChange([parseFloat(e.target.value)])}
      className={`w-full ${className}`}
    />
  );
};

export default Slider;
