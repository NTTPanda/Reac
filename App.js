// import React, { useState } from "react";
// import GrayBlackBox from "./GrayBlackBox"; // Import the GrayBlackBox component
// import "./App.css"; // Optional: For styling the button or layout
// import ReadXML from "./ReadXML";

// function App() {
//   const [showBox, setShowBox] = useState(false);

//   const handleButtonClick = () => {
//     setShowBox(!showBox); // Toggle the visibility of GrayBlackBox
//   };

// // Function to process data
// const handleDataReady = ({ names, models, pairs }) => {
//   console.log("Names:", names[0]);
//   console.log("Names:", names[1]);
//   console.log("Names:", names[2]);
//   console.log("Names:", names[3]);
// };
//   return (
//     <div className="app-container">
//       <button className="toggle-button" onClick={handleButtonClick}>
//         {showBox ? "Hide Gray Black Box" : "Show Gray Black Box"}
//       </button>
//       {showBox && <GrayBlackBox />} 
//       <ReadXML onDataReady={handleDataReady} />
//     </div>
//   );
// }

// export default App;


// // const array=["Name1","Name2","Name3","Name4"]
// // const generateObject = (arr) => {
// //   const obj = {};
// //   arr.forEach((value, index) => {
// //     obj[`Option${index + 1}`] = value;
// //   });
// //   return obj;
// // };

// // // Usage is the same as above
// // let obj = generateObject(array);
// // console.log(obj);








https://youtu.be/UBNCdA_SnFg?si=9A7YWBwtT_a_Dupj


import './App.css';
import React, { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState({ names: [], models: [], classes: [] });
  const [error, setError] = useState(null);

  // Logging the state values correctly
  console.log(data.names);
  console.log(data.models);
  console.log(data.classes);


  // Fetch data from the backend
  useEffect(() => {
    fetch('http://localhost:5000/api/equipment')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch equipment data');
        }
        return response.json();
      })
      .then((parsedData) => setData(parsedData))
      .catch((err) => {
        console.error('Error fetching equipment data:', err);
        setError('Failed to fetch data');
      });
  }, []);

  // Data to add a new equipment
  const addData = {
    name: 'DeviceD',
    model: 'ModelD',
    class: 'Class4',
    ip: '192.168.1.100',
    monport: '103',
    controlport: '103',
  };

  // Handle Add Equipment
  const handleAdd = () => {
    fetch('http://localhost:5000/add-equipment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(addData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add equipment.');
        }
        return response.json();
      })
      .then((data) => {
        alert(data.message);
        console.log('Response from backend:', data);
      })
      .catch((error) => {
        alert('An error occurred: ' + error.message);
        console.error(error);
      });
  };

  // Render error or equipment list
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="App">
      <h1>Equipment Management</h1>
      <button onClick={handleAdd}>Add Equipment</button>

      <div>
        <h2>Equipment List</h2>
        <div>
          <h3>Names:</h3>
          <ul>
            {data.names && data.names.length > 0
              ? data.names.map((name, index) => <li key={index}>{name}</li>)
              : 'No data available'}
          </ul>
        </div>
        <div>
          <h3>Models:</h3>
          <ul>
            {data.models && data.models.length > 0
              ? data.models.map((model, index) => <li key={index}>{model}</li>)
              : 'No data available'}
          </ul>
        </div>
        <div>
          <h3>Classes:</h3>
          <ul>
            {data.classes && data.classes.length > 0
              ? data.classes.map((className, index) => <li key={index}>{className}</li>)
              : 'No data available'}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;

