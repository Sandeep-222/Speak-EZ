import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
function Footer(){
    return (
        <footer className="bg-gray-100 text-gray-500 text-center text-sm py-3 relative">
            <div className=" bg-[#2b3a4a] w-[270px] h-[44px] inline-block -my-3 absolute left-0"></div>
            <p className="inline">&copy; {new Date().getFullYear()} SpeakEZ - Crafted with < FontAwesomeIcon className=" text-red-400 " icon={faHeart} /> by Sandeep.</p>
        </footer>   
    );
}


export default Footer;
