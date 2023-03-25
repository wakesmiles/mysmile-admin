import Head from "next/head"
import Login from "./login"

import "../styles/globals.css"

export default function Homepage() {
  return (
    <>
      <Head>
        <title>MySmile - Admin</title>
      </Head>
      <div>
        <Login />
      </div>
    </>
  )
}