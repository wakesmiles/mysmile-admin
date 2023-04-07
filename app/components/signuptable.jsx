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

import '../../styles/table.css'

const Signuptable = ( {signups, shifts} ) => {

  const [createModalOpen, setCreateModalOpen] = useState(false)
  // const [validationErrors, setValidationErrors] = useState({})

  const data = []
  const signup_data = signups.data
  const shifts_data = shifts.data

  signup_data.forEach(signup => {  // 데이터 정리
    let obj = {}
    obj.id = signup.id
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
    (row) => {  // apply the following code to all rows...
      // check to see if there are other instances in other databases first?
      if (!confirm(`Are you sure you want to delete the shift for ${row.getValue('first_name')} at ${row.getValue('date')} starting at ${row.getValue('start_time')}?`)) return
      // API: delete request
      tableData.splice(row.index, 1)
      setTableData([...tableData])
    },
    [tableData],
  )

  // not sure why the code below is not working
  // const validateRequired = (value) => !!value.length
  // const getCommonEditTextFieldProps = useCallback(
  //   (cell) => {
  //     return {
  //       error: !!validationErrors[cell.id],
  //       helperText: validationErrors[cell.id],
  //       onBlur: (event) => {
  //         const isValid = validateRequired(event.target.value)  
  //         if(!isValid) {  // set validation error for cell if invalid
  //           setValidationErrors({
  //             ...validationErrors,
  //             [cell.id]: `${cell.column.columnDef.header} is required`,
  //           })
  //         } else { // remove validation error for cell if valid
  //           delete validationErrors[cell.id]
  //           setValidationErrors({
  //             ...validationErrors
  //           })
  //         }
  //       }
  //     }
  //   }
  // )

  const columns = useMemo( // 제3자 라이브러리가 필요한 데이타
    () => [
      {
        accessorKey: 'date', 
        header: 'Shift Date',
        // muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        //   ...getCommonEditTextFieldProps(cell)
        // })
      },
      {
        accessorKey: 'start_time',
        header: 'Shift Start Time',
        // muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        //   ...getCommonEditTextFieldProps(cell)
        // })
      },
      {
        accessorKey: 'end_time', 
        header: 'Shift End Time',
        // muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        //   ...getCommonEditTextFieldProps(cell)
        // })
      },
      {
        accessorKey: 'first_name',
        header: 'First Name',
        // muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        //   ...getCommonEditTextFieldProps(cell)
        // })
      },
      {
        accessorKey: 'last_name',
        header: 'Last Name',
        // muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        //   ...getCommonEditTextFieldProps(cell)
        // })
      },
      {
        accessorKey: 'clock_in',
        header: 'Clock In Time',
        // muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        //   ...getCommonEditTextFieldProps(cell)
        // })
      },
      {
        accessorKey: 'clock_out',
        header: 'Clock Out Time',
        // muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        //   ...getCommonEditTextFieldProps(cell)
        // })
      },
      {
        accessorKey: 'hours',
        header: 'Hours Volunteered',
        // enableEditing: false,  // guessing this is not automatically calculated in Supabase so admin would have to manually update it
        // muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        //   ...getCommonEditTextFieldProps(cell)
        // })
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
      {/* 이름은 CreateNewAccountModal 인데, 사실은 신규 signup 만드는 component */}
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
      <DialogTitle textAlign="center">Create New Signup</DialogTitle>
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
        <Button color="secondary" onClick={handleSubmit} variant="contained">Create New Signup</Button>
      </DialogActions>
    </Dialog>
  )
}

export default Signuptable