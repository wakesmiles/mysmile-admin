'use client'
import { useCallback, useMemo, useState } from 'react'
import MaterialReactTable from "material-react-table"
// import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Stack, TextField, Tooltip } from '@mui/material'
// import { Delete, Edit } from '@mui/icons-material'
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

import '../../styles/table.css'

const Signuptable = ( {signups, shifts} ) => {

  const [createModalOpen, setCreateModalOpen] = useState(false)

  const data = []
  const signup_data = signups.data
  const shifts_data = shifts.data

  signup_data.forEach(signup => {  // 데이터 정리
    let obj = {}
    obj.first_name = signup.first_name
    obj.last_name = signup.last_name
    obj.clock_in = signup.clock_in ?? "" // 만약에 null 이면 오류, 빈 따옴표로 변경하면 해결됌
    obj.clock_out = signup.clock_out ?? ""
    obj.hours = signup.hours ?? ""
    obj.email = signup.email
    
    let corresponding_shift = shifts_data.filter(shift => shift.id === signup.shift_id)[0]
    obj.date = corresponding_shift.shift_date
    obj.start_time = corresponding_shift.start_time
    obj.end_time = corresponding_shift.end_time

    data.push(obj)
  })

  console.log(data)
  const [tableData, setTableData] = useState(data)

  const handleCreateNewRow = (values) => {
    tableData.push(values)
    setTableData([...tableData])
  }

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    tableData[row.index] = values
    // API request for update, and refresh code here
    setTableData([...tableData])
    exitEditingMode()
  }

  // const handleCancelRowEdits = () => {
  //   setValidationErrors({})
  // }

  const handleDeleteRow = useCallback(
    (row) => {
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
        accessorKey: 'clock_in',
        header: 'Clock In Time',
        enableEditing: false,
      },
      {
        accessorKey: 'clock_out',
        header: 'Clock Out Time',
        enableEditing: false,
      },
      {
        accessorKey: 'hours',
        header: 'Hours Volunteered'
      },
      ],
      [],
    );

  return (
    <div>
      <h2>Signups Table</h2>
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
          <Button color="secondary" onClick={() => setCreateModalOpen(true)} variant="contained">Create New Account</Button>
        )}
      />
      <CreateNewAccountModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />
    </div>
  )
}

export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit }) => {
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
      <DialogTitle textAlign="center">Create New Account</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack sx={{width: '100%', minWidth: { xs: '300px', sm: '360px', md: '400px'}, gap: '1.5rem'}}>
            {columns.map((column) => (
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
        <Button color="secondary" onClick={handleSubmit} variant="contained">Create New Account</Button>
      </DialogActions>
    </Dialog>
  )
}

export default Signuptable