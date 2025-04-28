import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  getResources, 
  getResourceCategories, 
  addResource, 
  deleteResource, 
  shareResource, 
  createFolder 
} from '../../../services/resourceService';
import ResourceUploadModal from './ResourceUploadModal';
import FolderCreationModal from './FolderCreationModal';
import ShareResourceModal from './ShareResourceModal';
import ResourceActionMenu from './ResourceActionMenu';

const ResourceLibrary = () => {
  // State for resources and categories
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResources, setFilteredResources] = useState([]);
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal states
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  
  // Action menu state
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const [actionMenuResource, setActionMenuResource] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [resourcesPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [displayedResources, setDisplayedResources] = useState([]);
  
  // Fetch resources and categories on component mount
  useEffect(() => {
    fetchResources();
    fetchCategories();
  }, []);
  
  // Filter resources based on search query and selected category
  useEffect(() => {
    let filtered = [...resources];
    
    if (selectedCategory) {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(resource => 
        resource.title.toLowerCase().includes(query) || 
        resource.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredResources(filtered);
    setTotalPages(Math.ceil(filtered.length / resourcesPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [resources, searchQuery, selectedCategory, resourcesPerPage]);
  
  // Update displayed resources when page or filtered resources change
  useEffect(() => {
    const startIndex = (currentPage - 1) * resourcesPerPage;
    const endIndex = startIndex + resourcesPerPage;
    setDisplayedResources(filteredResources.slice(startIndex, endIndex));
  }, [filteredResources, currentPage, resourcesPerPage]);
  
  // Fetch all resources
  const fetchResources = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await getResources();
      if (result.success) {
        setResources(result.data);
        setFilteredResources(result.data);
        setTotalPages(Math.ceil(result.data.length / resourcesPerPage));
      } else {
        setError('Failed to load resources');
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
      setError('An error occurred while loading resources');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch resource categories
  const fetchCategories = async () => {
    try {
      const result = await getResourceCategories();
      if (result.success) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  
  // Handle resource upload
  const handleResourceUpload = async (resourceData) => {
    try {
      const result = await addResource(resourceData);
      if (result.success) {
        // Add the new resource to the list
        setResources(prevResources => [result.data, ...prevResources]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error uploading resource:', error);
      throw error;
    }
  };
  
  // Handle folder creation
  const handleFolderCreate = async (folderName) => {
    try {
      const result = await createFolder(folderName);
      if (result.success) {
        // For demo purposes, show a success message
        alert(`Folder "${folderName}" created successfully!`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  };
  
  // Handle resource share
  const handleShareResource = async (resourceId, shareData) => {
    try {
      const result = await shareResource(resourceId, shareData);
      return result.success;
    } catch (error) {
      console.error('Error sharing resource:', error);
      throw error;
    }
  };
  
  // Handle resource actions
  const handleViewResource = (resource) => {
    // Open the resource in a new tab
    window.open(resource.url || '#', '_blank');
  };
  
  const handleDownloadResource = (resource) => {
    // Create a download link
    const link = document.createElement('a');
    link.href = resource.url || '#';
    link.setAttribute('download', resource.title);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleDeleteResource = async (resource) => {
    if (window.confirm(`Are you sure you want to delete "${resource.title}"?`)) {
      try {
        const result = await deleteResource(resource.id);
        if (result.success) {
          // Remove the resource from the list
          setResources(prevResources => 
            prevResources.filter(r => r.id !== resource.id)
          );
        }
      } catch (error) {
        console.error('Error deleting resource:', error);
        alert('Failed to delete resource');
      }
    }
  };
  
  // Handle action menu open
  const handleActionMenuOpen = (resource, e) => {
    e.preventDefault();
    e.stopPropagation();
    setActionMenuResource(resource);
    setActionMenuOpen(true);
  };
  
  // Get icon component based on category
  const getCategoryIcon = (categoryName) => {
    const category = categories.find(c => c.name === categoryName);
    if (!category) return null;
    
    // Return the appropriate icon based on category.icon
    switch (category.icon) {
      case 'meal-plan':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      case 'video':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case 'handout':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        );
      case 'educational':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'recipe':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
    }
  };
  
  // Get background color based on category
  const getCategoryColor = (categoryName) => {
    const category = categories.find(c => c.name === categoryName);
    return category ? category.color : 'bg-gray-100';
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Nutrition Education Resources</h2>
        <button 
          onClick={() => setUploadModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Upload Resource
        </button>
      </div>
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-2 pr-4 block w-full border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {selectedCategory ? selectedCategory : 'All Resources'}
                {searchQuery && <span className="ml-2 text-sm font-normal text-gray-500">Search results for "{searchQuery}"</span>}
              </h3>
              {selectedCategory && (
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="text-sm text-purple-600 hover:text-purple-800"
                >
                  View All
                </button>
              )}
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
                {error}
              </div>
            )}
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
              </div>
            ) : displayedResources.length === 0 ? (
              <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No resources found</h3>
                <p className="mt-1 text-gray-500">
                  {searchQuery 
                    ? `No resources match your search query "${searchQuery}"`
                    : selectedCategory 
                      ? `No resources in the "${selectedCategory}" category` 
                      : 'Upload a resource to get started'}
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setUploadModalOpen(true)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    Upload Resource
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {displayedResources.map(resource => (
                  <motion.div 
                    key={resource.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow relative"
                  >
                    <div className="flex items-start">
                      <div className={`${getCategoryColor(resource.category)} rounded-lg p-2 mr-4`}>
                        {getCategoryIcon(resource.category)}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-md font-medium text-gray-800">{resource.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {resource.description}
                        </p>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-xs text-gray-500">{resource.type} • {resource.size} • Added {resource.dateAdded}</span>
                          <div className="flex space-x-2 relative">
                            <button
                              onClick={() => {
                                setSelectedResource(resource);
                                setShareModalOpen(true);
                              }}
                              className="text-purple-600 hover:text-purple-800 text-sm"
                            >
                              Share
                            </button>
                            <button
                              onClick={(e) => handleActionMenuOpen(resource, e)}
                              className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                            >
                              {resource.type === 'MP4' ? 'Watch' : resource.type === 'PDF' ? 'View' : 'Download'}
                            </button>
                            {actionMenuOpen && actionMenuResource && actionMenuResource.id === resource.id && (
                              <ResourceActionMenu
                                resource={resource}
                                isOpen={actionMenuOpen}
                                onClose={() => setActionMenuOpen(false)}
                                onView={handleViewResource}
                                onDownload={handleDownloadResource}
                                onShare={(r) => {
                                  setSelectedResource(r);
                                  setShareModalOpen(true);
                                }}
                                onDelete={handleDeleteResource}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === index + 1
                          ? 'z-10 bg-purple-50 border-purple-500 text-purple-600'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
        
        <div className="col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Resource Categories</h3>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <div className="space-y-3">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`flex items-center justify-between p-3 ${category.color} rounded-lg w-full text-left hover:opacity-90 transition-opacity ${
                      selectedCategory === category.name ? 'ring-2 ring-purple-500' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`${category.iconBg} p-2 rounded-md mr-3`}>
                        {getCategoryIcon(category.name)}
                      </div>
                      <span className="font-medium text-gray-800">{category.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">{category.count} items</span>
                  </button>
                ))}
              </div>
            )}
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-md font-medium text-gray-800 mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <button 
                  onClick={() => setUploadModalOpen(true)}
                  className="w-full flex items-center justify-center p-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload New Resource
                </button>
                <button 
                  onClick={() => setFolderModalOpen(true)}
                  className="w-full flex items-center justify-center p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  Create New Folder
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <ResourceUploadModal 
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleResourceUpload}
      />
      
      <FolderCreationModal
        isOpen={folderModalOpen}
        onClose={() => setFolderModalOpen(false)}
        onCreate={handleFolderCreate}
      />
      
      <ShareResourceModal
        isOpen={shareModalOpen}
        onClose={() => {
          setShareModalOpen(false);
          setSelectedResource(null);
        }}
        resource={selectedResource}
        onShare={handleShareResource}
      />
    </div>
  );
};

export default ResourceLibrary; 