"use client";

import { supabase } from '../supabaseClient';
import { useState, useEffect } from 'react'

export default function Home() {

  const [people, setPeople] = useState(null)  // example of profiles for use in frontend instead of just console.log
  const [signups, setSignups] = useState(null)
  const [shifts, setShifts] = useState(null)

  useEffect(() => {
    const fetchPeople = async() => {
      try {

        // log in a user
        await supabase.auth.signInWithPassword({
          email: 'banbim@banbim.com',
          password: 'banbim',
        })

        // checked if the logged in user is registered in the "admin" table
        await supabase.auth.getUser().then(async (data, err) => {
          if (data) {
            await supabase
            .from("admins")
            .select()
            .eq("id", data.data.user.id)
            .then((admin, err) => {
              if (admin.data.length !== 0) {  // checks if logged in user is registered in the admin table
                console.log(admin)
                console.log("this user is an admin")
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
            console.log(profiles)
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
              console.log(signups)
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
              console.log(shifts)
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

  // if (people) {
  //   console.log("we have pEoPlE")
  // } else {
  //   console.log("no people, everyone is not real")
  //   // console.log(people)
  // }

  return (
    <div>
      <h1>Hello World</h1>
      {people ? (
        <>
          <h2>We have people</h2>
          <table>
            <thead>
              <tr>
                <th>Profile First Names</th>
              </tr>
            </thead>
            <tbody>
              {people.data.map((person) => (
                <>
                  <tr key={Date.now()}>
                    <td>{person.first_name}</td>
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
                <th>People Who Signed Up For Something First Names</th>
              </tr>
            </thead>
            <tbody>
              {signups.data.map((signup) => (
                <>
                  <tr key={Date.now()}>
                    <td>{signup.first_name}</td>
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
                <th>Dates of the Shifts</th>
              </tr>
            </thead>
            <tbody>
              {shifts.data.map((shift) => (
                <>
                  <tr key={Date.now()}>
                    <td>{shift.shift_date}</td>
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