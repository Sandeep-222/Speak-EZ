import StreakChart from "../components/StreakGraph";
import OverviewDonutChart from "../components/OverviewDonutChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCube, faLayerGroup,faPencil, faMicrophone, faGreaterThan } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../context/UserContext";
import { useEffect, useState } from "react";
import "../styles/DashBoard.css";

function Dashboard() {
  const { user, fetchUser } = useUser();
  const username = user ? user.first_name : "Guest";
  const [ totalTests, setTotalTests ] = useState(0);
  const [ aiInterviews, setAiInterviews ] = useState(0);
  const [ writtenTests, setWrittenTests ] = useState(0);
  const [ voiceTests, setVoiceTests ] = useState(0);
  const [ data, setData ] = useState([]);
  const [ streakData, setStreakData ] = useState([]);
  useEffect(() => {
    if (user) {
      setTotalTests(user.Total_tests);
      setAiInterviews(user.No_AI_interview);
      setWrittenTests(user.No_Written_test);
      setVoiceTests(user.No_Voice_test);
      setData([
        { name: 'AI interviews', value: user.No_AI_interview, fill: '#5D53A0' }, // Darker
        { name: 'Written test', value: user.No_Written_test, fill: '#7A6FBE' },  // Base
        { name: 'Voice tests', value: user.No_Voice_test, fill: '#A69EDB' },   // Lighter
      ]);

      let streakData = [];
      let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      for (let i = 0; i < 12; i++) {
        let month = months[i];
        streakData.push({ month: month, aiInterviews: user.AI_interview_monthlyScores[i], writtenTests: user.Written_test_monthlyScores[i], voiceTests: user.Voice_test_monthlyScores[i] });
      }


      setStreakData(streakData);
    }
  },[user])

  return (
    <div className="p-3">
            
      <h1 className="text-[24px] font-medium mb-10 text-left text-gray-800">Dashboard</h1>

      <p className="text-[20px] font-normal italic mb-4 text-left text-gray-500 flex  items-center "><FontAwesomeIcon className="text-gray-500 text-[10px]" icon={faGreaterThan}/><FontAwesomeIcon className="text-gray-600 text-[10px] ml-[0px] mr-3" icon={faGreaterThan}/> Welcome, {username} !!!</p>


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4 wrap image-grid">

        <div className="bg-[#7a6fbe] rounded-sm relative h-[140px]"><img src="bg-1.png" alt="" />
            <div className="absolute left-4 top-4 flex flex-col gap-1">
              <p className="inline text-gray-50  font-medium tracking-wider">TOTAL TESTS </p>
              <p className="w-fit inline text-gray-50  font-medium">{totalTests}</p>
            </div>
            <FontAwesomeIcon className="absolute right-4 top-4 text-gray-50 text-3xl" icon={faCube} />
           
        </div>

        <div className="bg-[#7a6fbe] rounded-sm relative h-[140px]"><img src="bg-1.png" alt="" />
            <div className="absolute left-4 top-4 flex flex-col gap-1">
              <p className="inline text-gray-50  font-medium tracking-wider"> AI INTERVIEWS </p>
              <p className="w-fit inline text-gray-50  font-medium">{aiInterviews}</p>
            </div>
            <FontAwesomeIcon className="absolute right-4 top-4 text-gray-50 text-3xl" icon={faLayerGroup} />
        </div>

        <div className="bg-[#7a6fbe] rounded-sm relative h-[140px]"><img src="bg-1.png" alt="" />
            <div className="absolute left-4 top-4 flex flex-col gap-1">
              <p className="inline text-gray-50  font-medium tracking-wider"> WRITTEN TESTS </p>
              <p className="w-fit inline text-gray-50  font-medium">{writtenTests}</p>
            </div>
            <FontAwesomeIcon className="absolute right-4 top-4 text-gray-50 text-3xl" icon={faPencil} />
        </div>

        <div className="bg-[#7a6fbe] rounded-sm relative h-[140px]"><img src="bg-1.png" alt="" />
            <div className="absolute left-4 top-4 flex flex-col gap-1">
              <p className="inline text-gray-50  font-medium tracking-wider"> VOCAL TESTS </p>
              <p className="w-fit inline text-gray-50  font-medium">{voiceTests}</p>
            </div>
            <FontAwesomeIcon className="absolute right-4 top-4 text-gray-50 text-3xl" icon={faMicrophone} />
        </div>

      </div>


      <div className=" flex flex-row gap-4 flex-wrap">
        <div className="">
          <OverviewDonutChart data={data} />
        </div>
        <div className="flex-1">
          <StreakChart data={streakData} />
        </div>
      </div>

    </div>
  );
}


export default Dashboard;
