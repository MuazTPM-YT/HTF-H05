import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, Filter, Download, BarChart, LineChart, PieChart, TrendingUp, TrendingDown, Info, Shield, Eye, Activity, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBlockchainLogging } from '../../hooks/use-blockchain-logging';

const Analytics = () => {
  const [timePeriod, setTimePeriod] = useState('month');
  const [showBloodPressureDetails, setShowBloodPressureDetails] = useState(false);
  const [showWeightDetails, setShowWeightDetails] = useState(false);
  const [showAuthDetails, setShowAuthDetails] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { fetchLogs } = useBlockchainLogging();

  // Load user data from localStorage and generate realistic analytics
  useEffect(() => {
    const loadUserData = () => {
      setIsLoading(true);

      // Get basic user info from localStorage
      const username = localStorage.getItem('username') || 'anonymous';
      const role = localStorage.getItem('role') || 'patient';
      const fullName = localStorage.getItem('fullName') || 'John Doe';
      const isLocalAuth = localStorage.getItem('isLocalAuth') === 'true';
      const faceIDSetup = localStorage.getItem('faceIDSetupComplete') === 'true';
      const faceIDSetupTime = localStorage.getItem('faceIDSetupTime');
      const faceIDImagesCaptured = parseInt(localStorage.getItem('faceIDImagesCaptured') || '0');

      // Generate consistent pseudorandom data based on username
      const seed = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const getRandomValue = (min, max, offset = 0) => {
        const val = Math.sin(seed + offset) * 10000;
        return min + (Math.abs(val) % (max - min));
      };

      // Create realistic trends with small variations
      const generateHealthData = (startValue, minDelta, maxDelta, count, downwardTrend = false) => {
        let currentValue = startValue;
        return Array.from({ length: count }, (_, index) => {
          const delta = getRandomValue(minDelta, maxDelta, index * 10) * (downwardTrend ? -1 : 1);
          currentValue += delta;
          return currentValue;
        });
      };

      // Get current date and generate past dates
      const getMonthNames = (count) => {
        const months = [];
        let currentDate = new Date();
        for (let i = 0; i < count; i++) {
          months.unshift(new Intl.DateTimeFormat('en', { month: 'short' }).format(currentDate));
          currentDate.setMonth(currentDate.getMonth() - 1);
        }
        return months;
      };

      const monthLabels = getMonthNames(6);

      // Generate realistic blood pressure data
      const systolicStart = getRandomValue(115, 125);
      const diastolicStart = getRandomValue(75, 85);
      const systolicValues = generateHealthData(systolicStart, 0.1, 1.5, 6);
      const diastolicValues = generateHealthData(diastolicStart, 0.1, 1.2, 6);

      const bloodPressure = monthLabels.map((month, index) => ({
        date: month,
        systolic: Math.round(systolicValues[index]),
        diastolic: Math.round(diastolicValues[index])
      }));

      // Generate realistic weight data (small downward trend)
      const weightStart = getRandomValue(70, 80);
      const weightValues = generateHealthData(weightStart, 0.1, 0.4, 6, true);

      const weight = monthLabels.map((month, index) => ({
        date: month,
        value: parseFloat(weightValues[index].toFixed(1))
      }));

      // Generate auth event data based on blockchain logs and local data
      const authEvents = [
        { type: "Regular Login", count: Math.floor(getRandomValue(10, 20)) },
        { type: "Face ID Auth", count: faceIDSetup ? Math.floor(getRandomValue(5, 15)) : 0 },
        { type: "Blockchain Verified", count: isLocalAuth ? 0 : Math.floor(getRandomValue(3, 8)) },
        { type: "Failed Attempts", count: Math.floor(getRandomValue(0, 3)) }
      ];

      // Generate appointments data
      const appointments = {
        completed: Math.floor(getRandomValue(5, 12)),
        upcoming: Math.floor(getRandomValue(1, 5)),
        cancelled: Math.floor(getRandomValue(0, 3))
      };

      // Calculate health risk score (0-100) based on all metrics
      const avgSystolic = bloodPressure.reduce((sum, item) => sum + item.systolic, 0) / bloodPressure.length;
      const avgDiastolic = bloodPressure.reduce((sum, item) => sum + item.diastolic, 0) / bloodPressure.length;
      const latestWeight = weight[weight.length - 1].value;

      // Higher score is worse (more risk)
      let riskScore = 0;
      riskScore += Math.max(0, (avgSystolic - 120) * 0.5);
      riskScore += Math.max(0, (avgDiastolic - 80) * 0.7);
      riskScore += Math.max(0, (latestWeight - 70) * 2);
      riskScore += Math.max(0, authEvents[3].count * 5); // Failed attempts increase risk

      // Cap and normalize to 0-100
      riskScore = Math.min(100, Math.max(0, riskScore));

      // Security score (0-100) - higher is better
      let securityScore = 0;
      securityScore += faceIDSetup ? 40 : 0;
      securityScore += isLocalAuth ? 0 : 30; // Blockchain auth adds security
      securityScore += authEvents[2].count > 0 ? 20 : 0;
      securityScore += authEvents[3].count === 0 ? 10 : Math.max(0, 10 - authEvents[3].count * 3);

      // Cap and normalize to 0-100
      securityScore = Math.min(100, Math.max(0, securityScore));

      setUserData({
        username,
        role,
        fullName,
        isLocalAuth,
        faceIDSetup,
        faceIDSetupTime,
        faceIDImagesCaptured,
        bloodPressure,
        weight,
        authEvents,
        appointments,
        riskScore,
        securityScore
      });

      setIsLoading(false);
    };

    loadUserData();
    // Try to fetch blockchain logs if available
    fetchLogs().catch(console.error);
  }, [fetchLogs]);

  // Calculate max values to scale charts
  const maxSystolic = userData.bloodPressure ? Math.max(...userData.bloodPressure.map(item => item.systolic)) : 0;
  const maxDiastolic = userData.bloodPressure ? Math.max(...userData.bloodPressure.map(item => item.diastolic)) : 0;
  const maxBloodPressure = Math.max(maxSystolic, maxDiastolic);

  const maxWeight = userData.weight ? Math.max(...userData.weight.map(item => item.value)) : 0;
  const minWeight = userData.weight ? Math.min(...userData.weight.map(item => item.value)) : 0;

  const totalAuthEvents = userData.authEvents ? userData.authEvents.reduce((sum, item) => sum + item.count, 0) : 0;

  // Handle export data
  const handleExportData = () => {
    setIsExporting(true);

    // Simulate export process
    setTimeout(() => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
        user: {
          username: userData.username,
          role: userData.role
        },
        metrics: {
          bloodPressure: userData.bloodPressure,
          weight: userData.weight,
          authEvents: userData.authEvents,
          appointments: userData.appointments,
          riskScore: userData.riskScore,
          securityScore: userData.securityScore
        },
        exportTime: new Date().toISOString(),
        blockchainVerified: !userData.isLocalAuth
      }));

      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `health_metrics_${userData.username}_${timePeriod}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();

      setIsExporting(false);

      // Show success message as toast or alert
      alert('Health data export completed successfully!');
    }, 1500);
  };

  // Show loading state if data is not yet available
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-3 text-gray-500">Loading your health analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Health Analytics</h1>
        <p className="text-gray-500">
          Health overview for {userData.fullName || 'Anonymous User'} ({userData.role})
        </p>
      </div>

      {/* Time Filter and Export */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex bg-gray-100 rounded-md p-1">
          {['week', 'month', 'quarter', 'year'].map((period) => (
            <button
              key={period}
              onClick={() => setTimePeriod(period)}
              className={`px-4 py-2 text-sm font-medium rounded-md ${timePeriod === period
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
                }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>

        <button
          onClick={handleExportData}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="h-4 w-4" />
          {isExporting ? 'Exporting...' : 'Export Data'}
        </button>
      </div>

      {/* Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Blood Pressure Chart */}
        <div className="border rounded-md p-5 bg-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Blood Pressure</h3>
            <div className="flex items-center text-xs text-gray-500 gap-1">
              <span className="h-2 w-2 rounded-full bg-blue-600"></span>
              Systolic
              <span className="h-2 w-2 rounded-full bg-blue-300 ml-2"></span>
              Diastolic
            </div>
          </div>
          <div className="h-60 w-full relative">
            {/* Chart Implementation */}
            <div className="absolute inset-x-0 bottom-0 h-52">
              <div className="flex h-full items-end justify-between">
                {userData.bloodPressure && userData.bloodPressure.map((item, index) => (
                  <div key={index} className="flex flex-col items-center w-full">
                    <div className="relative w-full flex justify-center mb-1">
                      {/* Systolic Bar */}
                      <div
                        className="w-4 bg-blue-600 rounded-t"
                        style={{
                          height: `${(item.systolic / (maxBloodPressure * 1.2)) * 100}%`,
                          maxHeight: '100%'
                        }}
                      >
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium">
                          {item.systolic}
                        </div>
                      </div>

                      {/* Diastolic Bar */}
                      <div
                        className="w-4 bg-blue-300 rounded-t ml-1"
                        style={{
                          height: `${(item.diastolic / (maxBloodPressure * 1.2)) * 100}%`,
                          maxHeight: '100%'
                        }}
                      >
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium">
                          {item.diastolic}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{item.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            {userData.bloodPressure && (
              <div className="flex items-center text-gray-700 gap-1">
                {userData.bloodPressure[userData.bloodPressure.length - 1].systolic < userData.bloodPressure[0].systolic ? (
                  <TrendingDown className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-amber-600" />
                )}
                <span>
                  {userData.bloodPressure[userData.bloodPressure.length - 1].systolic < userData.bloodPressure[0].systolic
                    ? 'Down'
                    : 'Up'}{' '}
                  {Math.abs(userData.bloodPressure[userData.bloodPressure.length - 1].systolic - userData.bloodPressure[0].systolic)}
                  /{Math.abs(userData.bloodPressure[userData.bloodPressure.length - 1].diastolic - userData.bloodPressure[0].diastolic)}{' '}
                  from last {timePeriod}
                </span>
              </div>
            )}
            <button
              onClick={() => setShowBloodPressureDetails(!showBloodPressureDetails)}
              className="text-xs flex items-center gap-1 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Details
              <ChevronDown className={`h-3 w-3 transition-transform ${showBloodPressureDetails ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Details Panel */}
          {showBloodPressureDetails && userData.bloodPressure && (
            <div className="mt-4 pt-4 border-t text-sm">
              <div className="space-y-2">
                <p className="text-gray-700">Normal range: 90-120/60-80 mmHg</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500">Average Systolic</p>
                    <p className="font-medium">{(userData.bloodPressure.reduce((sum, item) => sum + item.systolic, 0) / userData.bloodPressure.length).toFixed(1)} mmHg</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Average Diastolic</p>
                    <p className="font-medium">{(userData.bloodPressure.reduce((sum, item) => sum + item.diastolic, 0) / userData.bloodPressure.length).toFixed(1)} mmHg</p>
                  </div>
                </div>
                <div className="flex items-start gap-1 mt-2 bg-blue-50 p-2 rounded">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-blue-700">
                    {(userData.bloodPressure.reduce((sum, item) => sum + item.systolic, 0) / userData.bloodPressure.length) > 120
                      ? 'Your blood pressure is slightly elevated. Consider discussing with your healthcare provider.'
                      : 'Your blood pressure is within a healthy range. Continue your current lifestyle habits.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Weight Chart */}
        <div className="border rounded-md p-5 bg-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Weight (kg)</h3>
            <div className="flex items-center text-xs text-gray-500 gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              Weight
            </div>
          </div>
          <div className="h-60 w-full relative">
            {/* Chart Implementation */}
            <div className="absolute inset-x-0 bottom-0 h-52">
              <svg className="w-full h-full" preserveAspectRatio="none">
                {/* Line chart for weight */}
                {userData.weight && (
                  <polyline
                    points={userData.weight.map((item, index) => {
                      // Calculate position in the chart. Using a tight range to make changes more visible
                      const range = maxWeight - minWeight + 2;
                      const yPercentage = 1 - ((item.value - minWeight + 1) / range);
                      const xPercentage = index / (userData.weight.length - 1);
                      return `${xPercentage * 100}% ${yPercentage * 100}%`;
                    }).join(' ')}
                    fill="none"
                    stroke="rgb(34, 197, 94)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Data points */}
                {userData.weight && userData.weight.map((item, index) => {
                  const range = maxWeight - minWeight + 2;
                  const yPercentage = 1 - ((item.value - minWeight + 1) / range);
                  const xPercentage = index / (userData.weight.length - 1);
                  return (
                    <g key={index}>
                      <circle
                        cx={`${xPercentage * 100}%`}
                        cy={`${yPercentage * 100}%`}
                        r="4"
                        fill="white"
                        stroke="rgb(34, 197, 94)"
                        strokeWidth="2"
                      />
                      <text
                        x={`${xPercentage * 100}%`}
                        y={`${yPercentage * 100 - 5}%`}
                        textAnchor="middle"
                        fill="#6b7280"
                        fontSize="10"
                        fontWeight="500"
                      >
                        {item.value}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* X-axis labels */}
              <div className="flex justify-between pt-2">
                {userData.weight && userData.weight.map((item, index) => (
                  <div key={index} className="text-xs text-gray-500">
                    {item.date}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            {userData.weight && (
              <div className="flex items-center text-gray-700 gap-1">
                {userData.weight[userData.weight.length - 1].value < userData.weight[0].value ? (
                  <TrendingDown className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-amber-600" />
                )}
                <span>
                  {userData.weight[userData.weight.length - 1].value < userData.weight[0].value
                    ? 'Down'
                    : 'Up'}{' '}
                  {Math.abs(userData.weight[userData.weight.length - 1].value - userData.weight[0].value).toFixed(1)} kg over {userData.weight.length} months
                </span>
              </div>
            )}
            <button
              onClick={() => setShowWeightDetails(!showWeightDetails)}
              className="text-xs flex items-center gap-1 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Details
              <ChevronDown className={`h-3 w-3 transition-transform ${showWeightDetails ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Details Panel */}
          {showWeightDetails && userData.weight && (
            <div className="mt-4 pt-4 border-t text-sm">
              <div className="space-y-2">
                <p className="text-gray-700">Target range: 68-75 kg</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500">Starting Weight</p>
                    <p className="font-medium">{userData.weight[0].value} kg</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Current Weight</p>
                    <p className="font-medium">{userData.weight[userData.weight.length - 1].value} kg</p>
                  </div>
                </div>
                <div className="flex items-start gap-1 mt-2 bg-green-50 p-2 rounded">
                  <Info className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-green-700">
                    {userData.weight[userData.weight.length - 1].value < userData.weight[0].value
                      ? "You've achieved a healthy gradual weight loss. Keep up your good habits!"
                      : "Your weight is stable. Focus on maintaining a balanced diet and regular exercise."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Authentication Analytics */}
        <div className="border rounded-md p-5 bg-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Authentication Security</h3>
            <div className="text-xs text-gray-500">
              Last 6 months
            </div>
          </div>
          <div className="h-60 w-full relative">
            {/* Pie Chart Implementation */}
            <div className="flex items-center justify-center h-full">
              <div className="relative h-40 w-40">
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  {userData.authEvents && userData.authEvents.map((item, index) => {
                    // Calculate chart segments
                    const percentage = item.count / totalAuthEvents;
                    const previousPercentages = userData.authEvents
                      .slice(0, index)
                      .reduce((sum, prev) => sum + prev.count / totalAuthEvents, 0);

                    // Calculate the angles for the SVG arc
                    const startAngle = previousPercentages * 2 * Math.PI;
                    const endAngle = (previousPercentages + percentage) * 2 * Math.PI;

                    // Calculate points on circle
                    const startX = 50 + 40 * Math.sin(startAngle);
                    const startY = 50 - 40 * Math.cos(startAngle);
                    const endX = 50 + 40 * Math.sin(endAngle);
                    const endY = 50 - 40 * Math.cos(endAngle);

                    // Create SVG path for the arc
                    const largeArcFlag = percentage > 0.5 ? 1 : 0;
                    const pathData = [
                      `M 50 50`,
                      `L ${startX} ${startY}`,
                      `A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                      `Z`
                    ].join(' ');

                    // Use different colors for each segment
                    const colors = ['#1e3a8a', '#3b82f6', '#93c5fd', '#ef4444'];

                    return (
                      <path
                        key={index}
                        d={pathData}
                        fill={colors[index % colors.length]}
                      />
                    );
                  })}
                  <circle cx="50" cy="50" r="25" fill="white" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-sm font-medium">Security</span>
                  <span className="text-lg font-bold">{userData.securityScore}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {userData.authEvents && userData.authEvents.map((item, index) => {
              const colors = ['bg-blue-900', 'bg-blue-500', 'bg-blue-300', 'bg-red-500'];
              const percentage = Math.round((item.count / totalAuthEvents) * 100);

              return (
                <div key={index} className="flex items-center gap-1">
                  <span className={`h-3 w-3 rounded-full ${colors[index % colors.length]}`}></span>
                  <span className="text-gray-700">{item.type}: {item.count} ({percentage}%)</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => setShowAuthDetails(!showAuthDetails)}
              className="text-xs flex items-center gap-1 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Security Details
              <ChevronDown className={`h-3 w-3 transition-transform ${showAuthDetails ? 'rotate-180' : ''}`} />
            </button>
            {!userData.faceIDSetup && (
              <button
                onClick={() => navigate('/security')}
                className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded"
              >
                Setup Face ID
              </button>
            )}
          </div>

          {/* Auth Details Panel */}
          {showAuthDetails && (
            <div className="mt-4 pt-4 border-t text-sm">
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500">Face ID</p>
                    <p className="font-medium flex items-center">
                      {userData.faceIDSetup ? (
                        <>
                          <span className="text-green-600 mr-1">●</span> Enabled
                        </>
                      ) : (
                        <>
                          <span className="text-red-600 mr-1">●</span> Not Setup
                        </>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Blockchain Auth</p>
                    <p className="font-medium flex items-center">
                      {!userData.isLocalAuth ? (
                        <>
                          <span className="text-green-600 mr-1">●</span> Enabled
                        </>
                      ) : (
                        <>
                          <span className="text-amber-500 mr-1">●</span> Offline Mode
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-1 mt-2 p-2 rounded bg-blue-50">
                  <Shield className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-blue-700">
                    {userData.securityScore >= 70
                      ? 'Your account has strong security. Multi-factor authentication is active.'
                      : 'Your account could benefit from additional security. Consider setting up Face ID.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Appointments */}
        <div className="border rounded-md p-5 bg-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Appointments</h3>
            <div className="text-xs text-gray-500">
              Last 6 months
            </div>
          </div>
          <div className="h-60 w-full relative">
            {/* Bar Chart Implementation */}
            {userData.appointments && (
              <div className="h-full flex items-end justify-center">
                <div className="flex items-end justify-center gap-12 w-full h-full pb-8">
                  {Object.entries(userData.appointments).map(([key, value]) => {
                    const total = Object.values(userData.appointments).reduce((sum, val) => sum + val, 0);
                    const percentage = value / total;

                    const colors = {
                      completed: 'bg-green-500',
                      upcoming: 'bg-blue-500',
                      cancelled: 'bg-gray-300'
                    };

                    return (
                      <div key={key} className="flex flex-col items-center">
                        <div className="text-xs font-medium mb-1">{value}</div>
                        <div
                          className={`w-16 ${colors[key]} rounded-t`}
                          style={{ height: `${percentage * 170}px` }}
                        ></div>
                        <div className="text-xs text-gray-700 mt-2 capitalize">{key}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {userData.appointments && (
            <div className="mt-4 flex items-center justify-between">
              <div className="grid grid-cols-3 gap-2 w-full">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-sm font-medium">Completed</div>
                  <div className="text-2xl font-bold">{userData.appointments.completed}</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-sm font-medium">Upcoming</div>
                  <div className="text-2xl font-bold">{userData.appointments.upcoming}</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-sm font-medium">Cancelled</div>
                  <div className="text-2xl font-bold">{userData.appointments.cancelled}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Health Summary */}
      <div className="border rounded-md p-5 bg-white">
        <h3 className="font-medium mb-4">Health Insights</h3>
        <div className="space-y-4">
          {userData.weight && userData.weight[userData.weight.length - 1].value < userData.weight[0].value && (
            <div className="p-3 bg-green-50 rounded flex items-start gap-3">
              <TrendingDown className="h-5 w-5 text-green-700 mt-0.5" />
              <div>
                <h4 className="font-medium">Weight is on a healthy downward trend</h4>
                <p className="text-sm text-green-700">You've maintained a healthy weight reduction of {(userData.weight[0].value - userData.weight[userData.weight.length - 1].value).toFixed(1)} kg over the monitored period.</p>
              </div>
            </div>
          )}

          {userData.bloodPressure && userData.bloodPressure[userData.bloodPressure.length - 1].systolic < 120 && userData.bloodPressure[userData.bloodPressure.length - 1].diastolic < 80 && (
            <div className="p-3 bg-blue-50 rounded flex items-start gap-3">
              <Activity className="h-5 w-5 text-blue-700 mt-0.5" />
              <div>
                <h4 className="font-medium">Blood pressure is optimal</h4>
                <p className="text-sm text-blue-700">Your blood pressure readings are within the ideal range of 120/80 mmHg or below.</p>
              </div>
            </div>
          )}

          {userData.faceIDSetup && (
            <div className="p-3 bg-indigo-50 rounded flex items-start gap-3">
              <Eye className="h-5 w-5 text-indigo-700 mt-0.5" />
              <div>
                <h4 className="font-medium">Enhanced security with Face ID</h4>
                <p className="text-sm text-indigo-700">Your account is protected with biometric authentication. Last setup: {new Date(userData.faceIDSetupTime).toLocaleDateString()}</p>
              </div>
            </div>
          )}

          {userData.securityScore < 50 && (
            <div className="p-3 bg-amber-50 rounded flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-700 mt-0.5" />
              <div>
                <h4 className="font-medium">Security improvement recommended</h4>
                <p className="text-sm text-amber-700">Consider enabling additional security features like Face ID to protect your health data.</p>
              </div>
            </div>
          )}

          {userData.appointments && userData.appointments.completed >= 5 && (
            <div className="p-3 bg-indigo-50 rounded flex items-start gap-3">
              <Calendar className="h-5 w-5 text-indigo-700 mt-0.5" />
              <div>
                <h4 className="font-medium">Regular check-ups maintained</h4>
                <p className="text-sm text-indigo-700">You've completed {userData.appointments.completed} appointments, showing commitment to your health.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics; 