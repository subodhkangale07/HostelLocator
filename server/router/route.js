const express = require('express');
const { sendOtp, signUp, login, updateProfileImage } = require('../controllers/Auth');
const {registerHostel, uploadHostelImages, getAllHostelsOfOwner, getHostelDetails, updateHostelOccupancy, updtaeHostelDetails, getAllHostels, searchHostels } = require('../controllers/Hostel');
const { auth, isHostel } = require('../middlewares/auth');
const { getProfileData, updateProfile } = require('../controllers/User');
const router = express.Router();

router.post('/sendOtp',sendOtp);
router.post('/signUp',signUp);
router.post('/login',login);
router.post('/updateProfileImage',updateProfileImage);
router.post('/registerHostel',auth,isHostel,registerHostel);
router.post('/uploadHostelImages',uploadHostelImages);
router.get('/getHostelsForOwner',auth,isHostel,getAllHostelsOfOwner);
router.get('/getHostelDetails',getHostelDetails);
router.post('/updateHostelOccupancy',updateHostelOccupancy);
router.post('/updateHostelDetails',updtaeHostelDetails);
router.get('/getAllHostels',getAllHostels);
router.post('/searchHostels',searchHostels);
router.post('/getProfileData',getProfileData);
router.post('/updateUserProfile',updateProfile);

module.exports = router;
