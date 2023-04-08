'use client'
import { useCallback, useMemo, useState } from 'react'
import MaterialReactTable from "material-react-table";

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

import APIMessage from './apimsg'
import '../../styles/table.css'
import { supabase } from '@/supabaseClient';

const Shiftstable = ( {signups, shifts} ) => {

  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [volunteerModalOpen, setVolunteerModalOpen] = useState(false)
  const [apiMsgOpen, setApiMsgOpen] = useState(false)  
  const [apiResponse, setApiResponse] = useState("")

  const data = []
  const signup_data = signups.data
  const shifts_data = shifts.data

  let latest_id = 0  // 가장 최근 id 찾고, 나중에 자동으로 넣기

  shifts_data.forEach(shift => {  // 데이터 정리
    let obj = {}
    obj.id = shift.id  // only stored in data, not displayed in MUI table
    latest_id = Math.max(latest_id, shift.id)
    obj.type = shift.shift_type.toUpperCase()
    obj.date = shift.shift_date
    obj.start_time = shift.start_time
    obj.end_time = shift.end_time
    obj.remaining_slots = shift.remaining_slots
        
    let volunteers = []
    volunteers = signup_data.filter(signup => signup.shift_id === shift.id)
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

  // console.log(latest_id)

  // console.log(data)
  const [tableData, setTableData] = useState(data)

  async function post(values) {  // POST request
    const new_shift = {
      id: latest_id + 1,
      shift_type: values.type.toLowerCase(),
      shift_date: values.date,
      start_time: values.start_time + ".000Z",
      end_time: values.end_time + ".000Z",
      remaining_slots: +values.remaining_slots
    }
    latest_id++  // this allows adding shifts without having to refresh
    try {
      const { error } = await supabase.from("shifts").insert(new_shift)
      if (error) {
        setApiMsgOpen(true)
        setApiResponse(error.message)
      } else {
        setApiMsgOpen(true)
        setApiResponse("Success!")
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
    console.log(values)
    const update_obj = {
      id: values.id,
      shift_type: values.type,
      shift_date: values.date,
      start_time: values.start_time,
      end_time: values.end_time,
      remaining_slots: values.remaining_slots
    }
    console.log(update_obj)
    try {
      const { error } = await supabase.from("shifts").update(update_obj).eq("id", values.id)
      if (error) {
        setApiMsgOpen(true)
        setApiResponse(error.message)
      } else {
        setApiMsgOpen(true)
        setApiResponse("Success!")
      }
    } catch (error) {
      console.log(error)
    }
  }
    
  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    tableData[row.index] = values
    update(values)  // API UPDATE request
    setTableData([...tableData])
    exitEditingMode()
  }
    
  const handleDeleteRow = useCallback(
    (row) => {
      if (!confirm(`Are you sure you want to delete the shift for ${row.getValue('date')} starting at ${row.getValue('start_time')}?`)) return
      // API: delete request
      tableData.splice(row.index, 1)
      setTableData([...tableData])
    },
    [tableData],
  )

  // this function is called viewVolunteers but it is really just copying emails
  const handleViewVolunteers = (row) => {
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

  const columns = useMemo( // 제3자 라이브러리가 필요한 데이타
    () => [
      {
        accessorKey: 'id',
        header: 'Shift ID',
        enableEditing: false,
      },
      {
        accessorKey: 'type', 
        header: 'Shift Type',
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
        accessorKey: 'remaining_slots',
        header: 'Rem. Slots'
      },
    ],
    [],
  );

  return (
    <div>
      <h2 className="p-4">Shifts Table</h2>
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
        initialState={{ columnVisibility: { id: false } }}  // 기본적으로 id 기둥 숨기기
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
            <Tooltip arrow placement="right" title="Copy Volunteer Emails">
              <IconButton onClick={() => {
                setVolunteerModalOpen(true)
                handleViewVolunteers(row)
              }}>
                <AssignmentIcon/>
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <Button color="primary" onClick={() => setCreateModalOpen(true)} variant="contained">Create New Shift</Button>
        )}
      />

      {/* 신규 shift 만드는 component */}
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
      <DialogTitle textAlign="center">Create New Shift</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack sx={{width: '100%', minWidth: { xs: '300px', sm: '360px', md: '400px'}, gap: '1.5rem'}}>
            {columns.filter(col => !(col.accessorKey === "email_1" || col.accessorKey === "email_2" || col.accessorKey === "id")).map((column) => (
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
        <Button color="secondary" onClick={handleSubmit} variant="contained">Create New Shift</Button>
      </DialogActions>
    </Dialog>
  )
}

export const ViewVolunteerModal = ({ open, onClose }) => {
  return (
    <Dialog open={open}>
      <div className="p-4 flex flex-col justify-center align-middle">
        <h2>Volunteer emails copied to clipboard!</h2>
        {/* <button onClick={onClose}>X</button> */}
        <IconButton onClick={onClose}>
          <InsertEmoticon />
        </IconButton>
      </div>
    </Dialog>
  )
}

export default Shiftstable