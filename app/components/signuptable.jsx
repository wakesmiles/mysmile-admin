'use client'
import { useMemo } from 'react'
import MaterialReactTable from "material-react-table";

import '../../styles/table.css'

const Signuptable = ( {signups, shifts} ) => {

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
      },
      {
        accessorKey: 'clock_out',
        header: 'Clock Out Time',
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
      <MaterialReactTable columns={columns} data={data} />
    </div>
    )
}

export default Signuptable