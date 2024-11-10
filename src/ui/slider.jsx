import React from 'react';

// src/ui/slider.jsx
const Slider = ({ min, max, step, value, onValueChange, className = "" }) => {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value[0]} // Destructure the array to get the first value
      onChange={(e) => onValueChange([parseFloat(e.target.value)])} // Pass the new value as an array
      className={`w-full ${className}`}
    />
  );
};

export { Slider }; // Make sure to export as named export
// or
export default Slider; // If you prefer default export