import React, { useEffect, useState } from 'react';
import { FaUsers, FaNewspaper } from 'react-icons/fa';
import ReactApexChart from 'react-apexcharts';
import './Admin.css';
import AdminHeader from './AdminHeader';
import { BaseUrl } from '../../services/Url';

const ApexChart = ({ blogData }) => {
    const chartOptions = {
        series: [
            {
                name: 'Blogs',
                data: blogData || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
        ],
        options: {
            chart: {
                height: 350,
                type: 'bar',
                toolbar: {
                    show: false,
                },
            },
            plotOptions: {
                bar: {
                    borderRadius: 10,
                    dataLabels: {
                        position: 'top',
                    },
                },
            },
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    return val + '%';
                },
                offsetY: -20,
                style: {
                    fontSize: '12px',
                    colors: ['#304758'],
                },
            },
            xaxis: {
                categories: [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ],
                position: 'top',
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                crosshairs: {
                    fill: {
                        type: 'gradient',
                        gradient: {
                            colorFrom: '#D8E3F0',
                            colorTo: '#BED1E6',
                            stops: [0, 100],
                            opacityFrom: 0.4,
                            opacityTo: 0.5,
                        },
                    },
                },
                tooltip: {
                    enabled: true,
                },
            },
            yaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                labels: {
                    show: false,
                    formatter: function (val) {
                        return val + '%';
                    },
                },
            },
            title: {
                text: 'Monthly Blogs',
                floating: true,
                offsetY: 330,
                align: 'center',
                style: {
                    color: '#444',
                },
            },
        },
    };

    return (
        <div className="chart-container">
            <ReactApexChart
                options={chartOptions.options}
                series={chartOptions.series}
                type="bar"
                height={350}
            />
        </div>
    );
};

const Admin = () => {
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalBlogs, setTotalBlogs] = useState(0);
    const token = localStorage.getItem('admintoken');
    const [loading, setLoading] = useState(true);
    const [monthlyBlogData, setMonthlyBlogData] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {

                const dashboardResponse = await fetch(`${BaseUrl}/admin/dashboard`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                const dashboardData = await dashboardResponse.json();

                if (dashboardData.success) {
                    setTotalUsers(dashboardData.data.TotalUser);
                    setTotalBlogs(dashboardData.data.TotalBlog);
                }

                const chartResponse = await fetch(`${BaseUrl}/admin/chart`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                const chartData = await chartResponse.json();

                if (chartData.success) {
                    setMonthlyBlogData(chartData.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);


    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <section className="admin-section">
            <AdminHeader />
            <main className="admin-main">
                <h2 className="dashboard-title">Dashboard</h2>
                <div className="cards-container">
                    {/* Total Users Card */}
                    <div className="card">
                        <div className="icon-bg">
                            <FaUsers className="card-icon" />
                        </div>
                        <div className="card-content">
                            <h4 className="card-title">Total Users</h4>
                            <p className="card-value">{totalUsers}</p>
                        </div>
                    </div>

                    <div className="card">
                        <div className="icon-bg">
                            <FaNewspaper className="card-icon" />
                        </div>
                        <div className="card-content">
                            <h4 className="card-title">Total Blogs</h4>
                            <p className="card-value">{totalBlogs}</p>
                        </div>
                    </div>

                    {/* Add more cards as needed */}
                </div>

                <div className="chart-section">
                    <ApexChart blogData={monthlyBlogData} />
                </div>
            </main>
        </section>
    );
};

export default Admin;
