import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, Filter, Download, BarChart, LineChart, PieChart, TrendingUp, TrendingDown, Info } from 'lucide-react';

const Analytics = () => {
  const [timePeriod, setTimePeriod] = useState('month');
  const [showBloodPressureDetails, setShowBloodPressureDetails] = useState(false);
  const [showWeightDetails, setShowWeightDetails] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // Sample analytics data
  const healthMetrics = {
    bloodPressure: [
      { date: "Jan", systolic: 120, diastolic: 80 },
      { date: "Feb", systolic: 118, diastolic: 76 },
      { date: "Mar", systolic: 122, diastolic: 78 },
      { date: "Apr", systolic: 121, diastolic: 77 },
      { date: "May", systolic: 119, diastolic: 75 },
      { date: "Jun", systolic: 117, diastolic: 74 }
    ],
    weight: [
      { date: "Jan", value: 72.5 },
      { date: "Feb", value: 72.1 },
      { date: "Mar", value: 71.8 },
      { date: "Apr", value: 71.0 },
      { date: "May", value: 70.5 },
      { date: "Jun", value: 70.2 }
    ],
    recordsAccessed: [
      { type: "Healthcare Providers", count: 12 },
      { type: "Self", count: 8 },
      { type: "Emergency", count: 1 },
      { type: "Research", count: 3 }
    ],
    appointments: {
      completed: 8,
      upcoming: 3,
      cancelled: 1
    }
  };

  // Calculate max values to scale charts
  const maxSystolic = Math.max(...healthMetrics.bloodPressure.map(item => item.systolic));
  const maxDiastolic = Math.max(...healthMetrics.bloodPressure.map(item => item.diastolic));
  const maxBloodPressure = Math.max(maxSystolic, maxDiastolic);
  
  const maxWeight = Math.max(...healthMetrics.weight.map(item => item.value));
  const minWeight = Math.min(...healthMetrics.weight.map(item => item.value));
  
  const totalRecordsAccessed = healthMetrics.recordsAccessed.reduce((sum, item) => sum + item.count, 0);

  // Handle export data
  const handleExportData = () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(healthMetrics));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `health_metrics_${timePeriod}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      
      setIsExporting(false);
      
      // Show success message
      alert('Data export completed successfully!');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Health Analytics</h1>
        <p className="text-gray-500">Monitor your health trends and data</p>
      </div>

      {/* Time Filter and Export */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex bg-gray-100 rounded-md p-1">
          {['week', 'month', 'quarter', 'year'].map((period) => (
            <button
              key={period}
              onClick={() => setTimePeriod(period)}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                timePeriod === period
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
                {healthMetrics.bloodPressure.map((item, index) => (
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
            <div className="flex items-center text-gray-700 gap-1">
              <TrendingDown className="h-4 w-4 text-green-600" />
              <span>Down 3% from last {timePeriod}</span>
            </div>
            <button 
              onClick={() => setShowBloodPressureDetails(!showBloodPressureDetails)} 
              className="text-xs flex items-center gap-1 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Details
              <ChevronDown className={`h-3 w-3 transition-transform ${showBloodPressureDetails ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          {/* Details Panel */}
          {showBloodPressureDetails && (
            <div className="mt-4 pt-4 border-t text-sm">
              <div className="space-y-2">
                <p className="text-gray-700">Normal range: 90-120/60-80 mmHg</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500">Average Systolic</p>
                    <p className="font-medium">{(healthMetrics.bloodPressure.reduce((sum, item) => sum + item.systolic, 0) / healthMetrics.bloodPressure.length).toFixed(1)} mmHg</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Average Diastolic</p>
                    <p className="font-medium">{(healthMetrics.bloodPressure.reduce((sum, item) => sum + item.diastolic, 0) / healthMetrics.bloodPressure.length).toFixed(1)} mmHg</p>
                  </div>
                </div>
                <div className="flex items-start gap-1 mt-2 bg-blue-50 p-2 rounded">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-blue-700">Your blood pressure is within a healthy range. Continue your current lifestyle habits.</p>
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
                <polyline
                  points={healthMetrics.weight.map((item, index) => {
                    // Calculate position in the chart. Using a tight range to make changes more visible
                    const range = maxWeight - minWeight + 2;
                    const yPercentage = 1 - ((item.value - minWeight + 1) / range);
                    const xPercentage = index / (healthMetrics.weight.length - 1);
                    return `${xPercentage * 100}% ${yPercentage * 100}%`;
                  }).join(' ')}
                  fill="none"
                  stroke="rgb(34, 197, 94)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Data points */}
                {healthMetrics.weight.map((item, index) => {
                  const range = maxWeight - minWeight + 2;
                  const yPercentage = 1 - ((item.value - minWeight + 1) / range);
                  const xPercentage = index / (healthMetrics.weight.length - 1);
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
                {healthMetrics.weight.map((item, index) => (
                  <div key={index} className="text-xs text-gray-500">
                    {item.date}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-700 gap-1">
              <TrendingDown className="h-4 w-4 text-green-600" />
              <span>Down 2.3 kg over 6 months</span>
            </div>
            <button 
              onClick={() => setShowWeightDetails(!showWeightDetails)} 
              className="text-xs flex items-center gap-1 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Details
              <ChevronDown className={`h-3 w-3 transition-transform ${showWeightDetails ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          {/* Details Panel */}
          {showWeightDetails && (
            <div className="mt-4 pt-4 border-t text-sm">
              <div className="space-y-2">
                <p className="text-gray-700">Target range: 68-75 kg</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500">Starting Weight</p>
                    <p className="font-medium">{healthMetrics.weight[0].value} kg</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Current Weight</p>
                    <p className="font-medium">{healthMetrics.weight[healthMetrics.weight.length - 1].value} kg</p>
                  </div>
                </div>
                <div className="flex items-start gap-1 mt-2 bg-green-50 p-2 rounded">
                  <Info className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-green-700">You've achieved a healthy gradual weight loss. Keep up your good habits!</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Records Access */}
        <div className="border rounded-md p-5 bg-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Records Access</h3>
            <div className="text-xs text-gray-500">
              Last 6 months
            </div>
          </div>
          <div className="h-60 w-full relative">
            {/* Pie Chart Implementation */}
            <div className="flex items-center justify-center h-full">
              <div className="relative h-40 w-40">
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  {healthMetrics.recordsAccessed.map((item, index) => {
                    // Calculate chart segments
                    const percentage = item.count / totalRecordsAccessed;
                    const previousPercentages = healthMetrics.recordsAccessed
                      .slice(0, index)
                      .reduce((sum, prev) => sum + prev.count / totalRecordsAccessed, 0);
                      
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
                    const colors = ['#1e293b', '#475569', '#94a3b8', '#cbd5e1'];
                    
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
                  <span className="text-sm font-medium">Total</span>
                  <span className="text-lg font-bold">{totalRecordsAccessed}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {healthMetrics.recordsAccessed.map((item, index) => {
              const colors = ['bg-gray-800', 'bg-gray-600', 'bg-gray-400', 'bg-gray-300'];
              const percentage = Math.round((item.count / totalRecordsAccessed) * 100);
              
              return (
                <div key={index} className="flex items-center gap-1">
                  <span className={`h-3 w-3 rounded-full ${colors[index % colors.length]}`}></span>
                  <span className="text-gray-700">{item.type}: {item.count} ({percentage}%)</span>
                </div>
              );
            })}
          </div>
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
            <div className="h-full flex items-end justify-center">
              <div className="flex items-end justify-center gap-12 w-full h-full pb-8">
                {Object.entries(healthMetrics.appointments).map(([key, value], index) => {
                  const total = Object.values(healthMetrics.appointments).reduce((sum, val) => sum + val, 0);
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
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="grid grid-cols-3 gap-2 w-full">
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="text-sm font-medium">Completed</div>
                <div className="text-2xl font-bold">{healthMetrics.appointments.completed}</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="text-sm font-medium">Upcoming</div>
                <div className="text-2xl font-bold">{healthMetrics.appointments.upcoming}</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="text-sm font-medium">Cancelled</div>
                <div className="text-2xl font-bold">{healthMetrics.appointments.cancelled}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Health Summary */}
      <div className="border rounded-md p-5 bg-white">
        <h3 className="font-medium mb-4">Health Insights</h3>
        <div className="space-y-4">
          <div className="p-3 bg-green-50 rounded flex items-start gap-3">
            <TrendingDown className="h-5 w-5 text-green-700 mt-0.5" />
            <div>
              <h4 className="font-medium">Weight is on a healthy downward trend</h4>
              <p className="text-sm text-green-700">You've consistently maintained a healthy weight reduction over the past 6 months.</p>
            </div>
          </div>
          <div className="p-3 bg-blue-50 rounded flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-blue-700 mt-0.5" />
            <div>
              <h4 className="font-medium">Blood pressure has improved</h4>
              <p className="text-sm text-blue-700">Your blood pressure readings are trending towards a healthier range.</p>
            </div>
          </div>
          <div className="p-3 bg-indigo-50 rounded flex items-start gap-3">
            <Calendar className="h-5 w-5 text-indigo-700 mt-0.5" />
            <div>
              <h4 className="font-medium">Regular check-ups maintained</h4>
              <p className="text-sm text-indigo-700">You've been consistent with your scheduled appointments.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 