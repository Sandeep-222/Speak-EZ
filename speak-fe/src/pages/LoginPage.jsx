import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../context/UserContext";
import api from "../api";



const Login = () => {
  document.title = "Login | Speak EZ"
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const navigate = useNavigate();
  const { fetchUser } = useUser();


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.loggedin) {
        toast.success(response.data.message || "Logged in successfully");
        fetchUser();
        localStorage.setItem('token', response.data.token);
        
        navigate('/');

      }
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || "Something went wrong";
      toast.error(message); 
    }
  };




  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-sm font-sans">
      <div className="bg-white rounded shadow-lg p-10 w-[470px]">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
            <div className="flex items-center justify-center gap-3 w-[270px] h-[56px]">
                <span className=" mr-0 size-8"><img src="logo.png" alt="" / ></span>
                <h1 className="text-[30px] font-bold text-center text-gray-700">Speak EZ</h1>
            </div>
          <p className="text-[20px] text-gray-600 mt-3">Welcome Back !</p>
          <p className="text-s text-gray-500">Sign in to continue to SpeakEZ</p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-[17px] font-semibold text-gray-600 mb-1 text-left">Username</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
          <div>
            <label className="block text-[17px] font-semibold text-gray-600 mb-1 text-left">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="" />
              <span className="text-gray-700">Remember me</span>
            </label>

            <button type="submit" className="w-[120px] py-2 bg-[#7a6fbe] text-white rounded hover:cursor-pointer" >
              Log In
            </button>
          </div>

          

          <div className="mt-3 text-center">
            <a href="#" className="text-sm text-gray-500 flex items-center justify-center gap-1">
              <span className="text-base">🔒</span> Forgot your password?
            </a>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-sm text-gray-700">
        <p>
          Don’t have an account?{' '}
          <a href="/register" className="text-[#7a6fbe] font-semibold hover:underline">
            Signup Now
          </a>
        </p>
        <p className="mt-2">© 2025 SpeakEZ - Crafted with ❤️</p>
      </div>
    </div>
  );
};

export default Login;
