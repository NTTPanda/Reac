import React from "react";
import "./App.css"; // Import the CSS file
import DownAdd from "./DownAdd"; // Import DownAdd component
import RohitPhoto from "./images/Globe.png";
import Drop from "./Drop";


function App() {
  const dropdownOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];
  return (
    <>
      <div className="box">
      <DownAdd
  labelText="IP"
  placeholderText="0.0.0.0"
  imagePath={RohitPhoto}
/>
      </div>


      <Drop
        labelText="Select an Option"
        options={dropdownOptions}
      />
    </>
  );
}

export default App;
