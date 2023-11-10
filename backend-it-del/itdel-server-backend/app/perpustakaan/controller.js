const librarySchema = require('./model');
const path = require('path');
const fs = require('fs');
const config = require('../../config');
module.exports = {
    index: async(req,res) => {
        try {
            const perpustakaan = await librarySchema.find();
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");

            const alert = {message: alertMessage , status: alertStatus}
            res.render('admin/perpustakaan/view_perpustakaan', {
                title: 'Perpustakaan',
                perpustakaan,
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
            res.render('admin/perpustakaan/create', {
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
                        const perpustakaan = new librarySchema({
                            description , 
                            title ,
                            thumbnial: filename,
                        })

                        await perpustakaan.save();
                        req.flash('alertMessage',"Informasi Perpustakaan Berhasil di Tambahkan")
                        req.flash('alertStatus',"success")
                        res.redirect('/perpustakaan');
                    } catch (err) {
                      req.flash('alertMessage', `${err.message}`)
                      req.flash('alertStatus','danger')
                        res.redirect('/perpustakaan')
                        console.log(err) 
                    }
                })
            }
        } catch (err) {
            
            res.redirect('/perpustakaan')
            console.log(err)     
           }
    },
    viewEdit: async(req, res) => {
        try {
            const {id} = req.params
            const perpustakaan = await librarySchema.findOne({_id: id})
            res.render('admin/perpustakaan/edit', {
              perpustakaan,
                //name: req.session.user.name,
                 title: 'Edit'
            })
        } catch (err) {
           // req.flash('alertMessage', `${err.message}`)
            //req.flash('alertStatus','danger')
            res.redirect('/perpustakaan')
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
                  const perpustakaan = await librarySchema.findOne({ _id: id });
          
                  if (!perpustakaan) {
                    return res.status(404).send('Informasi Perpustakaan tidak ditemukan');
                  }
          
                  if (req.file) {
                    let currentImage = path.resolve(config.rootPath, `public/images/${perpustakaan.thumbnial}`);
                    if (fs.existsSync(currentImage)) {
                      fs.unlinkSync(currentImage);
                    }
                  }
          
                  await librarySchema.findOneAndUpdate(
                    { _id: id },
                    { description, title, thumbnial: req.file ? filename : perpustakaan.thumbnial }
                  );
                  req.flash('alertMessage',"Informasi Perpustakaan Berhasil di Ubah")
                  req.flash('alertStatus',"success")
                  res.redirect('/perpustakaan');
                } catch (err) {
                  console.error(err);
                  res.status(500).send('Terjadi kesalahan dalam mengupdate perpustakaan');
                }
              });
            } else {
              // Jika tidak ada berkas yang diunggah, perbarui hanya deskripsi dan judul
              const perpustakaan = await librarySchema.findOne({ _id: id });
          
              if (!perpustakaan) {
                return res.status(404).send('Informasi Perpustakaan tidak ditemukan');
              }
          
              await librarySchema.findOneAndUpdate(
                { _id: id },
                { description, title }
              );
              req.flash('alertMessage',"Informasi Perpustakaan Berhasil di Ubah")
              req.flash('alertStatus',"success")
              res.redirect('/perpustakaan');
            }
          } catch (err) {
            console.error(err);
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus','danger')
            res.status(500).send('Terjadi kesalahan dalam memproses permintaan');
          }
    },
    deletePerpustakaan : async (req, res) => {
        try {
          const { id } = req.params;
          const perpustakaan = await librarySchema.findOne({ _id: id });
      
          if (!perpustakaan) {
            console.log('Perpustakaan tidak ditemukan.');
            return res.status(404).send('Perpustakaan tidak ditemukan');
          }
      
          if (perpustakaan.thumbnial) {
            const imagePath = path.resolve(config.rootPath, `public/images/${perpustakaan.thumbnial}`);
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
              console.log('Berkas gambar dihapus.');
            }
          }
          
          await librarySchema.findOneAndDelete({ _id: id });
          req.flash('alertMessage',"Informasi Perpustakaan Berhasil di Hapus")
          req.flash('alertStatus',"success")
          console.log('librarySchema berhasil dihapus.');
          //req.flash('alertMessage',"librarySchema Berhasil di Hapus")
          //req.flash('alertStatus',"success")
          res.redirect('/perpustakaan');
        } catch (err) {
          req.flash('alertMessage', `${err.message}`)
          req.flash('alertStatus','danger')
          res.redirect('/perpustakaan');
          console.log(err);
        }
      },
      
}