import React from 'react';

// src/ui/button.jsx
const Button = ({ children, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${className}`}
    >
      {children}
    </button>
  );
};

export { Button };

// src/ui/input.jsx
const Input = ({ type, value, onChange, className = "", ...props }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={`px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
};

export { Input };