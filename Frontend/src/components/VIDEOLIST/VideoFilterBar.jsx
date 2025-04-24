import React, { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, ChevronLeft, ChevronRight, Calendar, Eye, X } from 'lucide-react';
import PropTypes from 'prop-types';

// Constants for tags and view ranges
const TAGS = [
  "All",
  "Technology",
  "Education",
  "Entertainment",
  "Music",
  "Gaming",
  "News",
  "Sports",
  "Comedy",
  "Film",
  "Science",
];

const VIEW_RANGES = [
  { value: "", label: "All Views" },
  { value: "0,1000", label: "0-1K views" },
  { value: "1000,10000", label: "1K-10K views" },
  { value: "10000,100000", label: "10K-100K views" },
  { value: "100000,", label: "100K+ views" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
  { value: "mostLiked", label: "Most Liked" },
  { value: "oldest", label: "Oldest" },
];

/**
 * VideoFilter Component
 * 
 * Provides filtering and sorting functionality for videos with:
 * - Tag selection
 * - Sort options
 * - Date range filtering
 * - Views range filtering
 * 
 * Uses DaisyUI for styling and Framer Motion for animations
 */
const VideoFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const scrollContainerRef = useRef(null);
  const selectedTags = searchParams.get('tags')?.split(',').filter(Boolean) || ['All'];

  /**
   * Handles sorting parameter changes
   * @param {string} sortValue - The sort value to apply
   */
  const handleSort = (sortValue) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', sortValue);
    setSearchParams(params);
  };

  /**
   * Handles tag selection/deselection
   * @param {string} tag - The tag to toggle
   */
  const handleTagClick = (tag) => {
    let newTags = [...selectedTags];

    if (tag === 'All') {
      const params = new URLSearchParams(searchParams);
      params.delete('tags');
      setSearchParams(params);
      return;
    } else {
      newTags = newTags.filter(t => t !== 'All');

      if (newTags.includes(tag)) {
        newTags = newTags.filter(t => t !== tag);
      } else if (newTags.length < 5) {
        newTags.push(tag);
      }
    }

    const params = new URLSearchParams(searchParams);
    if (newTags.length === 0) {
      params.delete('tags');
    } else {
      params.set('tags', newTags.join(','));
    }
    setSearchParams(params);
  };

  /**
   * Handles date range changes
   * @param {Event} e - The change event
   * @param {string} type - Either 'start' or 'end' date
   */
  const handleDateRangeChange = (e, type) => {
    const params = new URLSearchParams(searchParams);
    const currentDateRange = params.get('dateRange')?.split(',') || ['', ''];
    
    if (type === 'start') {
      currentDateRange[0] = e.target.value;
    } else if (type === 'end') {
      currentDateRange[1] = e.target.value;
    }

    params.set('dateRange', currentDateRange.join(','));
    setSearchParams(params);
  };

  /**
   * Handles views range changes
   * @param {Event} e - The change event
   */
  const handleViewsRangeChange = (e) => {
    const params = new URLSearchParams(searchParams);
    params.set('viewsRange', e.target.value);
    setSearchParams(params);
  };

  /**
   * Scrolls the tags container horizontally
   * @param {string} direction - Either 'left' or 'right'
   */
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  /**
   * Clears all filters
   */
  const clearFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('tags');
    params.delete('dateRange');
    params.delete('viewsRange');
    setSearchParams(params);
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Main Filter Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Filter Toggle Button */}
        <motion.button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="btn btn-ghost bg-base-100 hover:bg-base-200 gap-2"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {isFilterOpen && (
            <motion.span 
              className="badge badge-secondary badge-sm"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              Active
            </motion.span>
          )}
        </motion.button>

        {/* Sort Dropdown */}
        <div className="relative flex-1 min-w-[180px]">
          <select
            onChange={(e) => handleSort(e.target.value)}
            className="select select-bordered w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-primary/50"
            defaultValue={searchParams.get('sort') || 'newest'}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button */}
        {(searchParams.get('tags') || searchParams.get('dateRange') || searchParams.get('viewsRange')) && (
          <motion.button
            onClick={clearFilters}
            className="btn btn-ghost text-error/80 hover:text-error gap-1"
            whileHover={{ scale: 1.05 }}
          >
            <X className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Clear</span>
          </motion.button>
        )}
      </div>

      {/* Tag Scrolling Section */}
      <div className="relative">
        {/* Left Scroll Button */}
        <motion.button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 btn btn-circle btn-sm btn-ghost bg-base-100/80 hover:bg-base-200 hidden md:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.1 }}
        >
          <ChevronLeft className="w-4 h-4" />
        </motion.button>

        {/* Tags Container */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-2 py-2 overflow-x-auto scrollbar-hide px-1"
        >
          <div className="flex gap-2 px-2 md:px-8">
            {TAGS.map((tag) => (
              <motion.button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`btn btn-sm rounded-full transition-all
                  ${(tag === 'All' && !searchParams.get('tags')) || selectedTags.includes(tag)
                    ? 'btn-secondary'
                    : 'btn-ghost bg-base-200/50 hover:bg-base-200'
                  }
                  ${selectedTags.length >= 5 && !selectedTags.includes(tag) && tag !== 'All'
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                  }`}
                disabled={selectedTags.length >= 5 && !selectedTags.includes(tag) && tag !== 'All'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Right Scroll Button */}
        <motion.button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 btn btn-circle btn-sm btn-ghost bg-base-200/80 hover:bg-base-300 hidden md:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.1 }}
        >
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Advanced Filters Panel */}
      {isFilterOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-base-200/50 rounded-box mt-2">
            {/* Date Range Filter */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="w-4 h-4 text-primary/70" />
                <span>Date Range</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="date"
                  className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary/50"
                  onChange={(e) => handleDateRangeChange(e, 'start')}
                  value={searchParams.get('dateRange')?.split(',')[0] || ''}
                />
                <input
                  type="date"
                  className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary/50"
                  onChange={(e) => handleDateRangeChange(e, 'end')}
                  value={searchParams.get('dateRange')?.split(',')[1] || ''}
                />
              </div>
            </div>

            {/* Views Range Filter */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Eye className="w-4 h-4 text-primary/70" />
                <span>Views Range</span>
              </div>
              <select
                className="select select-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary/50"
                onChange={handleViewsRangeChange}
                value={searchParams.get('viewsRange') || ''}
              >
                {VIEW_RANGES.map((range) => (
                  <option key={range.value || 'all'} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Selected Tags Indicator */}
      {selectedTags.length > 0 && selectedTags[0] !== 'All' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-base-content/70 flex justify-center items-center gap-1"
        >
          <span className="badge badge-sm badge-primary">{selectedTags.length}</span>
          <span>tags selected (max 5)</span>
        </motion.div>
      )}
    </div>
  );
};



export default VideoFilter;