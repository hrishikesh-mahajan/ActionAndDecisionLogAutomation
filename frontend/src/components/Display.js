import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import * as XLSX from "xlsx";
import { getStorage, ref, uploadString } from "firebase/storage";


const Display = () => {
  const [authUser, setAuthUser] = useState(null);
  const [data, setData] = useState([]);
  const [inputRow, setInputRow] = useState({});
  const [workbook, setWorkbook] = useState(null); // State variable for workbook

  useEffect(() => {
  
    const fetchData = async () => {
      try {
        const response = await fetch('/Book1.xlsx');//Fetches the file from the server
        const blob = await response.blob();//Reads the file as binary 
        const reader = new FileReader();//File Reader API to read a BLOB
        
        reader.onload = () => {

          const workbook = XLSX.read(reader.result, { type: 'binary' });
          const wsname = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[wsname]; // Assign worksheet
          setWorkbook(workbook); // Store workbook in state
          const data = XLSX.utils.sheet_to_json(worksheet);
    
          setData(data);
        };
  
        reader.readAsBinaryString(blob);
      } catch (error) {
        console.error('Error fetching or processing file:', error);
      }
  
    };

    fetchData(); // Fetch data when component mounts

    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    return () => {
      listen();
    };
  }, []);

  const handleEditRow = async (rowIndex) => {
    const rowToEdit = { ...data[rowIndex] }; // Create a shallow copy of the row
    const updatedRow = { ...rowToEdit }; // Create a shallow copy to track changes

    Object.keys(rowToEdit).forEach((key) => {
      const value = rowToEdit[key];
      const newValue = prompt(`Edit ${key}:`, value);
      if (newValue !== null) {
        updatedRow[key] = newValue;
      }
    });

    // Update only if there are changes
    if (JSON.stringify(updatedRow) !== JSON.stringify(rowToEdit)) {
      const updatedData = [...data]; // Create a shallow copy of the data array
      updatedData[rowIndex] = updatedRow;
      setData(updatedData);

      try {
        // Send index, updated row, and row number to the backend
        const response = await fetch('/updateExcel', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ rowIndex, updatedRow })
        });

        if (!response.ok) {
          throw new Error('Failed to send data to the server');
        }

        console.log('Data successfully sent to the server');
      } catch (error) {
        console.error('Error sending data to the server:', error);
      }
    } else {
      console.log('No changes made to the row');
    }
  };

  const handleDeleteRow = async (rowIndex) => {
    if (window.confirm("Are you sure you want to delete this row?")) {
      const deletedRow = data[rowIndex];
      const updatedData = data.filter((_, index) => index !== rowIndex);

      try {
        // Send index, deleted row, and row number to the backend
        const response = await fetch('/deleteExcel', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ rowIndex, deletedRow })
        });

        if (!response.ok) {
          throw new Error('Failed to send data to the server');
        }

        console.log('Data successfully sent to the server');
      } catch (error) {
        console.error('Error sending data to the server:', error);
      }

      setData(updatedData);
    }
  };

  const handleInputChange = (e, columnName) => {
    const { value } = e.target;
    setInputRow(prevInputRow => ({
      ...prevInputRow,
      [columnName]: value 
    }));
  };

  const addRowToData = async () => {
    if (!workbook) return; // Ensure workbook is initialized

    const updatedData = [...data, inputRow];
    const rowIndex = updatedData.length - 1; // Get the index of the newly added row

    try {
      // Send index, added row, and row number to the backend
      const response = await fetch('/addExcel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rowIndex, addedRow: inputRow })
      });

      if (!response.ok) {
        throw new Error('Failed to send data to the server');
      }

      console.log('Data successfully sent to the server');
    } catch (error) {
      console.error('Error sending data to the server:', error);
    }

    console.log(updatedData);
    setData(updatedData);
    setInputRow({});
  };  

  return (
      <div>
        <table>
          <thead>
            <tr>
              {data.length > 0 && Object.keys(data[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
              <th>Actions</th> {/* Add a column for actions */}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {Object.keys(row).map((key, cellIndex) => (
                  <td key={cellIndex}>{row[key]}</td>
                ))}
                <td>
                  <button onClick={() => handleEditRow(rowIndex)}>Edit</button>
                  <button onClick={() => handleDeleteRow(rowIndex)}>Delete</button> {/* Delete button */}
                </td>
              </tr>
            ))}
            {/* Input fields for adding a new row */}
            <tr>
              {Object.keys(data.length > 0 ? data[0] : {}).map((columnName, index) => (
                <td key={index}>
                  <input 
                    type="text" 
                    value={inputRow[columnName] || ""} 
                    onChange={(e) => handleInputChange(e, columnName)} 
                  />
                </td>
              ))}
              <td>
                <button onClick={addRowToData}>Add Row</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  );
};

export default Display;
