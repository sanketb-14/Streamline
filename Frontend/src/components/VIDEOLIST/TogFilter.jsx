import { motion } from "framer-motion"
import { useSearchParams } from "react-router-dom"
import { useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight } from 'lucide-react'

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
]

export default function TagFilter() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedTags = searchParams.get('tags')?.split(',').filter(Boolean) || ['All']
  const scrollContainerRef = useRef(null)

  useEffect(() => {
    if (!searchParams.get('tags')) {
      setSearchParams({})
    }
  }, [setSearchParams])

  const handleTagClick = (tag) => {
    let newTags = [...selectedTags]

    if (tag === 'All') {
      setSearchParams({})
      return
    } else {
      newTags = newTags.filter(t => t !== 'All')

      if (newTags.includes(tag)) {
        newTags = newTags.filter(t => t !== tag)
        if (newTags.length === 0) {
          setSearchParams({})
          return
        }
      } else {
        if (newTags.length < 5) {
          newTags.push(tag)
        }
      }
    }

    setSearchParams({ tags: newTags.join(',') })
  }

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const isDefaultView = !searchParams.get('tags')

  return (
    <div className="relative mb-6">
      <motion.div 
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.1 }}
      >
        <button
          onClick={() => scroll('left')}
          className="p-2 rounded-full bg-base-200/80 text-base-content hover:bg-black"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </motion.div>

      <div 
        ref={scrollContainerRef}
        className="flex gap-2 py-2 overflow-x-auto scrollbar-hide relative"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="flex gap-5 px-4 md:px-12">
          {TAGS.map((tag) => (
            <motion.button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors
                ${(tag === 'All' && isDefaultView) || selectedTags.includes(tag)
                  ? 'bg-base-content text-base-200'
                  : 'bg-base-300 text-base-content hover:bg-base-300/75'
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
          className="p-2 rounded-full bg-base-200/80 text-base-content hover:bg-base-200"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </motion.div>

      {!isDefaultView && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-base-content text-center"
        >
          {selectedTags.length}/5 tags selected
        </motion.div>
      )}
    </div>
  )
}

