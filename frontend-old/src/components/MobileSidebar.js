import React from 'react';
import Sidebar from './Sidebar';

const MobileSidebar = ({ isOpen, onToggle, ...sidebarProps }) => {
  
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onToggle}
      />
      
      {/* Sidebar Panel */}
      <div className="fixed top-0 left-0 z-50 lg:hidden h-full transform transition-transform duration-300 ease-in-out">
        <div className="relative h-full">
          {/* Close Button */}
          <button
            onClick={onToggle}
            className="absolute top-4 right-4 z-10 flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            <i className="bx bx-x text-gray-600 text-lg"></i>
          </button>
          
          {/* Sidebar Content */}
          <Sidebar {...sidebarProps} />
        </div>
      </div>
    </>
  );
};

export default MobileSidebar; 