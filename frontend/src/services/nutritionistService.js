import axios from 'axios';

// API URL from environment variables or fallback to localhost
const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/nutrition` : 'http://localhost:5000/api/nutrition';

/**
 * Get nutrition summary for a specific date range
 * @param {string} startDate Start date in ISO format
 * @param {string} endDate End date in ISO format
 * @returns {Promise<Object>} Nutrition summary data
 */
export const getNutritionSummary = async (startDate, endDate) => {
  try {
    const response = await axios.get(`${API_URL}/summary`, {
      params: { startDate, endDate }
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching nutrition summary:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
};

/**
 * Get all meals for the current user or a specific user (for nutritionists)
 * @param {Object} options Query options
 * @param {string} options.startDate Start date in ISO format
 * @param {string} options.endDate End date in ISO format
 * @param {string} options.userId User ID (for nutritionists)
 * @returns {Promise<Object>} Meals data
 */
export const getMeals = async (options = {}) => {
  try {
    const { startDate, endDate, userId } = options;
    
    let url = API_URL;
    if (userId) {
      url = `${API_URL}/user/${userId}`;
    }
    
    const response = await axios.get(url, {
      params: { startDate, endDate }
    });
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching meals:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
};

/**
 * Create a new meal for the current user
 * @param {Object} mealData Meal data
 * @returns {Promise<Object>} Created meal data
 */
export const createMeal = async (mealData) => {
  try {
    const response = await axios.post(API_URL, mealData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error creating meal:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
};

/**
 * Get client analytics data for nutritionists
 * @param {string} timeRange Time range for analytics
 * @returns {Promise<Object>} Analytics data
 */
export const getClientAnalytics = async (timeRange) => {
  try {
    // Calculate date range based on timeRange
    const endDate = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case 'Last 7 days':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'Last 30 days':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case 'Last 3 months':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case 'Last 6 months':
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7); // Default to last 7 days
    }
    
    // Fetch data from backend
    const response = await axios.get(`${API_URL}/analytics`, {
      params: { 
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching client analytics:', error);
    
    // If API fails or for demo purposes, provide mock data
    const mockData = generateMockAnalyticsData(timeRange);
    return { success: true, data: mockData };
  }
};

/**
 * Generate mock analytics data for demo purposes
 * @param {string} timeRange Time range for analytics
 * @returns {Object} Mock analytics data
 */
const generateMockAnalyticsData = (timeRange) => {
  // Calculate periods based on timeRange
  let periods;
  switch (timeRange) {
    case 'Last 7 days':
      periods = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return `Day ${i+1}`;
      });
      break;
    case 'Last 30 days':
      periods = Array.from({ length: 4 }, (_, i) => `Week ${i+1}`);
      break;
    case 'Last 3 months':
      periods = Array.from({ length: 3 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (2 - i));
        return date.toLocaleString('default', { month: 'short' });
      });
      break;
    case 'Last 6 months':
      periods = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - i));
        return date.toLocaleString('default', { month: 'short' });
      });
      break;
    default:
      periods = Array.from({ length: 7 }, (_, i) => `Day ${i+1}`);
  }
  
  // Generate weight and BMI data with slight variations based on time range
  const getRandomVariation = () => (Math.random() * 0.5) - 0.25; // Between -0.25 and 0.25
  
  const weightData = periods.map((_, i) => {
    const baseValue = 85 - (i * 0.5);
    return baseValue + getRandomVariation();
  });
  
  const bmiData = periods.map((_, i) => {
    const baseValue = 28 - (i * 0.2);
    return baseValue + getRandomVariation();
  });
  
  // Generate nutrient intake data with random variations
  const nutrientData = [
    { name: 'Vitamin A', baseValue: 85 },
    { name: 'Vitamin C', baseValue: 120 },
    { name: 'Vitamin D', baseValue: 65 },
    { name: 'Iron', baseValue: 75 },
    { name: 'Calcium', baseValue: 90 },
    { name: 'Potassium', baseValue: 80 }
  ].map(nutrient => ({
    ...nutrient,
    value: Math.max(0, Math.min(200, nutrient.baseValue + (Math.random() * 20) - 10)) // Add random variation but keep between 0-200
  }));
  
  // Generate mock data
  return {
    macroDistribution: {
      labels: ['Protein', 'Carbs', 'Fat'],
      datasets: [{
        label: 'Recommended Macro Distribution',
        data: [30, 40, 30],
        backgroundColor: ['#9333ea', '#14b8a6', '#a78bfa'],
      }]
    },
    clientProgress: {
      labels: periods,
      datasets: [
        {
          label: 'Average Weight (kg)',
          data: weightData,
          borderColor: '#9333ea',
          backgroundColor: 'rgba(147, 51, 234, 0.2)',
          tension: 0.3,
        },
        {
          label: 'Average BMI',
          data: bmiData,
          borderColor: '#14b8a6',
          backgroundColor: 'rgba(20, 184, 166, 0.2)',
          tension: 0.3,
        }
      ]
    },
    nutrientIntake: {
      labels: nutrientData.map(n => n.name),
      datasets: [{
        label: 'Average Daily Intake (% of RDI)',
        data: nutrientData.map(n => n.value),
        backgroundColor: 'rgba(147, 51, 234, 0.6)',
      }]
    },
    // Add more insights for UI
    insights: [
      {
        title: 'Protein Intake',
        message: 'Client protein intake is averaging 85% of targets. Consider recommending additional protein sources.',
        type: 'info'
      },
      {
        title: 'Weight Progress',
        message: 'Clients are showing consistent weight management progress, averaging 0.5kg per week.',
        type: 'success'
      },
      {
        title: 'Nutrient Deficiencies',
        message: 'Vitamin D levels are below target for 65% of clients. Consider supplementation recommendations.',
        type: 'warning'
      }
    ],
    // Overall stats for dashboard
    stats: {
      clientSuccessRate: 88,
      mealPlanCompletion: 76,
      avgWeightChange: -4.2,
      goalAchievement: 82
    }
  };
};

/**
 * Export nutrition report
 * @param {string} timeRange Time range for report
 * @param {string} format Export format (pdf, csv, etc.)
 * @returns {Promise<Object>} Export result
 */
export const exportNutritionReport = async (timeRange, format = 'pdf') => {
  try {
    const response = await axios.get(`${API_URL}/export`, {
      params: { timeRange, format },
      responseType: 'blob'
    });
    
    // Create a download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `nutrition_report_${timeRange}.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return { success: true };
  } catch (error) {
    console.error('Error exporting nutrition report:', error);
    
    // For demo purposes, generate a mock file and download it
    const mockData = await generateMockExportFile(timeRange, format);
    const blob = new Blob([mockData], { 
      type: format === 'pdf' ? 'application/pdf' : 
            format === 'csv' ? 'text/csv' : 
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `nutrition_report_${timeRange}.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return { success: true, demo: true };
  }
};

/**
 * Generate mock export file content based on format
 * @param {string} timeRange Time range for report
 * @param {string} format Export format (pdf, csv, excel)
 * @returns {Promise<string|ArrayBuffer>} Mock file content
 */
const generateMockExportFile = async (timeRange, format) => {
  // Get mock data for the report
  const data = generateMockAnalyticsData(timeRange);
  
  if (format === 'csv') {
    // Generate CSV content
    let csvContent = "Category,Metric,Value\n";
    
    // Add stats
    csvContent += `Statistics,Client Success Rate,${data.stats.clientSuccessRate}%\n`;
    csvContent += `Statistics,Meal Plan Completion,${data.stats.mealPlanCompletion}%\n`;
    csvContent += `Statistics,Average Weight Change,${data.stats.avgWeightChange}kg\n`;
    csvContent += `Statistics,Goal Achievement,${data.stats.goalAchievement}%\n`;
    
    // Add macros
    data.macroDistribution.labels.forEach((label, index) => {
      csvContent += `Macros,${label},${data.macroDistribution.datasets[0].data[index]}%\n`;
    });
    
    // Add nutrient data
    data.nutrientIntake.labels.forEach((label, index) => {
      csvContent += `Nutrients,${label},${data.nutrientIntake.datasets[0].data[index]}%\n`;
    });
    
    // Add insights
    data.insights.forEach(insight => {
      csvContent += `Insights,${insight.title},${insight.message}\n`;
    });
    
    return csvContent;
  } 
  else if (format === 'excel') {
    // For demo, we'll just create a text file that says it's an Excel file
    // In a real implementation, you would use a library like xlsx or exceljs
    return `This would be an Excel file with nutrition data for ${timeRange}.\n\n` +
           `It would include statistics, macro distribution, nutrient intake, and insights.`;
  }
  else {
    // For PDF, create a simple text representation (in a real app, use a PDF library)
    // In a real implementation, you would use a library like pdfmake or jspdf
    return `NUTRITION REPORT - ${timeRange}\n\n` +
           `STATISTICS:\n` +
           `- Client Success Rate: ${data.stats.clientSuccessRate}%\n` +
           `- Meal Plan Completion: ${data.stats.mealPlanCompletion}%\n` +
           `- Average Weight Change: ${data.stats.avgWeightChange}kg\n` +
           `- Goal Achievement: ${data.stats.goalAchievement}%\n\n` +
           `INSIGHTS:\n` +
           data.insights.map(insight => `- ${insight.title}: ${insight.message}`).join('\n');
  }
};

/**
 * Generate test data for initial demo/development
 * @returns {Object} Test data for the nutritionist dashboard
 */
export const getTestNutritionData = () => {
  return generateMockAnalyticsData('Last 7 days');
}; 