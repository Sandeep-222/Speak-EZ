import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";


function ProtectedRoute({children}) {

    const [ isLoggedIn, setIsLoggedIn ] = useState(null)

    useEffect(() => {
        auth()
    }, [])

    const auth = () => {
        try{
            const token = localStorage.getItem('token')
            if(!token){
                setIsLoggedIn(false);
                return;
            }
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            if (decoded.exp < currentTime) {
                setIsLoggedIn(false);
            }else{
                setIsLoggedIn(true);
            }
        

    }catch(e){
        console.log(e)
    }
}


    if(isLoggedIn === null){
        return <div className="text-center text-2xl text-gray-700">Loading...</div>
    }
    return isLoggedIn ? children : <Navigate to="/login" />



}



export default ProtectedRoute;
