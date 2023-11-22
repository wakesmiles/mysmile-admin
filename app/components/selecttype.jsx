import { useEffect, useState } from 'react';
import Select from 'react-select';
import "../../styles/selectlabel.css"

const CustomShiftTypeEdit = ({ cell, column, table, onUpdate }) => {
    const [isInitial, setIsInitial] = useState(true)
    const shiftType = [
        {value: 'volunteer', label: 'Volunteer'},
        {value: 'orientation', label: 'Orientation'}, 
        {value: 'pre-dental', label: 'Pre-Dental'},
        {value: 'dental assistant i', label: 'Dental Assistant I'}, 
        {value: 'dental assistant ii', label: 'Dental Assistant II'},
        {value: 'registered dental hygienist', label: 'Registered Dental Hygienist'},
        {value: 'dentist', label: 'Dentist'},
        {value: 'admin', label: 'Admin'},
        {value: 'interpreter', label: 'Interpreter'}
    ];  

  // Initialize the selected options
  const [values, setValues] = useState([]);

  // Convert the cell value to an array of selected options
  useEffect(() => {
    if (isInitial) {
        setIsInitial(false)
        const cellData = cell.getValue().split(', ');
        handleSelectChange(cellData.map((value) => ({ value, label: shiftType.find(obj => {
            return obj.value === value
        }).label})))
    }
  }, []);

  // Handle changes when the user selects options
  const handleSelectChange = (vals) => {
    setValues(vals)
    onUpdate(vals)
  }

  return (
    <div>
        <label>Shift Type</label>
        <Select
            options={shiftType}
            isMulti={true}
            value={values}
            onChange={ handleSelectChange }
        />
    </div>
  );
};

export default CustomShiftTypeEdit;