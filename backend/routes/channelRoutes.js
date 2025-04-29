import express from 'express'

const router = express.Router()

import { getChannelDetail , getChannelByName , updateChannel , checkChannelOwnership, createChannel, subscribeChannel, unsubscribeChannel, getChannelSubscribers } from '../controllers/channelController.js'
import { protect } from '../controllers/authController.js';

router.route('/:channelId').get(getChannelDetail);

router.get("/:channelId/subscribers" , getChannelSubscribers)
router.get('/name/:channelName', getChannelByName);
router.use(protect)
router.post('/' , createChannel)
router.route('/:channelId/subscribe').post(subscribeChannel).delete(unsubscribeChannel)
router.patch('/:channelId', checkChannelOwnership, updateChannel);

export default router


