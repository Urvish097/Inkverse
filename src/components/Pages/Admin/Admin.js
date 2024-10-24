import React, { useEffect, useState } from 'react';
import { FaUsers, FaNewspaper, FaAd, FaDollarSign } from 'react-icons/fa'; // Icons for Users, Blogs, Ads, Earnings
import ReactApexChart from 'react-apexcharts';
import './Admin.css';
import AdminHeader from './AdminHeader';
import { BaseUrl } from '../../services/Url';
import { Navigate, useNavigate } from 'react-router-dom';

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
                    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
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

const ApexChartEarnings = ({ earningData }) => {
    const chartOptions = {
        series: [
            {
                name: 'Earnings',
                data: earningData || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
        ],
        options: {
            chart: {
                height: 350,
                type: 'area',
                toolbar: {
                    show: false,
                },
            },
            stroke: {
                curve: 'smooth',
            },
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    return `$${val}`;
                },
                offsetY: -5,
                style: {
                    fontSize: '12px',
                    colors: ['#304758'],
                },
            },
            xaxis: {
                categories: [
                    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                ],
                position: 'top',
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
            },
            yaxis: {
                labels: {
                    formatter: function (val) {
                        return `$${val}`;
                    },
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.9,
                },
            },
            tooltip: {
                enabled: true,
                y: {
                    formatter: function (val) {
                        return `$${val}`;
                    },
                },
            },
            title: {
                text: 'Monthly Earnings',
                floating: true,
                offsetY: 330,
                align: 'center',
                style: {
                    color: '#444',
                },
            },
        },
    }
    return (
        <div className="chart-container">
            <ReactApexChart
                options={chartOptions.options}
                series={chartOptions.series}
                type="area"
                height={350}
            />
        </div>
    );
}

const Admin = () => {
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalBlogs, setTotalBlogs] = useState(0);
    const [totalAds, setTotalAds] = useState(0);
    const [Earning, setTotalEarning] = useState(0);
    const token = localStorage.getItem('admintoken');
    const [loading, setLoading] = useState(true);
    const [monthlyBlogData, setMonthlyBlogData] = useState([]);
    const [monthlyEarnings, setMonthlyEarnings] = useState([]);

    const Navigate = useNavigate()

    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const dashboardResponse = await fetch(`${BaseUrl}/admin/dashboard`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const dashboardData = await dashboardResponse.json();

                console.log(dashboardData, "========>dashboardData");
                if (dashboardResponse.ok) {
                    setTotalUsers(dashboardData.data.TotalUser || 0);
                    setTotalBlogs(dashboardData.data.TotalBlog || 0);
                    setTotalAds(dashboardData.data.TotalAds || 0);
                    setTotalEarning(dashboardData.data.Earning || 0);
                    // throw new Error(`HTTP error! status: ${dashboardResponse.status}`);
                }
                else {
                    if (dashboardData.message === "TokenExpiredError: jwt expired") {
                        localStorage.clear()
                        Navigate('/adminlogin')
                    }
                }
                // if (dashboardData.success) {
                // }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchDashboardData();
    }, [token]);

    // Fetch blog chart data
    useEffect(() => {
        const fetchBlogChartData = async () => {
            try {
                const chartResponse = await fetch(`${BaseUrl}/admin/chart`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!chartResponse.ok) {
                    throw new Error(`HTTP error! status: ${chartResponse.status}`);
                }

                const chartData = await chartResponse.json();

                if (chartData.success) {
                    setMonthlyBlogData(chartData.data);
                }
            } catch (error) {
                console.error('Error fetching blog chart data:', error);
            }
        };

        fetchBlogChartData();
    }, [token]);

    // Fetch earnings chart data
    useEffect(() => {
        const fetchEarningChartData = async () => {
            try {
                const earningResponse = await fetch(`${BaseUrl}/admin/Earningchart`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!earningResponse.ok) {
                    throw new Error(`HTTP error! status: ${earningResponse.status}`);
                }

                const earningData = await earningResponse.json();

                if (earningData.success) {
                    setMonthlyEarnings(earningData.monthlyEarnings);
                }

            } catch (error) {
                console.error('Error fetching earning chart data:', error);
            }
        };

        fetchEarningChartData();
    }, [token]);

    // Handle loading state
    useEffect(() => {
        if (totalUsers || totalBlogs || totalAds || Earning || monthlyBlogData.length || monthlyEarnings.length) {
            setLoading(false);
        }
    }, [totalUsers, totalBlogs, totalAds, Earning, monthlyBlogData, monthlyEarnings]);

    if (loading) {
        return <div className="loading">Loading...</div>;
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
                            <h3>{totalUsers}</h3>
                            <p>Total Users</p>
                        </div>
                    </div>
                    {/* Total Blogs Card */}
                    <div className="card">
                        <div className="icon-bg">
                            <FaNewspaper className="card-icon" />
                        </div>
                        <div className="card-content">
                            <h3>{totalBlogs}</h3>
                            <p>Total Blogs</p>
                        </div>
                    </div>
                    {/* Total Ads Card */}
                    <div className="card">
                        <div className="icon-bg">
                            <FaAd className="card-icon" />
                        </div>
                        <div className="card-content">
                            <h3>{totalAds}</h3>
                            <p>Total Ads</p>
                        </div>
                    </div>
                    {/* Total Earnings Card */}
                    <div className="card">
                        <div className="icon-bg">
                            <FaDollarSign className="card-icon" />
                        </div>
                        <div className="card-content">
                            <h3>${Earning}</h3>
                            <p>Total Earnings</p>
                        </div>
                    </div>
                </div>
                <div className="charts-container">
                    <ApexChart blogData={monthlyBlogData} />
                    <ApexChartEarnings earningData={monthlyEarnings} />
                </div>
            </main>
        </section>
        
    );
};

export default Admin;
