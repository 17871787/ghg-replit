import React from 'react';

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

export default Input;
