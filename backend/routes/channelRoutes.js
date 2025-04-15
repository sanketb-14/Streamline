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


// {
//     "_id": "6719214df4b66606a582df6e",
//     "title": "Medical Health Care Doctor Hospital",
//     "description": "Explore the essential roles of doctors and hospitals in medical health care. Discover how they work together to provide quality treatment and improve patient outcomes.",
//     "views": 6,
//     "createdAt": "2024-10-23T16:16:13.507Z"
// }