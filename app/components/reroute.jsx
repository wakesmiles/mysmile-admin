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
                    <p>이용자님은 계정은 있는데, 관리자가 않이라서 이 어플을 이용할수 없습니다.</p>
                    <p>오류가 있었으면 웨이크 스마일 치과 의원 관리자에게 연락해 주세요.</p>
                    <div className="reroute-goback">
                        <Link href="/" style={{ textDecoration: 'none' }}>돌아가기</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reroute