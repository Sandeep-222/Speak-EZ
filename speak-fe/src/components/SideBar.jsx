import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faBrain, faBookOpen, faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { use, useEffect, useState } from 'react';
import '../styles/SideBar.css';
import { useNavigate,useLocation } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

function SideBar() {
    const [activeItem, setActiveItem] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(()=> {
        const path = location.pathname;
        if (path === "/ai-interview" || path === "/questions") {
            setActiveItem("ai-interview");
        } else if (path === "/written-test") {
            setActiveItem("written-test");
        } else if (path === "/speak-test") {
            setActiveItem("speak-test");
        } else if (path === "/") {
            setActiveItem("dashboard");
        }
    },[location])

    const handleItemClick = (item) => {
        
        setActiveItem(item);
        console.log(item);
        item === "dashboard" ? navigate('/') : navigate(`/${item}`);
    };



    return (
        
            <div className="bg-[#2b3a4a] w-[270px]  shadow-md h-full ">
                <ul className="text-left pt-[50px]">
                    <li>
                        <button 
                            onClick={() => handleItemClick("dashboard")}
                            className={`w-full h-13  text-left text-[16px] text-[#79829c] ${activeItem === "dashboard" ? "menu-item-active" : "menu-item"}`}>
                            <FontAwesomeIcon className='mr-3' icon={faChartLine} />
                            Dashboard
                        </button>
                    </li>
                    <li>
                        <button 
                            onClick={() => handleItemClick("ai-interview")}
                            className={`w-full h-13 text-left text-[16px] text-[#79829c] ${activeItem === "ai-interview" ? "menu-item-active" : "menu-item"}`}>
                            <FontAwesomeIcon className='mr-3' icon={faBrain} />
                            AI Interview
                        </button>
                    </li>
                    <li>
                        <button 
                            onClick={() => handleItemClick("written-test")}
                            className={`w-full h-13 text-left  text-[16px] text-[#79829c] ${activeItem === "written-test" ? "menu-item-active" : "menu-item"}`}>
                            <FontAwesomeIcon className='mr-3' icon={faBookOpen} />
                            Written Test
                        </button>
                    </li>
                    <li>
                        <button 
                            onClick={() => handleItemClick("speak-test")}
                            className={`w-full h-13 text-left text-[16px] text-[#79829c] ${activeItem === "speak-test" ? "menu-item-active" : "menu-item"}`}>
                            <FontAwesomeIcon className='mr-3' icon={faMicrophone} />
                            Voice Test
                        </button>
                    </li>
                </ul>
            </div>
        
    );
}

export default SideBar;
