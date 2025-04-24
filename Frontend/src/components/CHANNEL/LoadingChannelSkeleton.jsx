import { FiUser, FiVideo } from 'react-icons/fi';

/**
 * LoadingSkeleton - A responsive skeleton loader component for profile and video content.
 * Uses DaisyUI colors for consistent theming and includes subtle animations.
 * 
 * Features:
 * - Responsive layout (mobile/desktop)
 * - DaisyUI color scheme integration
 * - Subtle pulse animation
 * - Semantic structure
 * - Placeholder icons for better UX
 */
const LoadingSkeleton = () => {
  return (
    <div className="w-full animate-pulse space-y-8">
      {/* Banner Section */}
      <div className="w-full h-48 bg-base-300 rounded-b-lg" />
      
      {/* Profile Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6 -mt-6 md:-mt-8">
          {/* Profile Picture Placeholder with Icon */}
          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-base-300 flex items-center justify-center">
            <FiUser className="text-4xl text-base-content/20" />
          </div>
          
          {/* Profile Info Placeholder */}
          <div className="flex-1 space-y-4 py-4">
            <div className="h-8 bg-base-300 rounded w-3/4" />
            <div className="space-y-2">
              <div className="h-4 bg-base-300 rounded w-1/2" />
              <div className="h-4 bg-base-300 rounded w-1/3" />
            </div>
          </div>
        </div>
      </section>

      {/* Videos Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <article key={i} className="space-y-4">
              {/* Video Thumbnail Placeholder with Icon */}
              <div className="aspect-video bg-base-300 rounded-lg flex items-center justify-center">
                <FiVideo className="text-5xl text-base-content/20" />
              </div>
              
              {/* Video Info Placeholder */}
              <div className="space-y-2">
                <div className="h-4 bg-base-300 rounded w-3/4" />
                <div className="h-4 bg-base-300 rounded w-1/2" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LoadingSkeleton;