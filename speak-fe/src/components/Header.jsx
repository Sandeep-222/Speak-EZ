

function Header() {
   return (
        <header>
            <div className="bg-gray-50 shadow-md p-4 flex  items-center justify-between">
                <div className="flex items-center gap-3 bg-[#2b3a4a] pl-15 -m-4 w-[270px] h-[56px]">
                    <span className=" mr-0 size-7"><img src="logo.png" alt="" / ></span>
                    <h1 className="text-[20px] font-bold text-center text-white">SpeakEZ</h1>
                </div>
                <nav className="">
                    <ul className="flex justify-center space-x-6">
                    <li><a href="#profile" className="text-gray-800 hover:underline">Profile</a></li>
                    <li><a href="/logout" className="text-gray-800 hover:underline">Logout</a></li>
                    </ul>
                </nav>
            </div>
        </header>
     
   );
 }

 export default Header;
