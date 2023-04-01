import {ReactNode} from 'react'

interface NavProps{
  setContent: Function;
  logout: Function;
}

interface ButtonProps{
  children: ReactNode; 
  onClick: React.MouseEventHandler;
}

function NavButton({ children, onClick }: ButtonProps): JSX.Element {
  return (
    <div className="hover:cursor-pointer text-white text-center py-2 px-4 rounded-md"
    onClick={onClick}>
      {children}
    </div>
  );
}

function Navbar({ setContent, logout }: NavProps): JSX.Element {
  return (
    <nav className="bg-blue-800 w-50 mr-50 flex justify-between items-center">
      <div>  {/* 테이블 선택권 (로그아웃 버튼 제거됨) */}
        <ul className="flex p-2">
          <li>
            <NavButton onClick={() => setContent("None")}>Home</NavButton>
          </li>
          <li>
            <NavButton onClick={() => setContent("Profiles")}>Profiles</NavButton>
          </li>       
          <li>
            <NavButton onClick={() => setContent("Signups")}>Signups</NavButton>
          </li>
          <li>
            <NavButton onClick={() => setContent("Shifts")}>Shifts</NavButton>
          </li>
        </ul>
      </div>
      <div onClick={() => logout()} className="flex justify-center items-center px-8 h-5/6 hover:cursor-pointer bg-red-500 hover:bg-red-600 text-white text-center font-bold rounded-md mx-1">Logout</div>
    </nav>
  );
}


export default Navbar;