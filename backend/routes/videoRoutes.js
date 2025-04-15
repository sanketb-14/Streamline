import express from 'express';
import * as videoController from '../controllers/videoController.js';
import { likeComment,likeVideo,dislikeComment,dislikeVideo,getVideoComments,createComment,deleteComment } from '../controllers/videoInteraction.js';
import { protect, restrict } from '../controllers/authController.js';

const router = express.Router();


router.get('/trending', videoController.aliasTrendingVideos, videoController.getAllVideos);
router.get('/stats/overview', videoController.getVideoStats);
router.get
router.get('/stats/channel/:channelId', videoController.getChannelVideoStats);
router.get('/' , videoController.getAllVideos)
router.get('/tags/:tag' , videoController.getVideosByTag )
router.get('/suggestions' , videoController.videoSuggestions )


router.post(
  '/',
  protect,
  videoController.ensureUserHasChannel ,
  videoController.validateTags ,
  videoController.uploadVideo,
  videoController.processVideo,
  videoController.createVideo
);

router.get('/:videoId', videoController.getVideo);
router.get('/:videoId/comments', getVideoComments);
router.use(protect)
router.route('/:id').patch(videoController.validateTags, videoController.updateVideo).delete( videoController.deleteVideo);


router.post('/:videoId/like', likeVideo);
router.post('/:videoId/dislike',  dislikeVideo);

router.post('/:videoId/comments',  createComment);

router.delete('/comments/:commentId',  deleteComment);

router.post('/comments/:commentId/like',  likeComment);
router.post('/comments/:commentId/dislike',  dislikeComment);

router.use(restrict('admin'))
router.post('/sync-channel-videos' , videoController.syncChannelVideos)



export default router;