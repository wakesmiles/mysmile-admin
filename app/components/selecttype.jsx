import { useEffect, useState } from 'react';
import Select from 'react-select';
import "../../styles/selectlabel.css"

const CustomShiftTypeEdit = ({ cell, column, table, onUpdate }) => {
    const [isInitial, setIsInitial] = useState(true)
    const shiftType = [
        {value: 'volunteer', label: 'Volunteer'},
        {value: 'orientation', label: 'Orientation'}, 
        {value: 'pre-dental', label: 'Pre-Dental'},
        {value: 'dental assistant one', label: 'Dental Assistant One'}, 
        {value: 'dental assistant two', label: 'Dental Assistant Two'},
        {value: 'registered dental hygienist', label: 'Registered Dental Hygienist'},
        {value: 'dentist', label: 'Dentist'}
    ];  
  // Access the current cell's data
  const cellData = cell.getValue().split(', ');

  // Initialize the selected options
  const [values, setValues] = useState([]);

  // Convert the cell value to an array of selected options
  useEffect(() => {
    if (isInitial) {
        setIsInitial(false)
        setValues(cellData.map((value) => ({ value, label: shiftType.find(obj => {
            return obj.value === value
        }).label})));
    }
  }, [cellData]);

  // Handle changes when the user selects options
  const handleSelectChange = (vals) => {
    setValues(vals)
    onUpdate(vals)
  }

  const style = {
    option: (provided) => ({
      ...provided,
      backgroundColor: ""
    })
  };

  return (
    <div>
        <label>Shift Type</label>
        <Select
            options={shiftType}
            isMulti={true}
            value={values}
            onChange={ handleSelectChange }
            styles={style}
        />
    </div>
  );
};

export default CustomShiftTypeEdit;
