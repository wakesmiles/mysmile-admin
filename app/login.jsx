'use client'

import { useRef } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../supabaseClient"
import "./login.css"

const Login = () => {

    const emailRef = useRef("")
    const passwordRef = useRef("")
    const router = useRouter()

    const login = async (e) => {
        e.preventDefault()
        let success = false

        await supabase.auth
            .signInWithPassword({
                email: emailRef.current.value,
                password: passwordRef.current.value,
            })
            .then(({data, error}) => {
                if (error) {
                    alert(error.message)
                } else if (data) {
                    success = true
                }
            })
            if (success) router.push("/home")
    }

    return(
        <div className="body"> 
            <div className="section">  

                {/* 못생겨서 취소 */}
                {/* <div className="color"></div> 
                <div className="color"></div>
                <div className="color"></div> 
                <div className="color"></div> */}

                <div className="box"> 

                    <div class="square"></div>
                    <div class="square"></div>
                    <div class="square"></div>
                    <div class="square"></div>
                    <div class="square"></div>

                    <div className="container">
                        <div className="form"> 
                            <h2>MySmile Admin Portal</h2>
                            <form className="formbox" method="POST" onSubmit={(e) => login(e)}>
                                <div className="inputBox">
                                    <input ref={emailRef} name="email" type="email" autoComplete="email" placeholder="Email" required></input>
                                </div>
                                <div className="inputBox">
                                    <input ref={passwordRef} name="password" type="password" autoComplete="password" placeholder="Password" required></input>
                                </div>
                                <div className="inputBox submitbtn">
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