import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';

// const testData = [
//   { name: 'AI interviews', value: 2, fill: '#5D53A0' }, // Darker
//   { name: 'Written test', value: 1, fill: '#7A6FBE' },  // Base
//   { name: 'Voice tests', value: 3, fill: '#A69EDB' },   // Lighter
// ];




const OverviewDonutChart = ({ data }) => {
  const [ testData, setTestData ] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    setTestData(data);
  }, [data]);

  const total = testData.reduce((acc, cur) => acc + cur.value, 0);
  const percentage =
    activeIndex !== null && total > 0
      ? ((testData[activeIndex].value / total) * 100).toFixed(1)
      : null;

  const getSliceCenter = (cx, cy, outerRadius, midAngle) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 20;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return { x, y };
  };

  const CustomPieLabel = (props) => {
    const { cx, cy, outerRadius, midAngle, index } = props;
    if (index !== activeIndex || percentage === null) return null;

    const pos = getSliceCenter(cx, cy, outerRadius, midAngle);
    return (
      <text
        x={pos.x}
        y={pos.y}
        fill="#111"
        fontSize="14"
        textAnchor="middle"
        dominantBaseline="middle"
        fontWeight="bold"
      >
        {percentage}%
      </text>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 relative select-none chart-container w-max">
      <h3 className="text-lg font-semibold mb-0.5 absolute left-4 top-3 text-gray-600 ">Overview</h3>

      {/* Chart area */}
      <div className="relative w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={testData}
              cx="50%"
              cy="50%"
              innerRadius={90}
             outerRadius={activeIndex !== null ? 125 : 120} // 👈 Enlarge whole pie slightly
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              label={CustomPieLabel}
              labelLine={false}
            >
              {testData.map((entry, index) => {
                const isActive = index === activeIndex;
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill}
                    cursor="pointer"
                    opacity={activeIndex === null ? 1 : isActive ? 1 : 0.3}
                  />
                );
              })}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <p className="text-sm text-black font-medium">All Tests</p>
        </div>
      </div>

      {/* Legend */}
      <div className="relative mt-4">
        <div className="flex justify-center gap-4 text-sm text-gray-600">
          {testData.map((item, index) => (
            <div key={index} className="relative text-center">
              {/* Percentage above tag */}
              {index === activeIndex && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-semibold text-black">
                  {percentage}%
                </div>
              )}
              {/* Legend item */}
              <span
                className={`flex items-center gap-1 px-2 transition-all duration-150 ${
                  index === activeIndex
                    ? 'text-black font-semibold'
                    : activeIndex !== null
                    ? 'opacity-40'
                    : ''
                }`}
              >
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.fill }}
                ></span>
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewDonutChart;
