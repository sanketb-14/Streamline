import express from 'express';
import * as videoController from '../controllers/videoController.js';
import { likeComment,likeVideo,dislikeComment,dislikeVideo,getVideoComments,createComment,deleteComment } from '../controllers/videoInteraction.js';
import { protect } from '../controllers/authController.js';

const router = express.Router();

router.get('/' , videoController.getAllVideos)
router.get('/tags/:tag' , videoController.getVideosByTag )

router.post(
  '/',
  protect,
  videoController.ensureUserHasChannel ,
  videoController.validateTags ,
  videoController.uploadVideo,
  videoController.processVideo,
  videoController.createVideo
);

router.get('/:id', videoController.getVideo);
router.get('/:videoId/comments', getVideoComments);
router.use(protect)
router.route('/:id').patch(videoController.validateTags, videoController.updateVideo).delete( videoController.deleteVideo);


router.post('/:id/like', likeVideo);
router.post('/:id/dislike',  dislikeVideo);

router.post('/:videoId/comments',  createComment);

router.delete('/comments/:commentId',  deleteComment);

router.post('/comments/:commentId/like',  likeComment);
router.post('/comments/:commentId/dislike',  dislikeComment);

export default router;