const LoadingSkeleton = () => {
    return (
      <div className="w-full animate-pulse">
        {/* Banner Skeleton */}
        <div className="w-full h-48 bg-base-300 rounded-b-lg" />
        
        {/* Profile Section Skeleton */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6 -mt-6 md:-mt-8">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-base-300" />
            <div className="flex-1 space-y-4 py-4">
              <div className="h-8 bg-base-300 rounded w-3/4" />
              <div className="space-y-2">
                <div className="h-4 bg-base-300 rounded w-1/2" />
                <div className="h-4 bg-base-300 rounded w-1/3" />
              </div>
            </div>
          </div>
        </div>
  
        {/* Videos Grid Skeleton */}
        <div className="max-w-7xl mx-auto px-4 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-video bg-base-300 rounded-lg" />
                <div className="space-y-2">
                  <div className="h-4 bg-base-300 rounded w-3/4" />
                  <div className="h-4 bg-base-300 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  export default LoadingSkeleton
  
  