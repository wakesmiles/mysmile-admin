'use client'
import { useCallback, useMemo, useState } from 'react'
import MaterialReactTable from "material-react-table"

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

import APIMessage from './apimsg'
import '../../styles/table.css'
import { supabase } from '@/supabaseClient'

const Signuptable = ( {profiles, signups, shifts} ) => {

  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [apiMsgOpen, setApiMsgOpen] = useState(false)  // change back to false after testing
  const [apiResponse, setApiResponse] = useState("")
  const [dontRefresh, setDontRefresh] = useState(false)  // if the user entered something wrong and nothing is being added to DB, don't want to do a hard refresh

  const data = []
  const profiles_data = profiles.data
  const signup_data = signups.data
  const shifts_data = shifts.data

  let latest_id = 0

  signup_data.forEach(signup => { 
    let obj = {}
    obj.id = signup.id
    latest_id = Math.max(latest_id, signup.id)
    obj.shiftid = signup.shift_id
    obj.userid = signup.user_id
    obj.first_name = signup.first_name
    obj.last_name = signup.last_name
    obj.email = signup.email
    obj.clock_in = signup.clock_in ?? "" // if we get null from database, convert to ""
    obj.clock_out = signup.clock_out ?? ""
    obj.hours = signup.hours ?? ""
    obj.email = signup.email
    
    let corresponding_shift = shifts_data.filter(shift => shift.id === signup.shift_id)[0]
    obj.date = corresponding_shift.shift_date
    obj.start_time = corresponding_shift.start_time
    obj.shift_type = corresponding_shift.shift_type.map((type) => {
      return type.toUpperCase() + ', '
    })
    obj.end_time = corresponding_shift.end_time
    obj.rem_slots = corresponding_shift.remaining_slots

    data.push(obj)  
  })

  const [tableData, setTableData] = useState(data)

  async function post(values) {

    // find shift id based on date, start_time, end_time 
    const shift_for_given_date = shifts_data.filter(shift => (shift.shift_date == values.date && shift.start_time === values.start_time && shift.end_time === values.end_time && shift.shift_type === values.shift_type))[0]

    // find user for given id
    let volunteer_for_given_info = profiles_data.filter(vol => (vol.first_name === values.first_name && vol.last_name === values.last_name && vol.email === values.email))[0]

    const new_signup = {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      id: latest_id+1,
      shift_id: (shift_for_given_date && shift_for_given_date.remaining_slots > 0)? shift_for_given_date.id : "No open shift found with this date and time",  // check if there is an open shift for this date
      user_id: volunteer_for_given_info ? volunteer_for_given_info.id : "No volunteer found with this name and/or email",
      clock_in: null,
      clock_out: null
    }
    latest_id++  // allows for creating multiple signup at once

    try {
      const { error } = await supabase.from("signups").insert(new_signup)
      if (error) {
        setApiMsgOpen(true)
        setApiResponse(error.message)
        setDontRefresh(true)
      } else {
        setApiMsgOpen(true)
        setApiResponse("New signup successfully added!")
        // decrease remaining slots upon successful signup
        try {
          await supabase.from("shifts").update({remaining_slots: shift_for_given_date.remaining_slots - 1}).eq('id', shift_for_given_date.id)
        } catch (error) {
          console.log(error)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleCreateNewRow = (values) => {
    post(values)  // API Post request
    tableData.push(values)
    setTableData([...tableData])
  }
  
  async function update(values) {
    let new_user = profiles_data.filter(profile => (profile.email === values.email && profile.first_name === values.first_name && profile.last_name === values.last_name))[0]
    let post_obj = {}
    post_obj.user_id = new_user ? new_user.id : 404  // if can't find matching profile, change the data type from string to number to force it to throw an HTTP 400
    post_obj.first_name = values.first_name
    post_obj.last_name = values.last_name
    post_obj.email = values.email
    if (values.clock_in !== "" && values.clock_in !== "") {  
      post_obj.clock_in = values.clock_in
      post_obj.clock_out = values.clock_out
    }
    try {
      const { error } = await supabase.from("signups").update(post_obj).eq("id", values.id)
      if (error) {
        setApiMsgOpen(true)
        setDontRefresh(true)
        setApiResponse(error.message)
      } else {
        setApiMsgOpen(true)
        setApiResponse("Signup successfully updated!")
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    tableData[row.index] = values
    update(values)  // API request for update
    setTableData([...tableData])
    exitEditingMode()
  }

  async function deleteRequest(values) {
    try {
      const { error } = await supabase.from("signups").delete().eq('id', values.original.id)
      if (error) {
        setApiMsgOpen(true)
        setApiResponse(error.message)
        setDontRefresh(true)
      } else {
        setApiMsgOpen(true)
        setApiResponse("Signup successfully deleted!")
        // find the shift and update the remaining slot
        let shift_where_signup_was_deleted = shifts_data.filter(shift => shift.id === values.original.shiftid)[0]
        let current_rem_slots = shift_where_signup_was_deleted.remaining_slots
        try {
          const { error } = await supabase.from("shifts").update({remaining_slots: current_rem_slots + 1}).eq('id', shift_where_signup_was_deleted.id)
          if (error) {
            console.log("Error updating remaining slots")
          } else {
            console.log("Successfully change remaining slots")
          }
        } catch (error) {
          console.log(error)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  function handleStartOver() {
    setApiMsgOpen(false)
    setDontRefresh(false)
  }

  const handleDeleteRow = useCallback(
    (row) => {  // apply the following code to all rows...
      if (!confirm(`Are you sure you want to delete the shift for ${row.getValue('first_name')} at ${row.getValue('date')} starting at ${row.getValue('start_time')}?`)) return
      deleteRequest(row)  // API delete request
      tableData.splice(row.index, 1)
      setTableData([...tableData])
    },
    [tableData],
  )

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Signup ID',
        enableEditing: false
      },
      {
        accessorKey: 'shift_type',
        header: 'Shift Type',
        enableEditing: false
      },
      {
        accessorKey: 'date', 
        header: 'Shift Date',
        enableEditing: false
      },
      {
        accessorKey: 'start_time',
        header: 'Shift Start Time',
        enableEditing: false
      },
      {
        accessorKey: 'end_time', 
        header: 'Shift End Time',
        enableEditing: false
      },
      {
        accessorKey: 'first_name',
        header: 'First Name',
      },
      {
        accessorKey: 'last_name',
        header: 'Last Name',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'clock_in',
        header: 'Clock In Time',
      },
      {
        accessorKey: 'clock_out',
        header: 'Clock Out Time',
      },
      {
        accessorKey: 'hours',
        header: 'Hours Volunteered',
        enableEditing: false
      },
      ],
      [],
    )

  return (
    <div>
      <h2 className="p-4 text-white">Signups Table</h2>
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
        initialState={{ columnVisibility: { email: false, id: false } }}
        editingMode="modal"
        enableColumnOrdering
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
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <Button color="primary" onClick={() => setCreateModalOpen(true)} variant="contained">Create New Signup</Button>
        )}
      />

      <CreateNewModal
        columns={columns.filter(col => col.accessorKey !== "id")}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />

      {apiMsgOpen ? (  // message box that pops up after making API request
        <div className="fixed top-0 left-0 h-full w-full bg-gray-800 bg-opacity-50 z-50 flex justify-center items-center">
          <div className="relative mx-auto mt-16 p-6 bg-white rounded-lg shadow-xl">
            <APIMessage message={apiResponse}/>  
            <button className="absolute top-0 right-0 mt-4 mr-4 text-gray-500" type="button" aria-label="Close" onClick={() => dontRefresh ? handleStartOver() : location.reload()}>  {/* if dontRefresh is true, do setApiMsgOpen(false) and dontRefresh(false), else location.reload() */}
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

export const CreateNewModal = ({ open, columns, onClose, onSubmit }) => {
  const [values, setValues] = useState(() => 
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ''] = ''
      return acc
    }, {})
  )

  const handleSubmit = () => {
    onSubmit(values)
    onClose()
  }

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Signup</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack sx={{width: '100%', minWidth: { xs: '300px', sm: '360px', md: '400px'}, gap: '1.5rem'}}>
            {columns.filter(col => !(col.accessorKey === "clock_in" || col.accessorKey === "clock_out" || col.accessorKey === "hours")).map((column) => ( 
              <TextField
                key={column.accessorKey}
                label={column.header}
                name={column.accessorKey}
                onChange={(e) => setValues({...values, [e.target.name]: e.target.value})}
              />
            ))}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">Create New Signup</Button>
      </DialogActions>
    </Dialog>
  )
}

export default Signuptable