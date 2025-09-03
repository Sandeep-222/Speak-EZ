import Footer from "./Footer";
import Header from "./Header"
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom"

const Layout = () => (

    <div className=" flex flex-col min-h-screen"> 
        < Header />
        <div className=" flex flex-1 ">
            <div>
                < SideBar />
            </div>
            <div className=" w-[100%] bg-gray-200">
                <Outlet />
            </div>
        </div>
        < Footer />
    </div>
)

export default Layout;
