import React, { useState } from "react";
import GrayBlackBox from "./GrayBlackBox"; // Import the GrayBlackBox component
import "./App.css"; // Optional: For styling the button or layout
import ReadXML from "./ReadXML";

function App() {
  const [showBox, setShowBox] = useState(false);

  const handleButtonClick = () => {
    setShowBox(!showBox); // Toggle the visibility of GrayBlackBox
  };

// Function to process data
const handleDataReady = ({ names, models, pairs }) => {
  console.log("Names:", names[0]);
  console.log("Names:", names[1]);
  console.log("Names:", names[2]);
  console.log("Names:", names[3]);
};
  return (
    <div className="app-container">
      <button className="toggle-button" onClick={handleButtonClick}>
        {showBox ? "Hide Gray Black Box" : "Show Gray Black Box"}
      </button>
      {showBox && <GrayBlackBox />} 
      <ReadXML onDataReady={handleDataReady} />
    </div>
  );
}

export default App;


// const array=["Name1","Name2","Name3","Name4"]
// const generateObject = (arr) => {
//   const obj = {};
//   arr.forEach((value, index) => {
//     obj[`Option${index + 1}`] = value;
//   });
//   return obj;
// };

// // Usage is the same as above
// let obj = generateObject(array);
// console.log(obj);
