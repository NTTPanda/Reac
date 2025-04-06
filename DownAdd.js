// import React, { useEffect, useState } from "react";
// import { XMLParser } from "fast-xml-parser";

// const ReadXML = ({ onDataReady }) => {
//   const [equipmentNames, setEquipmentNames] = useState([]);
//   const [equipmentModels, setEquipmentModels] = useState([]);
//   const [nameModelPairs, setNameModelPairs] = useState([]); // Store combined objects

//   useEffect(() => {
//     fetch("/XML/my.xml")
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Failed to fetch the XML file");
//         }
//         return response.text();
//       })
//       .then((data) => {
//         const parser = new XMLParser();
//         const parsedData = parser.parse(data);
//         const equipmentList = parsedData.equipment_info.equipment || [];

//         // Extract names and models
//         const names = [];
//         const models = [];
//         const pairs = [];

//         equipmentList.forEach((item) => {
//           const { name, model } = item;
//           names.push(name);
//           models.push(model);
//           pairs.push({ name, model });
//         });

//         setEquipmentNames(names);
//         setEquipmentModels(models);
//         setNameModelPairs(pairs);

//         if (onDataReady) {
//           // Pass the data to parent or handler
//           onDataReady({ names, models, pairs });
//         }
//       })
//       .catch((error) => console.error("Error:", error));
//   }, [onDataReady]);

//   return (
//     <div>
//       <h2>Equipment Names</h2>
//       {equipmentNames.length > 0 ? (
//         <ul>
//           {equipmentNames.map((name, index) => (
//             <li key={index}>{name}</li>
//           ))}
//         </ul>
//       ) : (
//         <p>No equipment names available.</p>
//       )}

//       <h2>Equipment Models</h2>
//       {equipmentModels.length > 0 ? (
//         <ul>
//           {equipmentModels.map((model, index) => (
//             <li key={index}>{model}</li>
//           ))}
//         </ul>
//       ) : (
//         <p>No equipment models available.</p>
//       )}

//       <h2>Equipment Name-Model Pairs</h2>
//       {nameModelPairs.length > 0 ? (
//         <ul>
//           {nameModelPairs.map(({ name, model }, index) => (
//             <li key={index}>
//               <strong>Name:</strong> {name}, <strong>Model:</strong> {model}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No equipment pairs available.</p>
//       )} 
//     </div>
//   );
// };

// export default ReadXML;



import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import { parseString, Builder } from 'xml2js';

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Path to the XML file
const xmlFilePath = './My_XML/my.xml';

// Add Equipment Endpoint
app.post('/add-equipment', (req, res) => {
  const equipment = req.body;
  console.log("My body",equipment)
  // Read the XML file
  fs.readFile(xmlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading XML file:', err);
      return res.status(500).json({ message: 'Failed to read XML file' });
    }

    // Parse the XML file
    parseString(data, (parseErr, result) => {
      if (parseErr) {
        console.error('Error parsing XML:', parseErr);
        return res.status(500).json({ message: 'Failed to parse XML file' });
      }

      // Ensure equipment array exists
      if (!Array.isArray(result.equipment_info.equipment)) {
        result.equipment_info.equipment = [result.equipment_info.equipment];
      }

      // Add new equipment
      const newEquipment = {
        name: [equipment.name],
        model: [equipment.model],
        equip_id: [`${result.equipment_info.equipment.length + 1}`],
        class: [equipment.class],
        real_ip: [equipment.ip],
        monport: [equipment.monport],
        controlport: [equipment.controlport],
        dummy_ip: ['1.1.1.1'],
        ttcp: ['TTCP01'],
        random_name: ['Panda'],
      };
      result.equipment_info.equipment.push(newEquipment);

      // Convert back to XML
      const builder = new Builder();
      const updatedXML = builder.buildObject(result);

      // Write updated XML to file
      fs.writeFile(xmlFilePath, updatedXML, (writeErr) => {
        if (writeErr) {
          console.error('Error writing to XML file:', writeErr);
          return res.status(500).json({ message: 'Failed to update XML file' });
        }

        console.log('Equipment added successfully:', newEquipment);
        res.json({ message: 'Equipment added successfully' });
      });
    });
  });
});

// Get Equipment List Endpoint
app.get('/api/equipment', (req, res) => {
  // Read the XML file
  fs.readFile(xmlFilePath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading XML file:', err);
      return res.status(500).json({ error: 'Failed to read XML file' });
    }

    // Parse XML data
    parseString(data, (err, result) => {
      if (err) {
        console.error('Error parsing XML:', err);
        return res.status(500).json({ error: 'Failed to parse XML' });
      }

      // Extract equipment data
      const equipmentArray = result.equipment_info.equipment || [];
      // console.log("hello",equipmentArray)
      const names = equipmentArray.map((equipment) => equipment.name[0]);
      const models = equipmentArray.map((equipment) => equipment.model[0]);
      const classes = equipmentArray.map((equipment) => equipment.class[0]);
      res.json({ names, models, classes });
    });
  });
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));









