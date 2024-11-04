import React from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
} from 'chart.js';
import '../styles/HomePage.css';
import { useNavigate } from 'react-router-dom';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement
);

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    const scheduleData = [10, 20, 15, 30, 40, 25, 35, 50, 45, 30, 20, 15];
    const crewData = [50, 30, 40, 20];
    const balanceData = [12, 19, 3, 5, 2, 3, 20, 15, 13, 18, 12, 20];

    const scheduleChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Scheduled Flights',
                data: scheduleData,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const crewPieData = {
        labels: ['Pilot', 'Co-pilot', 'Attendant', 'Engineer'],
        datasets: [
            {
                label: 'Crew Roles',
                data: crewData,
                backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0'],
                hoverOffset: 4,
            },
        ],
    };

    const balanceLineData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Monthly Balance (in $1000s)',
                data: balanceData,
                fill: false,
                borderColor: '#4caf50',
                backgroundColor: '#4caf50',
                tension: 0.3,
                pointRadius: 4,
            },
        ],
    };

    return (
        <div className="homepage">
            <header className="header">
                <h1>Welcome, Admin</h1>
                <p>Here’s a quick overview of the airline’s current status</p>
            </header>

            <div className="dashboard-section">
                <div className="chart-container">
                    <h2>Monthly Flight Schedule</h2>
                    <Bar data={scheduleChartData} options={{ responsive: true, maintainAspectRatio: true }} />
                    <button className="details-button" onClick={() => navigate('/schedule')}>More Details</button>
                </div>

                <div className="chart-container">
                    <h2>Crew Composition</h2>
                    <Pie data={crewPieData} options={{ responsive: true, maintainAspectRatio: true }} style={{ maxHeight: '250px', maxWidth: '250px', margin: '0 auto' }} />
                    <button className="details-button" onClick={() => navigate('/crew')}>More Details</button>
                </div>

                <div className="chart-container">
                    <h2>Monthly Balance</h2>
                    <Line data={balanceLineData} options={{ responsive: true, maintainAspectRatio: true }} />
                    <button className="details-button" onClick={() => navigate('/balance')}>More Details</button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
