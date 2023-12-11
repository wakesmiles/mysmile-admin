'use client'
import { useCallback, useMemo, useState } from 'react'
import MaterialReactTable from "material-react-table"
import { mkConfig, download, generateCsv } from 'export-to-csv'

// According to MUI docs this imports faster than doing: import { Box, Button, ... } from '@mui/material'
// More info: https://mui.com/material-ui/guides/minimizing-bundle-size/
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Delete from '@mui/icons-material/Delete'
import Edit from '@mui/icons-material/Edit'
import AssignmentIcon from '@mui/icons-material/Assignment'
import InsertEmoticon from '@mui/icons-material/InsertEmoticon'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'

import APIMessage from './apimsg'
import '../../styles/table.css'
import { supabase } from '@/supabaseClient'
import { FormControl, InputLabel, MenuItem } from '@mui/material'
import CustomShiftTypeEdit from './selecttype'
import Select from 'react-select'

const Shiftstable = ( {signups, shifts} ) => {

  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [volunteerModalOpen, setVolunteerModalOpen] = useState(false)
  const [volunteerModalMsg, setVolunteerModalMsg] = useState("")
  const [apiMsgOpen, setApiMsgOpen] = useState(false)  
  const [apiResponse, setApiResponse] = useState("")
  const [editedType, setEditedType] = useState([])

  const data = []
  const signup_data = signups.data
  const shifts_data = shifts.data

  shifts_data.forEach(shift => {  // create an object that gets info from database and generate info for table
    let obj = {}
    obj.id = shift.id  // only stored in data, not displayed in MUI table
    obj.type = shift.shift_type.sort()
    obj.date = shift.shift_date
    obj.start_time = shift.start_time
    obj.end_time = shift.end_time
    obj.remaining_slots = shift.remaining_slots
        
    let volunteers = []
    volunteers = signup_data.filter(signup => signup.shift_id === shift.id)
    obj.num_vols = volunteers.length
    obj.volunteers = volunteers  // only stored in shifts data, not displayed in MUI table
    if (volunteers.length === 0) {
      obj.email_1 = ""
      obj.email_2 = ""
    } else if (volunteers.length === 1) {
        obj.email_1 = volunteers[0].email
        obj.email_2 = ""
    } else {
        obj.email_1 = volunteers[0].email
        obj.email_2 = volunteers[1].email
    }
    data.push(obj)
  })

  const [tableData, setTableData] = useState(data)

  async function post(values) {  // POST request
    const { data, error } = await supabase.from('shifts').select('id').order('id', {ascending: false}).limit(1)
    let id = 0
    if (data) {
      id = data[0].id
    }
    const new_shift = {
      id: id + 1,
      shift_type: values.type.map((type) => type.toLowerCase()),
      shift_date: values.date,
      start_time: values.start_time + ".000Z",
      end_time: values.end_time + ".000Z",
      remaining_slots: +values.remaining_slots
    }

    try {
      const { error } = await supabase.from("shifts").insert(new_shift)
      if (error) {
        setApiMsgOpen(true)
        setApiResponse(error.message)
      } else {
        setApiMsgOpen(true)
        setApiResponse("Successfully added a new shift!")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleCreateNewRow = async (values) => {
    const { data, error } = await supabase.from('shifts').select('id').order('id', {ascending: false}).limit(1)
    values.id = 0
    if (data) {
      values.id = data[0].id
    }
    values.num_vols = 0
    values.type = values.type.map(type => type.label.toLowerCase())
    post(values)  // API Post request
    tableData.push(values)
    setTableData([...tableData])
  }

  async function update(values) {
    if (typeof values.type === 'string') {
      values.type = values.type.split(', ')
    }
    const update_obj = {
      id: values.id,
      shift_type: values.type.map((type) => type.toLowerCase()).sort(),
      shift_date: values.date,
      start_time: values.start_time,
      end_time: values.end_time,
      remaining_slots: values.remaining_slots
    }
    try {
      const { error } = await supabase.from("shifts").update(update_obj).eq("id", values.id)
      if (error) {
        setApiMsgOpen(true)
        setApiResponse(error.message)
      } else {
        setApiMsgOpen(true)
        setApiResponse("Successfully updated shift!")
      }
    } catch (error) {
      console.log(error)
    }
  }
    
  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    values.type = editedType.map((type) => type.value)
    tableData[row.index] = values
    console.log(values)
    update(values)  // API UPDATE request
    setTableData([...tableData])
    exitEditingMode()
  }

  async function deleteRequest(values) {
    try {
      const { error } = await supabase.from("shifts").delete().eq('id', values.original.id)
      if (error) {
        setApiMsgOpen(true)
        setApiResponse(error.message)
      } else {
        setApiMsgOpen(true)
        setApiResponse("Shift deletion was successful!")
      }
    } catch (error) {
      console.log(error)
    }
  }
    
  const handleDeleteRow = useCallback(
    (row) => {
      if (signup_data.filter(signup => signup.shift_id === row.getValue('id')).length > 0) {
        setApiMsgOpen(true)
        setApiResponse("Please delete all signups for this shift first")
      } else {
        if (!confirm(`Are you sure you want to delete the shift for ${row.getValue('date')} starting at ${row.getValue('start_time')}?`)) return
        deleteRequest(row)
        tableData.splice(row.index, 1)
        setTableData([...tableData])
      }
    },
    [tableData],
  )

  // this function is called viewVolunteers but it is really just copying emails
  const handleCopyEmails = (row) => {
    let copied_list_of_volunteers = ""
    data.filter(shift => {  // get array of all volunteers for the shift represented by this row
      if (shift.id === row.getValue('id')) {
        if (shift.volunteers.length > 0) {
          shift.volunteers.forEach(volunteer => {
            copied_list_of_volunteers += volunteer.email + ", "
          })
        }
      }
    })
    navigator.clipboard.writeText(copied_list_of_volunteers)
  }

  // function for copying volunter first and last names to clipboard
  const handleCopyNames = (row) => {
    let copied_volunteer_names = ""
    data.filter(shift => {
      if (shift.id === row.getValue('id')) {
        if (shift.volunteers.length > 0) {
          shift.volunteers.forEach(volunteer => {
            copied_volunteer_names += volunteer.first_name + " " + volunteer.last_name + ", "
          })
        }
      }
    })
    navigator.clipboard.writeText(copied_volunteer_names)
  }

  const shiftType = [
    {value: 'Volunteer', label: 'Volunteer'},
    {value: 'Orientation', label: 'Orientation'}, 
    {value: 'Pre-Dental', label: 'Pre-Dental'},
    {value: 'Dental Assistant I', label: 'Dental Assistant I'}, 
    {value: 'Dental Assistant II', label: 'Dental Assistant II'},
    {value: 'Registered Dental Hygienist', label: 'Registered Dental Hygienist'},
    {value: 'Dentist', label: 'Dentist'},
    {value: 'Admin', label: 'Admin'},
    {value: 'Interpreter', label: 'Interpreter'}
  ]; // Different types of shifts

  const handleShiftTypeUpdate = (updatedValues) => {
    console.log(updatedValues)
    setEditedType(updatedValues)
  }

  
  const columns = useMemo(
    () => {
      return [
        {
          accessorKey: 'id',
          header: 'Shift ID',
          enableEditing: false,
        },
        {
          id: 'type', 
          accessorFn: (row) => typeof row.type === 'string' ? row.type : row.type.join(', '),
          header: 'Shift Type',
          name: 'type', // Make sure the name matches the data field name
          Edit: (props) => <CustomShiftTypeEdit {...props} onUpdate={handleShiftTypeUpdate}/>
        },
        {
          accessorKey: 'date',
          header: 'Shift Date',
        },
        {
          accessorKey: 'start_time', 
          header: 'Start Time',
        },
        {
          accessorKey: 'end_time',
          header: 'End Time',
        },
        {
          accessorKey: 'email_1',
          header: 'Email 1',
          enableEditing: false
        },
        {
          accessorKey: 'email_2',
          header: 'Email 2',
          enableEditing: false
        },
        {
          accessorKey: 'num_vols',
          header: 'Filled',
          enableEditing: false
        },
        {
          accessorKey: 'remaining_slots',
          header: 'Rem. Slots'
        },
      ]
    },
    [],
  )

  const conf = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: true,
    headers: columns.map((c) => c.header),
  };
  const csvConfig = mkConfig(conf);
  
  const handleExportData = () => {
    const dynamicKey = "volunteers";

    const csv = generateCsv(csvConfig)(tableData.map((row) => {
      let {[dynamicKey]: _, ...rest} = row;
      return rest
    }))
    download(csvConfig)(csv)
  }

  const handleExportSelectedRows = (rows) => {
    const dynamicKey = "volunteers";
    const csv = generateCsv(csvConfig)(rows.map((r) => {
      let {[dynamicKey]: _, ...rest} = r.original;
      return rest
    }))
    download(csvConfig)(csv)
  }

  return (
    <div>
      <h2 className="p-4 text-white">Shifts Table</h2>
      <MaterialReactTable 
        displayColumnDefOptions={{
          'mrt-row-actions': {
            muiTableHeadCellProps: {
              align: 'center',
            },
            size: 120,
          },
        }}
        columns={columns} 
        data={tableData} 
        initialState={{ columnVisibility: { id: false } }}  // hide id by default
        editingMode="modal"
        enableColumnOrdering
        enableRowSelection
        enableEditing
        onEditingRowSave={handleSaveRowEdits}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '1rem'}}>
            <Tooltip arrow placement="bottom" title="Edit">
              <IconButton onClick={() => table.setEditingRow(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="bottom" title="Delete">
              <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="bottom" title="Copy Volunteer Emails">
              <IconButton onClick={() => {
                setVolunteerModalOpen(true)
                setVolunteerModalMsg("Volunteer emails copied to clipboard!")
                handleCopyEmails(row)
              }}>
                <AssignmentIcon/>
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="bottom" title="Copy Volunteer Names">
              <IconButton onClick={() => {
                setVolunteerModalOpen(true)
                setVolunteerModalMsg("Volunteer names copied to clipboard!")
                handleCopyNames(row)
              }}>
                <PeopleAltIcon/>
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={({table}) => (
          <Box>
            <Button color="primary" onClick={() => setCreateModalOpen(true)} variant="contained">Create New Shift</Button>
            <Button sx={{marginX: 5}} disabled={tableData.length == 0} color="primary" onClick={handleExportData} variant="contained">Export All Data</Button>
            <Button disabled={table.getSelectedRowModel().rows.length == 0} color="primary" onClick={() => handleExportSelectedRows(table.getSelectedRowModel().rows)} variant="contained">Export Selected Rows</Button>
          </Box>
        )}
      />

      {/* modal for creating new shift */}
      <CreateNewModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />

      {/* box that pops up when copy volunteer emails */}
      <ViewVolunteerModal
        open={volunteerModalOpen}
        onClose={() => setVolunteerModalOpen(false)}
        message={volunteerModalMsg}
      />

      {apiMsgOpen ? (  // message box that pops up after making API request
        <div className="fixed top-0 left-0 h-full w-full bg-gray-800 bg-opacity-50 z-50 flex justify-center items-center">
          <div className="relative mx-auto mt-16 p-6 bg-white rounded-lg shadow-xl">
            <APIMessage message={apiResponse}/> 
            <button className="absolute top-0 right-0 mt-4 mr-4 text-gray-500" type="button" aria-label="Close" onClick={() => setApiMsgOpen(false)}>
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        ): 
        <div></div>}

    </div>
  )
}

export const CreateNewModal = ({ open, columns, onClose, onSubmit }) => { 
  const [values, setValues] = useState(() => 
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ''] = column.id === 'type' ? [] : '';
      return acc
    }, {})
  )

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
  
  const handleSubmit = () => {
    onSubmit(values)
    onClose()
  }
  
  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      width: '100%',
      minWidth: '300px',
      gap: '1.5rem',
      minHeight: '50px'
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: '200px', 
    })
  };
  
  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Shift</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack sx={{width: '100%', minWidth: { xs: '300px', sm: '360px', md: '400px'}, gap: '1.5rem'}}>
            {columns.filter(col => !(col.accessorKey === "email_1" || col.accessorKey === "email_2" || col.accessorKey === "id" || col.accessorKey === "num_vols")).map((column) => (
              <div key={column.accessorKey || column.id}>
                {column.id === 'type' ? (
                  <Select
                  label = "Shift Type"
                  id="type"
                  placeholder='Shift Type'
                  isMulti
                  options={shiftType}
                  name={column.id}
                  onChange={(e) => setValues({...values, 'type': e})}
                  styles={customSelectStyles}
                  />
                ):(
              <TextField sx={{width: '100%', minWidth: { xs: '300px', sm: '360px', md: '400px'}, gap: '1.5rem'}} // All inputs are same size as Shift Type
                //key={column.accessorKey}
                label={column.header}
                name={column.accessorKey}
                onChange={(e) => setValues({...values, [e.target.name]: e.target.value})}
              />
                )}
              </div>
              ))}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">Create New Shift</Button>
      </DialogActions>
    </Dialog>
  )
}

export const ViewVolunteerModal = ({ open, onClose, message }) => {
  return (
    <Dialog open={open}>
      <div className="p-4 flex flex-col justify-center align-middle">
        <h2>{message}</h2>
        <IconButton onClick={onClose}>
          <InsertEmoticon />
        </IconButton>
      </div>
    </Dialog>
  )
}

export default Shiftstable
