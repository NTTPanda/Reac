import React, { useEffect, useState } from "react";
import { XMLParser } from "fast-xml-parser";

const ReadXML = ({ onDataReady }) => {
  const [equipmentNames, setEquipmentNames] = useState([]);
  const [equipmentModels, setEquipmentModels] = useState([]);
  const [nameModelPairs, setNameModelPairs] = useState([]); // Store combined objects

  useEffect(() => {
    fetch("/XML/my.xml")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch the XML file");
        }
        return response.text();
      })
      .then((data) => {
        const parser = new XMLParser();
        const parsedData = parser.parse(data);
        const equipmentList = parsedData.equipment_info.equipment || [];

        // Extract names and models
        const names = [];
        const models = [];
        const pairs = [];

        equipmentList.forEach((item) => {
          const { name, model } = item;
          names.push(name);
          models.push(model);
          pairs.push({ name, model });
        });

        setEquipmentNames(names);
        setEquipmentModels(models);
        setNameModelPairs(pairs);

        if (onDataReady) {
          // Pass the data to parent or handler
          onDataReady({ names, models, pairs });
        }
      })
      .catch((error) => console.error("Error:", error));
  }, [onDataReady]);

  return (
    <div>
      <h2>Equipment Names</h2>
      {equipmentNames.length > 0 ? (
        <ul>
          {equipmentNames.map((name, index) => (
            <li key={index}>{name}</li>
          ))}
        </ul>
      ) : (
        <p>No equipment names available.</p>
      )}

      <h2>Equipment Models</h2>
      {equipmentModels.length > 0 ? (
        <ul>
          {equipmentModels.map((model, index) => (
            <li key={index}>{model}</li>
          ))}
        </ul>
      ) : (
        <p>No equipment models available.</p>
      )}

      <h2>Equipment Name-Model Pairs</h2>
      {nameModelPairs.length > 0 ? (
        <ul>
          {nameModelPairs.map(({ name, model }, index) => (
            <li key={index}>
              <strong>Name:</strong> {name}, <strong>Model:</strong> {model}
            </li>
          ))}
        </ul>
      ) : (
        <p>No equipment pairs available.</p>
      )} 
    </div>
  );
};

export default ReadXML;
