var express = require('express');
var router = express.Router();
const multer = require('multer');
const os = require('os')
const {index, viewCreate, actionCreate,  viewEdit, ActionEdit, deleteBursar} = require('./controller');

/* GET home page. */
router.get('/', index);
router.get('/create', viewCreate);
router.post('/create',  multer({dest: os.tmpdir()}).single('thumbnial'), actionCreate);
router.get('/edit/:id', viewEdit);
router.put('/edit/:id', multer({dest: os.tmpdir()}).single('thumbnial'), ActionEdit);
router.delete('/delete/:id',deleteBursar);

module.exports = router;
