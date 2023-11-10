const Berita = require('./model');
const path = require('path');
const fs = require('fs');
const config = require('../../config');
module.exports = {
    index: async(req,res) => {
        try {
            const berita = await Berita.find();
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");

            const alert = {message: alertMessage , status: alertStatus}
            res.render('admin/berita/view_berita', {
                title: 'Berita',
                berita,
                alert
            });
        } catch (err) {
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus','danger')
            console.log(err);
        }
    },
    viewCreate: async(req,res) => {
        try {
            res.render('admin/berita/create', {
                title: 'Create'
            });
        } catch (err) {
            console.log(err);
        }
    },
    actionCreate: async(req, res) => {
        try {
            const {description , title } = req.body

            if(req.file) {
                let tmp_path = req.file.path;
                let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
                let filename = req.file.filename + '.' + originalExt;
                let target_path = path.resolve(config.rootPath, `public/images/${filename}`)
                const src = fs.createReadStream(tmp_path);
                const dest = fs.createWriteStream(target_path);

                src.pipe(dest)

                src.on('end', async ()=> {
                    try {
                        const berita = new Berita({
                            description , 
                            title ,
                            thumbnial: filename,
                        })

                        await berita.save();
                        req.flash('alertMessage',"Berita Berhasil di Tambahkan")
                        req.flash('alertStatus',"success")
                        res.redirect('/berita');
                    } catch (err) {
                        req.flash('alertMessage', `${err.message}`)
                        req.flash('alertStatus','danger')
                        res.redirect('/berita')
                        console.log(err) 
                    }
                })
            }
        } catch (err) {
            
            res.redirect('/berita')
            console.log(err)     
           }
    },
    viewEdit: async(req, res) => {
        try {
            const {id} = req.params
            const berita = await Berita.findOne({_id: id})
            res.render('admin/berita/edit', {
                berita,
                //name: req.session.user.name,
                 title: 'Edit'
            })
        } catch (err) {
           // req.flash('alertMessage', `${err.message}`)
            //req.flash('alertStatus','danger')
            res.redirect('/berita')
            console.log(err)      
          }
    },
    ActionEdit: async(req, res) => {
        try {
            const { id } = req.params;
            const { description, title } = req.body;
          
            if (req.file) {
              const tmp_path = req.file.path;
              const originalExt = path.extname(req.file.originalname);
              const filename = req.file.filename + originalExt;
              const target_path = path.resolve(config.rootPath, `public/images/${filename}`);
          
              const src = fs.createReadStream(tmp_path);
              const dest = fs.createWriteStream(target_path);
          
              src.pipe(dest);
          
              src.on('end', async () => {
                try {
                  const berita = await Berita.findOne({ _id: id });
          
                  if (!berita) {
                    return res.status(404).send('Berita tidak ditemukan');
                  }
          
                  if (req.file) {
                    let currentImage = path.resolve(config.rootPath, `public/images/${berita.thumbnial}`);
                    if (fs.existsSync(currentImage)) {
                      fs.unlinkSync(currentImage);
                    }
                  }
          
                  await Berita.findOneAndUpdate(
                    { _id: id },
                    { description, title, thumbnial: req.file ? filename : berita.thumbnial }
                  );
                  req.flash('alertMessage',"Berita Berhasil di Ubah")
                  req.flash('alertStatus',"success")
                  res.redirect('/berita');
                } catch (err) {
                  console.error(err);
                  req.flash('alertMessage', `${err.message}`)
                  req.flash('alertStatus','danger')
                  res.status(500).send('Terjadi kesalahan dalam mengupdate berita');
                }
              });
            } else {
              // Jika tidak ada berkas yang diunggah, perbarui hanya deskripsi dan judul
              const berita = await Berita.findOne({ _id: id });
              if (!berita) {
                return res.status(404).send('Berita tidak ditemukan');
              }
          
              await Berita.findOneAndUpdate(
                { _id: id },
                { description, title }
              );
              req.flash('alertMessage',"Berita Berhasil di Ubah")
              req.flash('alertStatus',"success")
              res.redirect('/berita');
            }
          } catch (err) {
            console.error(err);
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus','danger')
            res.status(500).send('Terjadi kesalahan dalam memproses permintaan');
          }
    },
    deleteBerita: async (req, res) => {
        try {
          const { id } = req.params;
          const berita = await Berita.findOne({ _id: id });
      
          if (!berita) {
            console.log('Berita tidak ditemukan.');
            return res.status(404).send('Berita tidak ditemukan');
          }
      
          if (berita.thumbnial) {
            const imagePath = path.resolve(config.rootPath, `public/images/${berita.thumbnial}`);
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
              console.log('Berkas gambar dihapus.');
            }
          }
          await Berita.findOneAndDelete({ _id: id });
          req.flash('alertMessage',"Berita Berhasil di Hapus")
          req.flash('alertStatus',"success")
          console.log('Berita berhasil dihapus.');
          //req.flash('alertMessage',"Berita Berhasil di Hapus")
          //req.flash('alertStatus',"success")
          res.redirect('/berita');
        } catch (err) {
          req.flash('alertMessage', `${err.message}`)
          req.flash('alertStatus','danger')
          res.redirect('/berita');
          console.log(err);
        }
      },
      
}