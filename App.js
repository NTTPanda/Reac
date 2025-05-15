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



import React, { useState } from "react";
import XmlPopup from "./XmlPopup";
import "./XmlPopup.css";

function Add() {
  const [showPopup, setShowPopup] = useState(false);
  const [xmlContent, setXmlContent] = useState("");

  const loadXML = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/xml");
      const text = await res.text();
      setXmlContent(text);
      setShowPopup(true);
    } catch (err) {
      console.error("Failed to load XML", err);
    }
  };

  const handleRefresh = (updatedXml) => {
    setXmlContent(updatedXml);
  };

  return (
    <div className="App">
      <button className="add-button" onClick={loadXML}>ADD NEW TAG</button>

      {showPopup && (
        <XmlPopup
          content={xmlContent}
          onClose={() => setShowPopup(false)}
          onRefresh={handleRefresh}
        />
      )}
    </div>
  );
}

export default Add;




  import React, { useState } from "react";
import "./XmlPopup.css";

function XmlPopup({ content, onClose, onRefresh }) {
  const [parentTag, setParentTag] = useState("");
  const [newTag, setNewTag] = useState("");
  const [tagValue, setTagValue] = useState("");

  const handleAddTag = async () => {
    if (!parentTag || !newTag || !tagValue) {
      alert("Please provide all inputs (parent tag, new tag, and value).");
      return;
    }

    // Step 1: Parse the XML content
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(content, "application/xml");

    // Step 2: Find the parent element based on the input parentTag
    const parentElement = xmlDoc.querySelector(parentTag);
    if (!parentElement) {
      alert(`Parent tag <${parentTag}> not found.`);
      return;
    }

    // Step 3: Create the new tag with the provided value
    const newElement = xmlDoc.createElement(newTag);
    newElement.textContent = tagValue;

    // Step 4: Append the new tag inside the parent element
    parentElement.appendChild(newElement);

    // Step 5: Serialize the updated XML
    const serializer = new XMLSerializer();
    const updatedXml = serializer.serializeToString(xmlDoc);

    // Step 6: Send the updated XML back to the backend to write to file
    try {
      const response = await fetch("http://localhost:5000/api/update-xml", {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: updatedXml,  // Send the updated XML as a string
      });

      if (response.ok) {
        console.log("XML file updated successfully!");
        onRefresh(updatedXml);  // Refresh the content in the parent component
      } else {
        console.error("Failed to update the XML file.");
      }
    } catch (err) {
      console.error("Error sending updated XML:", err);
    }

    // Clear the inputs after submission
    setParentTag("");
    setNewTag("");
    setTagValue("");
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <pre>{content}</pre>
        <div className="input-group">
          <input
            type="text"
            placeholder="Parent Tag"
            value={parentTag}
            onChange={(e) => setParentTag(e.target.value)}
          />
          <input
            type="text"
            placeholder="New Tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
          />
          <input
            type="text"
            placeholder="Tag Value"
            value={tagValue}
            onChange={(e) => setTagValue(e.target.value)}
          />
        </div>
        <div className="button-group">
          <button onClick={onClose}>Close</button>
          <button onClick={handleAddTag}>Add Tag</button>
        </div>
      </div>
    </div>
  );
}

export default XmlPopup;



  /* Overlay for the popup to darken the background */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Styling for the popup */
.popup {
  background-color: rgb(28, 3, 3);
  padding: 20px;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Styling for the XML content inside the popup */
.popup pre {
  white-space: pre-wrap; /* Wrap long lines of XML */
  word-wrap: break-word; /* Ensure long words are wrapped */
  font-family: monospace;
  font-size: 14px;
  margin-bottom: 20px;
  overflow-x: auto;
  background-color: #f4f4f4;
  color: #333;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

/* Styling for the input fields */
.input-group {
  margin-bottom: 15px;
}

.input-group input {
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.input-group input:focus {
  border-color: #007bff;
  outline: none;
}

/* Button group styling */
.button-group {
  display: flex;
  justify-content: space-between;
}

/* Styling for the buttons */
.button-group button {
  padding: 10px 15px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button-group button:hover {
  background-color: #007bff;
  color: white;
}

.button-group button:focus {
  outline: none;
}

.button-group button:first-child {
  background-color: #f44336; /* Red for close button */
  color: white;
}

.button-group button:last-child {
  background-color: #4CAF50; /* Green for refresh button */
  color: white;
}

/* Add button */
.add-button {
  background-color: orange;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
}

.add-button:hover {
  background-color: darkorange;
}

/* Preformatted content (for XML) */
pre {
  font-family: "Courier New", Courier, monospace; /* Monospaced font for better readability */
  background-color: #f4f4f4;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  white-space: pre-wrap;
  word-wrap: break-word;
  color: #333;
  font-size: 14px;
  overflow-x: auto;
}

/* Optional: Highlight XML tags, attributes, and values */
pre .tag {
  color: #d35400; /* Orange for tags */
}

pre .attribute {
  color: #2980b9; /* Blue for attributes */
}

pre .value {
  color: #2ecc71; /* Green for values */
}



  import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";  // Import body-parser for handling raw text input

const app = express();
const PORT = 5000;

// Define global XML path relative to current working directory
const XML_FILE_PATH = path.resolve("./My_XML/my.xml");

app.use(cors());
app.use(bodyParser.text({ type: "application/xml" }));  // Parse raw XML as text

// Endpoint to get XML content
app.get("/api/xml", (req, res) => {
  fs.readFile(XML_FILE_PATH, "utf-8", (err, data) => {
    if (err) {
      console.error("Failed to read XML file:", err);
      return res.status(500).send("Error reading XML file");
    }
    res.type("application/xml").send(data);
  });
});

// Endpoint to handle updating XML content
app.post("/api/update-xml", (req, res) => {
  const updatedXml = req.body;

  // Ensure the updatedXml is a string before writing it to the file
  if (typeof updatedXml !== 'string') {
    return res.status(400).send("Invalid XML format");
  }

  fs.writeFile(XML_FILE_PATH, updatedXml, "utf-8", (err) => {
    if (err) {
      console.error("Failed to write XML file:", err);
      return res.status(500).send("Error writing XML file");
    }
    res.status(200).send("XML file updated successfully");
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



  




  

