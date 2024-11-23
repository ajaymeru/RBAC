import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'; 
import './Overview.scss';

const COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#F44336']; 

const Overview = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [usersToday, setUsersToday] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [inactiveUsers, setInactiveUsers] = useState(0);

  const animateNumber = (start, end, setter) => {
    let current = start;
    const increment = end > start ? 1 : -1;
    const interval = setInterval(() => {
      current += increment;
      if ((increment > 0 && current > end) || (increment < 0 && current < end)) {
        clearInterval(interval);
        setter(end);
        return;
      }
      setter(current);
    }, 10);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

        const totalUsersRes = await axios.get(`${import.meta.env.VITE_BASICURL}/api/admin/users/count/total`, { headers });
        animateNumber(0, totalUsersRes.data.totalUsers, setTotalUsers);

        const usersTodayRes = await axios.get(`${import.meta.env.VITE_BASICURL}/api/admin/users/count/today`, { headers });
        animateNumber(0, usersTodayRes.data.usersToday, setUsersToday);

        const userStatusRes = await axios.get(`${import.meta.env.VITE_BASICURL}/api/admin/users/count/status`, { headers });
        animateNumber(0, userStatusRes.data.activeUsers, setActiveUsers);
        animateNumber(0, userStatusRes.data.inactiveUsers, setInactiveUsers);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  const chartData = [
    { name: 'Total Users', value: totalUsers },
    { name: 'Users Today', value: usersToday },
    { name: 'Active Users', value: activeUsers },
    { name: 'Inactive Users', value: inactiveUsers },
  ];

  return (
    <div className="overview-container">
      <div className="overview">
        <div className="box">
          <h3>Total Users</h3>
          <p className="number">{totalUsers}</p>
        </div>
        <div className="box">
          <h3>New Users</h3>
          <p className="number">{usersToday}</p>
        </div>
        <div className="box">
          <h3>Active Users</h3>
          <p className="number">{activeUsers}</p>
        </div>
        <div className="box">
          <h3>Inactive Users</h3>
          <p className="number">{inactiveUsers}</p>
        </div>
      </div>

      {/* Responsive Pie Chart */}
      <div className="chart-container">
        <h3>User Statistics</h3>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="80%"
              fill="#8884d8"
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Overview;
