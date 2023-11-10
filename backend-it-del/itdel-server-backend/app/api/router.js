var express = require('express');
var router = express.Router();
const {beritaPage, kemahasiswaanPage, perpustakaanPage, bursarPage} = require('./controller');

router.get('/berita',beritaPage);
router.get('/kemahasiswaan',kemahasiswaanPage);
router.get('/perpustakaan',perpustakaanPage);
router.get('/bursar',bursarPage);

module.exports = router;
