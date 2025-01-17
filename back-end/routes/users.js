var express = require('express');

var router = express.Router();
var  {signup,hasUsername,signin,issignin,signout,sendEmail,hasEmail,findpassword} = require('../controller/users') 
/* GET users listing. */
router.post('/signup',hasUsername,signup);
router.post('/signin',signin);
router.get('/issignin',issignin);
router.get('/signout',signout);
router.post('/sendEmail',hasEmail,sendEmail)
router.post('/findpassword',findpassword)

module.exports = router;
