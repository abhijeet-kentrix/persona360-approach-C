import React, { useEffect,useState } from 'react';
import axios from 'axios';
import { Button } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { BACKEND_URL,urban_rural ,empty_column_names,empty_column_values,empty_filter_value,empty_filter_cat} from './data';
import Dropdown from './Dropdown';
import Form from 'react-bootstrap/Form';


const UploadBar = ({setFilterCat,setFilterValue,columnNames,columnValues,setColumnNames,setColumnValues,setInProgressFlag,selectedType,setSelectedType}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  useEffect(()=>{
    setFilterCat(empty_filter_cat);
    setFilterValue(empty_filter_value);
    setColumnNames(empty_column_names);
    setColumnValues(empty_column_values);
  },[selectedFile]);

 
  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file.');
      return;
    }
    setInProgressFlag(true)
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('username',JSON.parse(sessionStorage.user).username);
    formData.append('selectedType',selectedType);

    try {
      const response = await axios.post(`${BACKEND_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // console.log('File uploaded successfully:', response.data);
      // setResult(response.data.output);
      setColumnNames({...columnNames,...response.data.column_names});
      setColumnValues({...columnValues,...response.data.column_values});
      // console.log("columnNames",columnNames);
      // console.log("columnValues",columnValues);
      // console.log('File uploaded successfully:', response.data.column_names);
      setInProgressFlag(false);
    } catch (error) {
      alert("Uploaded file is not in proper format. Please check the file and reupload.");
      console.error('Error uploading file:', error);
      setInProgressFlag(false);
    }
  };

  return (
    <div className='container upload_bar'>
      <Dropdown filterName="Geography Level" filterObject={urban_rural} filterValue={selectedType} setFilterValue={setSelectedType} />
      <Form.Control type="file" size='lg'  accept=".xlsx,.xls,.csv" onChange={handleFileChange} style={{width:'600px'}} />
      {/* <Form.Group controlId="formFile" className="mb-3" >
      <Form.Control type="file" size='lg' />
      </Form.Group> */}
      {/* <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} /> */}
      <Button startIcon={<CloudUploadIcon/>} onClick={handleUpload}>Upload</Button>
    </div>
  );
};

export default UploadBar;
