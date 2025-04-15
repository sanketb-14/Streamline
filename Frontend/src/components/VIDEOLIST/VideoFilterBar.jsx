import React, { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

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

const VideoFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const scrollContainerRef = useRef(null);
  const selectedTags = searchParams.get('tags')?.split(',').filter(Boolean) || ['All'];



  const handleSort = (sortValue) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', sortValue);
    setSearchParams(params);
  };

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

  const handleViewsRangeChange = (e) => {
    const params = new URLSearchParams(searchParams);
    params.set('viewsRange', e.target.value);
    setSearchParams(params);
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Search and Sort Bar */}
      <div className="flex items-center gap-4">
      
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="p-2 rounded-lg bg-base-200 flex tracking-widest  items-center hover:bg-base-300 transition-colors"
        >
          <Filter className="w-5 h-5 mx-2" />Filter
        </button>
        <select
          onChange={(e) => handleSort(e.target.value)}
          className="p-2 rounded-lg bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary"
          defaultValue={searchParams.get('sort') || 'newest'}
        >
          <option value="newest">Newest</option>
          <option value="popular">Most Popular</option>
          <option value="mostLiked">Most Liked</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      {/* Tag Scrolling Section */}
      <div className="relative">
        <motion.div 
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.1 }}
        >
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-base-200/80 hover:bg-base-300 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </motion.div>

        <div 
          ref={scrollContainerRef}
          className="flex gap-2 py-2 overflow-x-auto scrollbar-hide relative"
        >
          <div className="flex gap-5 px-4 md:px-12">
            {TAGS.map((tag) => (
              <motion.button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors
                  ${(tag === 'All' && !searchParams.get('tags')) || selectedTags.includes(tag)
                    ? 'bg-primary text-primary-content'
                    : 'bg-base-200 text-base-content hover:bg-base-300'
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

        <motion.div 
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.1 }}
        >
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-base-200/80 hover:bg-base-300 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>

      {/* Advanced Filters */}
      {isFilterOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-base-200 rounded-lg"
        >
          <div className="space-y-2">
            <h3 className="font-medium">Date Range</h3>
            <div className="flex gap-2">
              <input
                type="date"
                className="w-full p-2 rounded bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary"
                onChange={(e) => handleDateRangeChange(e, 'start')}
              />
              <input
                type="date"
                className="w-full p-2 rounded bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary"
                onChange={(e) => handleDateRangeChange(e, 'end')}
              />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Views Range</h3>
            <select
              className="w-full p-2 rounded bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary"
              onChange={handleViewsRangeChange}
              defaultValue={searchParams.get('viewsRange') || ''}
            >
              <option value="">All</option>
              <option value="0,1000">0-1K views</option>
              <option value="1000,10000">1K-10K views</option>
              <option value="10000,100000">10K-100K views</option>
              <option value="100000,">100K+ views</option>
            </select>
          </div>
        </motion.div>
      )}

      {selectedTags.length > 0 && selectedTags[0] !== 'All' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-base-content/70 text-center"
        >
          {selectedTags.length}/5 tags selected
        </motion.div>
      )}
    </div>
  );
};

export default VideoFilter;