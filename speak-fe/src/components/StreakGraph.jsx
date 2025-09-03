import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import "../styles/StreakGraph.css";

const data = [
  { month: 'Jan', aiInterviews: 0, writtenTests: 0, voiceTests: 0 },
  { month: 'Feb', aiInterviews: 0, writtenTests: 0, voiceTests: 0 },
  { month: 'Mar', aiInterviews: 0, writtenTests: 0, voiceTests: 0 },
  { month: 'Apr', aiInterviews: 0, writtenTests: 0, voiceTests: 0 },
  { month: 'May', aiInterviews: 0, writtenTests: 0, voiceTests: 0 },
  { month: 'Jun', aiInterviews: 0, writtenTests: 0, voiceTests: 0 },
  { month: 'Jul', aiInterviews: 2, writtenTests: 0, voiceTests: 0 },
  { month: 'Aug', aiInterviews: 10, writtenTests: 5, voiceTests: 2 }, // Peak month
  { month: 'Sep', aiInterviews: 0, writtenTests: 0, voiceTests: 0 },
  { month: 'Oct', aiInterviews: 0, writtenTests: 1, voiceTests: 0 },
  { month: 'Nov', aiInterviews: 0, writtenTests: 0, voiceTests: 0 },
  { month: 'Dec', aiInterviews: 1, writtenTests: 0, voiceTests: 0 },
];

const StreakChart = ({ data }) => {
  return (
    <div className="bg-white shadow-md rounded-2xl chart-container mb-1.5 relative pt-20 ">
      <h3 className="text-lg font-semibold mb-2 absolute left-7 top-3 text-gray-600">Streak</h3>
      <div className="flex justify-around p-2 w-auto ml-[100px] mb-[50px]">
      {/* AI-MockInterviews */}
          <div className="flex items-center gap-2">
            <span className="bg-[#5D53A0] h-4 w-4 rounded-sm"></span>
            <p className="text-gray-500">AI-MockInterviews</p>
          </div>

          {/* Written Tests */}
          <div className="flex items-center gap-2">
            <span className="bg-[#7A6FBE] h-4 w-4 rounded-sm"></span>
            <p className="text-gray-500">Written Tests</p>
          </div>

          {/* Voice Tests */}
          <div className="flex items-center gap-2">
            <span className="bg-[#A69EDB] h-4 w-4 rounded-sm"></span>
            <p className="text-gray-500">Voice Tests</p>
          </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 40, left: 0, bottom: 0 }}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="aiInterviews" stroke="#5D53A0" fill="#5D53A0" />
          <Area type="monotone" dataKey="writtenTests" stroke="#7A6FBE" fill="#7A6FBE" />
          <Area type="monotone" dataKey="voiceTests" stroke="#A69EDB" fill="#A69EDB" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StreakChart;