import React from "react";
import "./Main.css";
import RedButton from "./RedButton";
import BorderText from './BorderText';

function Main() {
  const handleClick = () => {
    alert("Purple Button Clicked!");
  };

  const buttonText = [
    "PRIME MCS MODE: UNKNOWN",
    "PRIME MCS NOT CONNECTED",
    "STANDBY MCS: NOT CONNECTED",
  ];

  return (
    <div className="main-container">
      {/* Top Section */}
      <div className="top-section">
        <div className="top-section-right">
          <div className="mcptop-all-buttons">
            {buttonText.map((text, index) => (
              <RedButton key={index} text={text} onClick={handleClick} />
            ))}
          </div>
        </div>
        <div className="top-section-left">
          <h1>MEOSAR Monitoring and Control System</h1>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bottom-section">
        <div className="column column-1">
          <div>
            <div className="border-text-section">
            <BorderText text="A1"/>
            <BorderText text="A2"/>
            <BorderText text="A3"/>
            <BorderText text="A4"/>
            <BorderText text="A5"/>
            <BorderText text="A6"/>
            <BorderText text="A7"/>
 
            </div>
          </div>
        </div>

        <div className="column column-2">
          <h1>Column 2</h1>
          <p>This is the content for the second column.</p>
        </div>

        <div className="column column-3">
          <h1>Column 3</h1>
          <p>This is the content for the third column.</p>
        </div>
      </div>
    </div>
  );
}

export default Main;
/* Main Container Styling */
.main-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  
  /* Top Section Styling */
  .top-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background-color: rgb(109, 26, 109);
    border: 1px solid #ccc;
    border-radius: 8px;
    height: 4%;
  }
  
  .top-section-left {
    position: relative;
    color: white;
    flex: 1;
    text-align: right;
  }
  
  .top-section-right {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  
  /* Optional: If buttons are wrapped in mcptop-all-buttons div */
  .mcptop-all-buttons {
    display: flex;
    flex-wrap: nowrap;
  }
  
  /* Red Button Styling (RedButton.css) */
  .red-button {
    background-color: rgb(197, 41, 41);
    color: black;
    padding: 10px 20px;
    font-size: 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    width: 180px; /* adjusted for better fit */
    height: 50px;
  }
  
  .red-button:hover {
    background-color: rgb(255, 0, 0);
  }
  
  .red-button:focus {
    outline: none;
  }
  
  /* Bottom Section Styling */
  .bottom-section {
    display: flex;
    height: 96%;
  }
  
  .column {
    padding: 10px;
    background-color: #f4f4f4;
    border-radius: 8px;
    border: 1px solid #ccc;
  }
  
  .column-1 {
    flex: 2;
  }
  
  .column-2 {
    flex: 1;
  }
  
  .column-3 {
    flex: 2;
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .top-section {
      flex-direction: column;
      align-items: center;
      height: auto;
    }
  
    .top-section-left {
      text-align: center;
      margin-bottom: 10px;
    }
  
    .top-section-right {
      flex-direction: column;
      align-items: center;
      flex-wrap: wrap;
    }
  
    .mcptop-all-buttons {
      flex-direction: column;
      align-items: center;
    }
  
    .red-button {
      width: 200px;
    }
  
    .bottom-section {
      flex-direction: column;
    }
  
    .column {
      margin-bottom: 20px;
    }
  }
  import React from "react";

function BorderText({text}) {
  const styles = {
    fieldset: {
      border: "2px solid #ccc",
      borderRadius: "10px",
      maxWidth: "500px",
      minHeight: "70px", // added more height
      marginTop: "10px",
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
    },
    legend: {
      fontWeight: "bold",
      fontSize: "12px",
    },
  };

  return (
    <fieldset style={styles.fieldset}>
      <legend style={styles.legend}>{text}</legend>
    </fieldset>
  );
}

export default BorderText;
import React from 'react';
import './RedButton.css';

function RedButton({ text, onClick }) {
  return (
    <button className="red-button" onClick={onClick} aria-label={text}>
      {text}
    </button>
  );
}

export default RedButton;
.red-button {
    background-color: rgb(197, 41, 41);
    color: black;
    padding: 10px 20px;
    font-size: 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    width: 250px;
    height: 50px;
    margin: 10px;
  }
  
  .red-button:hover {
    background-color: rgb(255, 0, 0);
    color: white;
  }
  
  .red-button:focus {
    outline: none;
  }
  
  @media (max-width: 768px) {
    .red-button {
      width: 200px;
    }
  }
  




















