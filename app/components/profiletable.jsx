'use client'
import { useCallback, useMemo, useState } from 'react'
import MaterialReactTable from "material-react-table"
import Loading from '../loading'

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

import { states } from '../states.jsx'

import '../../styles/table.css'

const Profiletable = ( {profiles} ) => {
  
  const [validationErrors, setValidationErrors] = useState({})
    
  // 원래 받던 데이타에서 오리엔테이션 필드가 boolean 인데, string 으로 바꿔야 테이블에 나타난다
  const profiles_oriented = profiles.data.map(obj => {
    let data = {...obj, orientation: obj.orientation.toString()} 
    return data
  })
  // vvv get data first, then set to state tableData
  const [tableData, setTableData] = useState(profiles_oriented)
  // console.log(tableData)

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      tableData[row.index] = values
      // API: update request
      // location.reload() maybe not necessary for profiles, necessary for other tables)
      setTableData([...tableData])
      exitEditingMode()
    }
  }

  const handleCancelRowEdits = () => {
    setValidationErrors({})
  }

  // 플로필 테이블에 새 계정 만들수 없는이유: 여기서 이메일과 비밀번호를 만들수 없다

  const handleDeleteRow = useCallback(
    (row) => {
      // TODO: check signups for this profile. find and delete signups associated with this profile
      if (!confirm(`Are you sure you want to delete ${row.getValue('first_name')}`)) return
      // API: delete request
      tableData.splice(row.index, 1)
      setTableData([...tableData])
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
    );

  const getCommonEditTextFieldProps = useCallback(
    (cell) => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid =
            cell.column.id === 'email'
              ? validateEmail(event.target.value)  // 테이블 열이 email 경우: validateEmail()
              : validateRequired(event.target.value)  // 테이블 열이 딴겨면: validateRequired()
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

  const columns = useMemo( // 제3자 라이브러리가 필요한 데이타
    () => [
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
      }
    ],
    [getCommonEditTextFieldProps],
  );

  return (
    <div>
      <h2 className="p-4">Profiles Table</h2>
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
        onEditingRowCancel={handleCancelRowEdits}
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
      />
    </div>
  )
}

export default Profiletable