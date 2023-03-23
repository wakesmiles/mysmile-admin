import Head from "next/head"
import Login from "./login"

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