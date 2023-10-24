'use client'
import { useCallback, useMemo, useState } from 'react'
import MaterialReactTable from "material-react-table"
import Loading from '../loading'

// According to MUI docs this imports faster than doing: import { Box, Button, ... } from '@mui/material'
// More info: https://mui.com/material-ui/guides/minimizing-bundle-size/
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Delete from '@mui/icons-material/Delete'
import Edit from '@mui/icons-material/Edit'
import APIMessage from './apimsg'
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { supabase } from '@/supabaseClient'
import { states } from '../states.jsx'
import { FormControl, InputLabel} from '@mui/material'
import '../../styles/table.css'
import { urlToHttpOptions } from 'url'

const Profiletable = ( {profiles, signups} ) => {
  
  const [validationErrors, setValidationErrors] = useState({})
  const [apiMsgOpen, setApiMsgOpen] = useState(false)  // change back to false after testing
  const [apiResponse, setApiResponse] = useState("")

  // orientation field from database is a boolean, but it needs to be a string to be read by the table
  const profiles_oriented = profiles.data.filter(profile => profile.first_name !== "WS_Admin").map(obj => {  // filter out admin(s)
    let data = {...obj, orientation: obj.orientation.toString()} 
    return data
  })
  // vvv get data first, then set to state tableData
  const [tableData, setTableData] = useState(profiles_oriented)

  async function update(values) {
    let orientation_to_bool = values.orientation.toLowerCase() === "true"  // convert back to bool to be read by Supabase
    let post_obj = {...values, orientation: orientation_to_bool}

    try {
      const { error } = await supabase.from("profiles").update(post_obj).eq("id", values.id)
      if (error) {
        console.log("error editing data")  // doesn't show pop up box with status in this case, just console log
      } else {
        console.log("successfully update data")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      tableData[row.index] = values
      update(values)  // API request for update
      setTableData([...tableData])
      exitEditingMode()
    }
  }

  const handleCancelRowEdits = () => {
    setValidationErrors({})
  }

  // There is no post request in profiles because it is easier to create new profile in existing volunteer app

  async function deleteRequest(values) {
    try {
      const { error } = await supabase.from("profiles").delete().eq('id', values.original.id)  // delete the Profile data structure
      if (error) {
        setApiMsgOpen(true)
        setApiResponse(error.message)
      } else {
        setApiMsgOpen(true)
        setApiResponse("Profile deletion was successful!")
      }
      console.log(values.original.id)
      const { data, error2 } = await supabase.auth.admin.deleteUser(values.original.id)  // this gets a not authorized error, so doesn't work right now
      if (error2) {
        console.log("error in deleting the authentication")
        console.log(error2)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteRow = useCallback(
    (row) => {
      // Check signups for this profile. find and delete signups associated with this profile
      if (signups.data.filter(signup => signup.email === row.getValue('email')).length > 0) {
        setApiMsgOpen(true)
        setApiResponse("Please delete all signups for this profile first")
      } else {
        if (!confirm(`Are you sure you want to delete ${row.getValue('first_name')}`)) return
        deleteRequest(row)  // API delete request
        tableData.splice(row.index, 1)
        setTableData([...tableData])
      }
    },
    [tableData],
  )

  // validation methods for the edit functionality below
  const validateRequired = (value) => !!value.length
  const validateEmail = (email) =>  // idk if this actually works
    !!email.length &&
    email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    )

  const getCommonEditTextFieldProps = useCallback(
    (cell) => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid =
            cell.column.id === 'email'
              ? validateEmail(event.target.value)  // if table row is email: validateEmail()
              : validateRequired(event.target.value)  // else: validateRequired()
          if(!isValid) {  // set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is required`,
            })
          } else { // remove validation error for cell if valid
            delete validationErrors[cell.id]
            setValidationErrors({
              ...validationErrors
            })
          }
        }
      }
    }
  )
  const shiftType = ['Volunteer', 'Orientation', 'Pre-Dental', 'Dental Assistant I', 'Dental Assistant II', 'Registered Dental Hygienist', 'Dentist', 'Admin', 'Interpreter']; // Different types of shifts

  const columns = useMemo( // input data for the table library
    () => [
      {
        accessorKey: 'id',
        header: 'Volunteer ID',
        enableEditing: false,
      },
      {
        accessorKey: 'first_name', 
        header: 'First Name',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell)
        })
      },
      {
        accessorKey: 'last_name',
        header: 'Last Name',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell)
        })
      },
      {
        accessorKey: 'email', 
        header: 'Email',
        enableEditing: false,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell)
        })
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell)
        })
      },
      {
        accessorKey: 'city',
        header: 'City',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell)
        })
      },
      {
        accessorKey: 'state',
        header: 'State',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell)
        })
      },
      {
        accessorKey: 'address',
        header: 'Address',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell)
        })
      },
      {
        accessorKey: 'zip',
        header: 'Zip',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell)
        })
      },
      {
        accessorKey: 'orientation',
        header: 'Oriented',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell)
        })
      },
      {
        accessorKey: 'role',
        header: 'Role',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          select: true, //change to select for a dropdown
          children: shiftType.map((shift) => (
            <MenuItem key={shift} value={shift}>
              {shift}
            </MenuItem>
          )),
        }),
      },
    ],
    [getCommonEditTextFieldProps],
  )

  return (
    <div>
      <h2 className="p-4 text-white">Profiles Table</h2>
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
        initialState={{ columnVisibility: { id: false } }}
        editingMode="modal"
        enableColumnOrdering
        enableEditing
        onEditingRowSave={handleSaveRowEdits}
        onEditingRowCancel={handleCancelRowEdits}
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
          </Box>
        )}
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
        <div></div>
      }
    </div>
  )
}


export default Profiletable