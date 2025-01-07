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
