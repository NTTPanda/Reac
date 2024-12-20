import React from "react";
import "./Drop.css"; // Import the CSS file for styling
import ExampleImage from "./images/Rohit_photo.jpg"; // Replace with your image path

const Drop = ({ labelText, options, imagePath = ExampleImage }) => {
  return (
    <div className="downadd-top">
      <label htmlFor="downadd-dropdown" className="downadd-label">
        {labelText}
      </label>
      <div className="downadd-content">
        <img src={imagePath} alt="Example" className="downadd-image" />
        <div className="dropdown-wrapper">
          <select id="downadd-dropdown" className="downadd-dropdown">
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="dropdown-arrow">▼</div>
        </div>
      </div>
    </div>
  );
};

export default Drop;
