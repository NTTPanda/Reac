import React from "react";
import "./App.css"; // Import the CSS file
import DownAdd from "./DownAdd"; // Import DownAdd component
import RohitPhoto from "./images/Globe.png";



function App() {
  return (
    <>
      <div className="box">
      <DownAdd
  labelText="IP"
  placeholderText="0.0.0.0"
  imagePath={RohitPhoto}
/>
      </div>

    </>
  );
}

export default App;
