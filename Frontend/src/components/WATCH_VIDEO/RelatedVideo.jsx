import { motion } from "framer-motion"
import {Link} from 'react-router-dom'


const RelatedVideoItem = ({ video }) => (
 
  
  <Link to={`/watch/${video._id}`}>
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex gap-2 mb-4 cursor-pointer"
  >
  
   <img src={video.thumbnail} className="w-40 h-24 bg-base-100 rounded-lg flex-shrink-0" />
    <div>
      <h4 className="font-medium line-clamp-2">{video.title}</h4>
      <p className="text-sm text-secondary/75 mt-1">{video.channelName}</p>
      <p className="text-sm text-gray-400">
        {video.views} • {video.uploadDate}
      </p>
    </div>
    </motion.div>
   </Link>
 
);

const RelatedVideos = ({ videos ,currentVideoId }) => {
  
 
  
  return (
    <div className="mt-6 lg:mt-0">
      <h3 className="text-lg font-medium mb-4">Related Videos</h3>
      <div>
        {/* {videos.map((video, index) => (
          <RelatedVideoItem key={video._id || index} video={video} />
        ))} */}
        {videos.filter((video) => video._id !== currentVideoId).map((video, index) => (
          <RelatedVideoItem key={video._id || index} video={video} />
        ))}
      </div>
    </div>
  );
};


export default RelatedVideos

