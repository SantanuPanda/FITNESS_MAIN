import axios from 'axios';

// API URL from environment variables or fallback to localhost
const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/resources` : 'http://localhost:5000/api/resources';

// Local storage key for resources
const RESOURCES_STORAGE_KEY = 'nutrition_resources';

/**
 * Get all resources
 * @param {Object} filters Optional filters like category, type, etc.
 * @returns {Promise<Object>} Resources data
 */
export const getResources = async (filters = {}) => {
  try {
    // Try to fetch from API first
    const response = await axios.get(API_URL, { params: filters });
    return { success: true, data: response.data };
  } catch (error) {
    console.log('API fetch failed, using local storage:', error);
    
    // Fallback to localStorage if API unavailable
    const resources = getResourcesFromStorage();
    
    // Apply filters if any
    let filteredResources = [...resources];
    if (filters.category) {
      filteredResources = filteredResources.filter(r => r.category === filters.category);
    }
    if (filters.type) {
      filteredResources = filteredResources.filter(r => r.type === filters.type);
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredResources = filteredResources.filter(r => 
        r.title.toLowerCase().includes(searchTerm) || 
        r.description.toLowerCase().includes(searchTerm)
      );
    }
    
    return { success: true, data: filteredResources };
  }
};

/**
 * Get resources by category
 * @param {string} category Category name
 * @returns {Promise<Object>} Resources in the category
 */
export const getResourcesByCategory = async (category) => {
  return getResources({ category });
};

/**
 * Add a new resource
 * @param {Object} resourceData Resource data to add
 * @returns {Promise<Object>} Added resource
 */
export const addResource = async (resourceData) => {
  try {
    // Try to add via API first
    const response = await axios.post(API_URL, resourceData);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('API post failed, using local storage:', error);
    
    // Fallback to localStorage
    const resources = getResourcesFromStorage();
    
    // Create new resource with ID and date
    const newResource = {
      ...resourceData,
      id: Date.now(), // Use timestamp as ID
      dateAdded: 'Just now',
      dateAddedTimestamp: new Date().toISOString()
    };
    
    // Add to resources and save
    resources.unshift(newResource); // Add to beginning
    saveResourcesToStorage(resources);
    
    return { success: true, data: newResource };
  }
};

/**
 * Delete a resource
 * @param {number} resourceId ID of resource to delete
 * @returns {Promise<Object>} Success status
 */
export const deleteResource = async (resourceId) => {
  try {
    // Try to delete via API first
    await axios.delete(`${API_URL}/${resourceId}`);
    return { success: true };
  } catch (error) {
    console.log('API delete failed, using local storage:', error);
    
    // Fallback to localStorage
    const resources = getResourcesFromStorage();
    const updatedResources = resources.filter(r => r.id !== resourceId);
    saveResourcesToStorage(updatedResources);
    
    return { success: true };
  }
};

/**
 * Share a resource
 * @param {number} resourceId ID of resource to share
 * @param {Object} shareData Share data (email, etc.)
 * @returns {Promise<Object>} Success status
 */
export const shareResource = async (resourceId, shareData) => {
  try {
    // Try to share via API first
    await axios.post(`${API_URL}/${resourceId}/share`, shareData);
    return { success: true };
  } catch (error) {
    console.log('API share failed:', error);
    
    // For demo purposes, consider it successful
    return { success: true, demo: true };
  }
};

/**
 * Get all resource categories with counts
 * @returns {Promise<Object>} Categories data
 */
export const getResourceCategories = async () => {
  try {
    // Try to fetch from API first
    const response = await axios.get(`${API_URL}/categories`);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('API fetch categories failed, using local storage:', error);
    
    // Fallback to localStorage
    const resources = getResourcesFromStorage();
    const categories = [
      { 
        name: 'Meal Plans', 
        count: resources.filter(r => r.category === 'Meal Plans').length,
        icon: 'meal-plan',
        color: 'bg-orange-50',
        iconBg: 'bg-orange-100'
      },
      { 
        name: 'Educational Materials', 
        count: resources.filter(r => r.category === 'Educational Materials').length,
        icon: 'educational',
        color: 'bg-blue-50',
        iconBg: 'bg-blue-100'
      },
      { 
        name: 'Video Resources', 
        count: resources.filter(r => r.category === 'Video Resources').length,
        icon: 'video',
        color: 'bg-green-50',
        iconBg: 'bg-green-100'
      },
      { 
        name: 'Client Handouts', 
        count: resources.filter(r => r.category === 'Client Handouts').length,
        icon: 'handout',
        color: 'bg-purple-50',
        iconBg: 'bg-purple-100'
      },
      { 
        name: 'Recipes', 
        count: resources.filter(r => r.category === 'Recipes').length,
        icon: 'recipe',
        color: 'bg-yellow-50',
        iconBg: 'bg-yellow-100'
      }
    ];
    
    return { success: true, data: categories };
  }
};

/**
 * Create a new resource folder
 * @param {string} folderName Name of the folder
 * @returns {Promise<Object>} Created folder data
 */
export const createFolder = async (folderName) => {
  try {
    // Try to create via API first
    const response = await axios.post(`${API_URL}/folders`, { name: folderName });
    return { success: true, data: response.data };
  } catch (error) {
    console.log('API folder creation failed:', error);
    
    // For demo purposes, consider it successful
    return { 
      success: true, 
      data: { 
        id: Date.now(),
        name: folderName,
        dateCreated: new Date().toISOString()
      }, 
      demo: true 
    };
  }
};

// Helper functions for localStorage
const getResourcesFromStorage = () => {
  const storedResources = localStorage.getItem(RESOURCES_STORAGE_KEY);
  if (!storedResources) {
    // If no resources in storage, initialize with default data
    const defaultResources = getDefaultResources();
    saveResourcesToStorage(defaultResources);
    return defaultResources;
  }
  return JSON.parse(storedResources);
};

const saveResourcesToStorage = (resources) => {
  localStorage.setItem(RESOURCES_STORAGE_KEY, JSON.stringify(resources));
};

// Default resources for demo purposes
const getDefaultResources = () => [
  {
    id: 1,
    title: 'Comprehensive Macro Nutrition Guide',
    description: 'Complete guide to understanding macronutrients and their role in nutrition planning.',
    type: 'PDF',
    size: '2.4 MB',
    dateAdded: '2 days ago',
    dateAddedTimestamp: new Date(Date.now() - 2*24*60*60*1000).toISOString(),
    category: 'Educational Materials',
    url: 'https://example.com/macro-guide.pdf',
    icon: 'document'
  },
  {
    id: 2,
    title: 'Meal Planning Techniques Video',
    description: 'Advanced techniques for creating effective meal plans for various client needs.',
    type: 'MP4',
    size: '18 minutes',
    dateAdded: '5 days ago',
    dateAddedTimestamp: new Date(Date.now() - 5*24*60*60*1000).toISOString(),
    category: 'Video Resources',
    url: 'https://example.com/meal-planning.mp4',
    icon: 'video'
  },
  {
    id: 3,
    title: '7-Day Detox Meal Plan Template',
    description: 'Customizable template for creating 7-day detox plans for clients looking to reset their nutrition.',
    type: 'DOCX',
    size: '3.1 MB',
    dateAdded: '1 week ago',
    dateAddedTimestamp: new Date(Date.now() - 7*24*60*60*1000).toISOString(),
    category: 'Meal Plans',
    url: 'https://example.com/detox-plan.docx',
    icon: 'document'
  },
  {
    id: 4,
    title: 'Protein-Rich Foods Infographic',
    description: 'Visual guide to protein-rich foods categorized by source and protein content.',
    type: 'JPG',
    size: '1.8 MB',
    dateAdded: '2 weeks ago',
    dateAddedTimestamp: new Date(Date.now() - 14*24*60*60*1000).toISOString(),
    category: 'Client Handouts',
    url: 'https://example.com/protein-foods.jpg',
    icon: 'image'
  },
  {
    id: 5,
    title: 'Healthy Breakfast Recipes Collection',
    description: '30 nutritionist-approved breakfast recipes with complete macronutrient information.',
    type: 'PDF',
    size: '4.2 MB',
    dateAdded: '3 weeks ago',
    dateAddedTimestamp: new Date(Date.now() - 21*24*60*60*1000).toISOString(),
    category: 'Recipes',
    url: 'https://example.com/breakfast-recipes.pdf',
    icon: 'document'
  }
]; 