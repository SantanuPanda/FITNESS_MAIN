import React, { useState, useEffect } from 'react';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { getClientAnalytics, exportNutritionReport, getTestNutritionData } from '../../../services/nutritionistService';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const NutritionAnalytics = ({ nutritionMetrics: initialMetrics }) => {
  const [timeRange, setTimeRange] = useState('Last 7 days');
  const [nutritionMetrics, setNutritionMetrics] = useState(initialMetrics || getTestNutritionData());
  const [isLoading, setIsLoading] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState(null);

  // Fetch analytics data when time range changes
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      try {
        const result = await getClientAnalytics(timeRange);
        if (result.success) {
          setNutritionMetrics(result.data);
        } else {
          console.error('Failed to fetch analytics data:', result.error);
        }
      } catch (error) {
        console.error('Error in analytics fetch:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (timeRange !== 'Custom') {
      fetchAnalyticsData();
    }
  }, [timeRange]);

  // Handle custom date range submission
  const handleCustomDateSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate dates
      if (!customDateRange.startDate || !customDateRange.endDate) {
        alert('Please select both start and end dates');
        return;
      }
      
      const startDate = new Date(customDateRange.startDate);
      const endDate = new Date(customDateRange.endDate);
      
      if (startDate > endDate) {
        alert('Start date cannot be after end date');
        return;
      }
      
      // Fetch data with custom date range
      const result = await getClientAnalytics({
        startDate: customDateRange.startDate,
        endDate: customDateRange.endDate
      });
      
      if (result.success) {
        setNutritionMetrics(result.data);
      } else {
        console.error('Failed to fetch analytics data:', result.error);
      }
    } catch (error) {
      console.error('Error in custom date fetch:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle export report
  const handleExportReport = async () => {
    try {
      setIsExporting(true);
      setExportMessage(null);
      
      await exportNutritionReport(timeRange, exportFormat);
      
      // Show success message
      setExportMessage({
        type: 'success',
        text: `Report successfully exported as ${exportFormat.toUpperCase()}`
      });
      
      // Hide message after 3 seconds
      setTimeout(() => {
        setExportMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error exporting report:', error);
      setExportMessage({
        type: 'error',
        text: 'Failed to export report. Please try again.'
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Toggle custom date picker
  useEffect(() => {
    if (timeRange === 'Custom') {
      setShowCustomDatePicker(true);
    } else {
      setShowCustomDatePicker(false);
    }
  }, [timeRange]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Nutrition Analytics Dashboard</h2>
        <div className="flex space-x-2 gap-2">
          <select 
            className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            disabled={isLoading}
          >
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Last 6 months</option>
            <option>Custom</option>
          </select>
          <button 
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-md px-3 py-1.5 text-sm"
            onClick={() => setShowExportOptions(!showExportOptions)}
            disabled={isLoading}
          >
            Export Report
          </button>
        </div>
      </div>
      
      {/* Custom Date Range Picker */}
      {showCustomDatePicker && (
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Custom Date Range</h3>
          <form onSubmit={handleCustomDateSubmit} className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Start Date</label>
              <input 
                type="date" 
                className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                value={customDateRange.startDate}
                onChange={(e) => setCustomDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">End Date</label>
              <input 
                type="date" 
                className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                value={customDateRange.endDate}
                onChange={(e) => setCustomDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                required
              />
            </div>
            <button 
              type="submit" 
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-md px-3 py-1.5 text-sm"
              disabled={isLoading}
            >
              Apply Range
            </button>
          </form>
        </div>
      )}
      
      {/* Export Options */}
      {showExportOptions && (
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Export Options</h3>
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Format</label>
              <select 
                className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                disabled={isExporting}
              >
                <option value="pdf">PDF</option>
                <option value="csv">CSV</option>
                <option value="excel">Excel</option>
              </select>
            </div>
            <button 
              onClick={handleExportReport} 
              className={`flex items-center ${
                isExporting 
                  ? 'bg-purple-400 cursor-not-allowed' 
                  : 'bg-purple-600 hover:bg-purple-700'
              } text-white rounded-md px-3 py-1.5 text-sm`}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Exporting...
                </>
              ) : (
                'Download'
              )}
            </button>
            
            {exportMessage && (
              <div className={`ml-2 text-sm ${
                exportMessage.type === 'success' ? 'text-green-600' : 'text-red-600'
              }`}>
                {exportMessage.text}
              </div>
            )}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Overview Card */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Nutrition Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-purple-600 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-500">Client Success Rate</p>
                <p className="text-xl font-bold text-gray-800">
                  {nutritionMetrics?.stats?.clientSuccessRate || 88}%
                </p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-green-600 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-xs text-gray-500">Meal Plan Completion</p>
                <p className="text-xl font-bold text-gray-800">
                  {nutritionMetrics?.stats?.mealPlanCompletion || 76}%
                </p>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="text-yellow-600 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-500">Avg. Weight Change</p>
                <p className="text-xl font-bold text-gray-800">
                  {nutritionMetrics?.stats?.avgWeightChange || -4.2}kg
                </p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-purple-600 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-500">Goal Achievement</p>
                <p className="text-xl font-bold text-gray-800">
                  {nutritionMetrics?.stats?.goalAchievement || 82}%
                </p>
              </div>
            </div>
          </div>

          {/* Macro Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Client Macro Distribution</h3>
            <div className="h-64">
              {nutritionMetrics?.macroDistribution ? (
                <Pie 
                  data={nutritionMetrics.macroDistribution}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      title: {
                        display: true,
                        text: 'Average Macro Nutrients Distribution',
                        font: { size: 14 }
                      },
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No macro distribution data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Client Progress */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Client Progress Trends</h3>
            <div className="h-64">
              {nutritionMetrics?.clientProgress ? (
                <Line 
                  data={nutritionMetrics.clientProgress}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: false
                      }
                    },
                    plugins: {
                      legend: {
                        position: 'top',
                      }
                    }
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No client progress data available</p>
                </div>
              )}
            </div>
          </div>
                  
          {/* Nutrient Intake */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Average Daily Nutrient Intake</h3>
            <div className="h-72">
              {nutritionMetrics?.nutrientIntake ? (
                <Bar 
                  data={nutritionMetrics.nutrientIntake}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 150,
                        title: {
                          display: true,
                          text: 'Percentage of Recommended Daily Intake'
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        display: false
                      }
                    }
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No nutrient intake data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Insights */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Nutrition Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {nutritionMetrics?.insights ? (
                nutritionMetrics.insights.map((insight, index) => {
                  const bgColor = insight.type === 'warning' ? 'bg-red-50' : 
                                insight.type === 'success' ? 'bg-green-50' : 'bg-purple-50';
                  const iconColor = insight.type === 'warning' ? 'text-red-600' : 
                                  insight.type === 'success' ? 'text-green-600' : 'text-purple-600';
                  const bgIconColor = insight.type === 'warning' ? 'bg-red-100' : 
                                    insight.type === 'success' ? 'bg-green-100' : 'bg-purple-100';
                  const iconPath = insight.type === 'warning' ? 
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /> : 
                    insight.type === 'success' ? 
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /> :
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />;
                  
                  return (
                    <div key={index} className={`${bgColor} p-4 rounded-lg`}>
                      <div className="flex items-center mb-2">
                        <div className={`${bgIconColor} p-2 rounded-md ${iconColor} mr-3`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {iconPath}
                          </svg>
                        </div>
                        <h4 className="font-medium text-gray-800">{insight.title}</h4>
                      </div>
                      <p className="text-sm text-gray-600">{insight.message}</p>
                    </div>
                  );
                })
              ) : (
                <>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="bg-purple-100 p-2 rounded-md text-purple-600 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h4 className="font-medium text-gray-800">Protein Intake</h4>
                    </div>
                    <p className="text-sm text-gray-600">Client protein intake is averaging 85% of targets. Consider recommending additional protein sources.</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="bg-green-100 p-2 rounded-md text-green-600 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h4 className="font-medium text-gray-800">Weight Progress</h4>
                    </div>
                    <p className="text-sm text-gray-600">Clients are showing consistent weight management progress, averaging 0.5kg per week.</p>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="bg-red-100 p-2 rounded-md text-red-600 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <h4 className="font-medium text-gray-800">Nutrient Deficiencies</h4>
                    </div>
                    <p className="text-sm text-gray-600">Vitamin D levels are below target for 65% of clients. Consider supplementation recommendations.</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionAnalytics; 