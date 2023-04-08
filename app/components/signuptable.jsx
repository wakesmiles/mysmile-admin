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

  const data = []
  const signup_data = signups.data
  const shifts_data = shifts.data

  let latest_id = 0

  signup_data.forEach(signup => {  // 데이터 정리
    let obj = {}
    obj.id = signup.id
    latest_id = Math.max(latest_id, signup.id)
    obj.shiftid = signup.shift_id
    obj.userid = signup.user_id
    obj.first_name = signup.first_name
    obj.last_name = signup.last_name
    obj.email = signup.email
    obj.clock_in = signup.clock_in ?? "" // 만약에 null 이면 오류, 빈 따옴표로 변경하면 해결됌
    obj.clock_out = signup.clock_out ?? ""
    obj.hours = signup.hours ?? ""
    obj.email = signup.email
    
    let corresponding_shift = shifts_data.filter(shift => shift.id === signup.shift_id)[0]
    obj.date = corresponding_shift.shift_date
    obj.start_time = corresponding_shift.start_time
    obj.end_time = corresponding_shift.end_time
    obj.rem_slots = corresponding_shift.remaining_slots

    data.push(obj)  
  })

  const [tableData, setTableData] = useState(data)

  async function post(values) {
    // check if it meets remaining slots (can just check rem_slots field of data)

    // find shift id based on date, start_time, end_time 
    const shift_for_given_date = shifts_data.filter(shift => (shift.shift_date == values.date && shift.start_time === values.start_time && shift.end_time === values.end_time))[0]
    console.log(shift_for_given_date)  // get the shiftid of this field

    // find user for given id
    let volunteer_for_given_info = profiles.data.filter(vol => (vol.first_name === values.first_name && vol.last_name === values.last_name && vol.email === values.email))[0]
    // console.log(volunteer_for_given_info.id)

    const new_signup = {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      id: latest_id+1,
      shift_id: shift_for_given_date ? shift_for_given_date.id : "No shift found with this date and time",
      user_id: volunteer_for_given_info ? volunteer_for_given_info.id : "No volunteer found with this name and/or email",
      clock_in: null,
      clock_out: null
    }
    console.log(new_signup)
    latest_id++  // allows for creating multiple signup at once

    try {
      const { error } = await supabase.from("signups").insert(new_signup)
      if (error) {
        setApiMsgOpen(true)
        setApiResponse(error.message)
      } else {
        setApiMsgOpen(true)
        setApiResponse("Success!")
        // decrease remaining slots upon successful signup
        try {
          await supabase.from("shifts").update({remaining_slots: shift_for_given_date.remaining_slots - 1}).eq('id', shift_for_given_date.id)
        } catch (error) {
          console.log(error)
        }
      }
      // location.reload()  // maybe do this after clicking the X button
    } catch (error) {
      console.log(error)
    }
  }

  const handleCreateNewRow = (values) => {
    post(values)  // API Post request
    tableData.push(values)
    setTableData([...tableData])
  }

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    tableData[row.index] = values
    // API request for update, and refresh code here
    setTableData([...tableData])
    exitEditingMode()
  }

  const handleDeleteRow = useCallback(
    (row) => {  // apply the following code to all rows...
      // check to see if there are other instances in other databases first?
      if (!confirm(`Are you sure you want to delete the shift for ${row.getValue('first_name')} at ${row.getValue('date')} starting at ${row.getValue('start_time')}?`)) return
      // API: delete request
      tableData.splice(row.index, 1)
      setTableData([...tableData])
    },
    [tableData],
  )

  const columns = useMemo( // 제3자 라이브러리가 필요한 데이타
    () => [
      {
        accessorKey: 'date', 
        header: 'Shift Date',
      },
      {
        accessorKey: 'start_time',
        header: 'Shift Start Time',
      },
      {
        accessorKey: 'end_time', 
        header: 'Shift End Time',
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
      },
      ],
      [],
    );

  return (
    <div>
      <h2 className="p-4">Signups Table</h2>
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
        initialState={{ columnVisibility: { email: false } }}
        editingMode="modal"
        enableColumnOrdering
        enableEditing
        onEditingRowSave={handleSaveRowEdits}
        // onEditingRowCancel={handleCancelRowEdits}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '1rem'}}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() => table.setEditingRow(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
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
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />

      {apiMsgOpen ? (  // message box that pops up after making API request
        <div className="fixed top-0 left-0 h-full w-full bg-gray-800 bg-opacity-50 z-999 flex justify-center items-center">
          <div className="relative mx-auto mt-16 p-6 bg-white rounded-lg shadow-xl">
            <APIMessage message={apiResponse}/>  
            <button className="absolute top-0 right-0 mt-4 mr-4 text-gray-500" type="button" aria-label="Close" onClick={() => location.reload()}>
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