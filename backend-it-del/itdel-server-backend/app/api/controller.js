const Berita = require('../berita/model');
const Kemahasiswaan = require('../kemahasiswaan/model');
const Perpustakaan = require('../perpustakaan/model');
const Bursar = require('../bursar/model');

module.exports = {
    beritaPage : async(req,res) => {
        try {
            const berita = await Berita.find()
            res.status(200).json({berita})
        } catch (err) {
            res.status(500).json({message: err.message} || `Internal Server Error`)
        }
    },
    kemahasiswaanPage : async(req,res) => {
        try {
            const kemahasiswaan = await Kemahasiswaan.find()
            res.status(200).json({kemahasiswaan})
        } catch (err) {
            res.status(500).json({message: err.message} || `Internal Server Error`)
        }
    },
    perpustakaanPage : async(req,res) => {
        try {
            const perpustakaan = await Perpustakaan.find()
            res.status(200).json({perpustakaan})
        } catch (err) {
            res.status(500).json({message: err.message} || `Internal Server Error`)
        }
    },
    bursarPage : async(req,res) => {
        try {
            const bursar = await Bursar.find()
            res.status(200).json({bursar})
        } catch (err) {
            res.status(500).json({message: err.message} || `Internal Server Error`)
        }
    },
}