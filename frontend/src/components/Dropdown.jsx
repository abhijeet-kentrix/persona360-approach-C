import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function Dropdown({filterName,filterObject,filterValue,setFilterValue}) {
  const handleChange = (event) => {
    setFilterValue(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 300 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{filterName}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={filterValue}
          label={filterName}
          onChange={handleChange}
        >
           {Object.entries(filterObject).map(([value, valueFilterName], index) => (
              <MenuItem key={index} value={value}>{valueFilterName}</MenuItem>
          ))}
          
        </Select>
      </FormControl>
    </Box>
  );
}
