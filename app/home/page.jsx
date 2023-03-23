'use client'

import { supabase } from '../../supabaseClient';
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
    const [user, setUser] = useState(null)
    const [people, setPeople] = useState(null)  // example of profiles for use in frontend instead of just console.log
    const [signups, setSignups] = useState(null)
    const [shifts, setShifts] = useState(null)
    const router = useRouter()
  
    useEffect(() => {
      const fetchPeople = async() => {
        try {
          // checked if the logged in user is registered in the "admin" table
          await supabase.auth.getUser().then(async (data, err) => {
            if (data) {
              await supabase
              .from("admins")
              .select()
              .eq("id", data.data.user.id)
              .then((admin, err) => {
                if (admin.data.length !== 0) {  // checks if logged in user is registered in the admin table
                  console.log("this user is an admin")
                  setUser(admin)
                } else {
                  console.log("this user is not an admin or does not exist in our DB")
                }
              })
            }
          }) 
  
          // get all entries in the "profiles" table
          await supabase
          .from("profiles")
          .select()
          .then((profiles, err) => {
            if (profiles) {
            //   console.log(profiles)
              setPeople(profiles)
            } else {
              console.log("error in profiles")
            }
          })
          .then(console.log("this is profiles"))
  
          // get all entries in the "signups" table
          await supabase
            .from("signups")
            .select()
            .then((signups, err) => {
              if (signups) {
                // console.log(signups)
                setSignups(signups)
              } else {
                console.log("error in signups")
              }
            })
            .then(console.log("this is signups"))
  
          // get all entries in the "shifts" table
          await supabase
            .from("shifts")
            .select()
            .then((shifts, err) => {
              if (shifts) {
                // console.log(shifts)
                setShifts(shifts)
              } else {
                console.log("error in shifts")
              }
            })
            .then(console.log("this is shifts"))
  
          // to add to tables... (this is from old project, so won't work for this one yet)
          // await supabase
          //     .from("signups")  // select between (profile, signups, shifts)
          //     .insert({  // (check the schema of each table)
          //       user_id: user.id,
          //       first_name: user.first_name,
          //       last_name: user.last_name,
          //       email: user.email,
          //       shift_id: s.id,
          //     })
          //     .then(() => {
          //       success = true;
          //     });
          // });
  
          // to delete data from a table... (this is from old project, so won't work for this one yet)
          // await supabase
          // .from("signups")
          // .delete()
          // .eq("shift_id", s.shift_id)
          // .eq("user_id", uid);
  
        } catch (err) {
          console.log("caught error")
        }
      }
      fetchPeople()
    }, [])

    if (!user) {
        return (
            <>
                <h2>Ur not an admin bruh</h2>
            </>
        )
    }

    const logout = async () => {
        let success = false
        await supabase.auth.signOut().then(() => {
            success = true
        })
        if (success) router.push("/")
    }
  
    return (
      <div>
        <button onClick={() => logout()}>Logout</button>
        {people ? (
          <>
            <h2>We have people</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {people.data.map((person) => (
                  <>
                    <tr key={person.id}>
                      <td>{person.id}</td>
                      <td>{person.first_name}</td>
                      <td>{person.last_name}</td>
                      <td>{person.email}</td>
                      <button>Check</button>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <>
            <h2>We DONT GOT people</h2>
          </>
        )
        }
  
        {signups ? (
          <>
            <h2>We have signups</h2>
            <table>
              <thead>
                <tr>
                  <th>Shift ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Clock In</th>
                  <th>Clock Out</th>
                  <th>Hours</th>
                </tr>
              </thead>
              <tbody>
                {signups.data.map((signup) => (
                  <>
                    <tr key={signup.id}>
                      <td>{signup.shift_id}</td>
                      <td>{signup.first_name}</td>
                      <td>{signup.last_name}</td>
                      <td>{signup.clock_in}</td>
                      <td>{signup.clock_out}</td>
                      <td>{signup.hours}</td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <>
            <h2>We DONT GOT people</h2>
          </>
        )
        }
  
        {shifts ? (
          <>
            <h2>We have shifts</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Rem. Slots</th>
                </tr>
              </thead>
              <tbody>
                {shifts.data.map((shift) => (
                  <>
                    <tr key={shift.id}>
                      <td>{shift.shift_date}</td>  {/*} put the custom sort function */}
                      <td>{shift.shift_type}</td>
                      <td>{shift.start_time}</td>
                      <td>{shift.end_time}</td>
                      <td>{shift.remaining_slots}</td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <>
            <h2>We DONT GOT people</h2>
          </>
        )
        }
      </div>
    )
}