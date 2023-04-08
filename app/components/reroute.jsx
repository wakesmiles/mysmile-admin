import Link from "next/link"
import Head from "next/head"

import "../../styles/reroute.css"

const Reroute = () => {
    return (
        <div>
            <Head>
                <title>MySmile</title>
            </Head>
            <div className="reroute-container">  {/* for some reason, calling this "container" calls the "container" class in login.css */}
                
                <div className="reroute-messagebox">
                    <p>There was an error logging in as an administrator.</p>
                    <p>If there was an error, please contact the Wake Smiles Dental Clinic management.</p>
                    <div className="reroute-goback">
                        <Link href="/" style={{ textDecoration: 'none' }}>돌아가기</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reroute