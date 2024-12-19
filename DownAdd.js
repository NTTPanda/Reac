import React from "react";
import "./DownAdd.css"; // Import the CSS file for styling
import ExampleImage from "./images/Rohit_photo.jpg"; // Replace with your image path

const DownAdd = ({ labelText, placeholderText, imagePath = ExampleImage }) => {
  return (

      <div className="downadd-top">
        <label htmlFor="downadd-input" className="downadd-label">
          {labelText}
        </label>
        <div className="downadd-content">
          <img src={imagePath} alt="Example" className="downadd-image" />
          <input
            type="text"
            id="downadd-input"
            className="downadd-input"
            placeholder={placeholderText}
          />
        </div>
      </div>

  );
};

export default DownAdd;


