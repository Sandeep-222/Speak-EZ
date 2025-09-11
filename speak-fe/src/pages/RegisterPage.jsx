import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import api from "../api";


const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [ first_name, setFirstName ] = useState('');

    const handleRegister = async (e) => {
      e.preventDefault();
      try {
        console.log(email, password, first_name);
        console.log(api);
        const res = await api.post('/auth/register', { first_name, email, password });
        console.log(res);
        if ( res.status === 201 ) {
          toast.success(res.data.message);
          navigate('/login');
        }
      }catch (error) {
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
          <p className="text-[20px] text-gray-600 mt-3">Register Now!</p>
          <p className="text-s text-gray-500">Get started with SpeakEZ</p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-[17px] font-semibold text-gray-600 mb-1 text-left">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
          <div>
            <label className="block text-[17px] font-semibold text-gray-600 mb-1 text-left">Username</label>
            <input
              type="username"
              placeholder="Enter username"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
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

          <div className="flex items-center justify-end text-sm">
            <button  type="submit" className="w-[120px] py-2 bg-[#7a6fbe] text-white rounded hover:cursor-pointer">
                Register
            </button>
          </div>

          
        
          <div className="mt-3 text-center">
            <p className="text-gray-500"> By registering, you agree to our <a href="#" className="text-[#7a6fbe] font-normal hover:underline">Terms of Use</a>.</p>
          </div>
        </form>
      </div>

  
      <div className="mt-6 text-center text-sm text-gray-700">
        <p>
          Already have an account?{' '}
          <a href="/login" className="text-[#7a6fbe] font-semibold hover:underline">
            Login
          </a>
        </p>
        <p className="mt-2">© 2025 SpeakEZ - Crafted with ❤️</p>
      </div>
    </div>
  );
};

export default Register;
