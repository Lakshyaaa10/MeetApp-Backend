const express = require("express");
const router = express.Router();

const {createMeeting, checkLink}= require('../zoom/Meeting');
const { createUser, Login, getMachineId } = require("../controller/Login");

router.post('/createMeeting',createMeeting)
router.post('/checkLink',checkLink)
router.post('/newUser',createUser)
router.post('/login',Login)
router.post('/getMachineId',getMachineId)
module.exports = router;