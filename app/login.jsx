'use client'

import { useRef } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../supabaseClient"
import "../styles/login.css"

const Login = () => {
  const emailRef = useRef("")
  const passwordRef = useRef("")
  const router = useRouter()

  const login = async (e) => {
    e.preventDefault()
    // let success = false

    await supabase.auth
      .signInWithPassword({
        email: emailRef.current.value,
        password: passwordRef.current.value,
      })
      .then(({ data, error }) => {
        if (error) {
          alert(error.message)
        } else if (data) {
          // console.log(data)
          try {
            supabase.auth.getUser().then(async (data, err) => {
              if (data) {
                // console.log(data)
                await supabase
                  .from("admins")
                  .select()
                  .eq("id", data.data.user.id)
                  .then((admin, err) => {
                    // console.log(admin)
                    if (admin.data.length !== 0) {
                      // success = true
                      router.push("/home")
                    } else {
                      alert("Invalid login credentials")
                    }
                  })
              }
            })
          } catch (error) {
            console.log(error)
          }
        }
      });
    // if (success) router.push("/home")
  };

  return (
    <div className="body">
      <div className="section">
        <div className="login-box">
          <div className="login-square"></div>
          <div className="login-square"></div>
          <div className="login-square"></div>
          <div className="login-square"></div>
          <div className="login-square"></div>

          <div className="login-container">
            <div className="login-form">
              <h2>MySmile Admin Portal</h2>
              <form
                className="login-formbox"
                method="POST"
                onSubmit={(e) => login(e)}
              >
                <div className="login-inputBox">
                  <input
                    ref={emailRef}
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Email"
                    required
                  ></input>
                </div>
                <div className="login-inputBox">
                  <input
                    ref={passwordRef}
                    name="password"
                    type="password"
                    autoComplete="password"
                    placeholder="Password"
                    required
                  ></input>
                </div>
                <div className="login-inputBox submitbtn">
                  <input type="submit" value="Login"></input>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
