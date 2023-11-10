const Bursar = require('./model');
const path = require('path');
const fs = require('fs');
const config = require('../../config');
module.exports = {
    index: async(req,res) => {
        try {
            const bursar = await Bursar.find();
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");

            const alert = {message: alertMessage , status: alertStatus}
            res.render('admin/bursar/view_bursar', {
                title: 'Bursar',
                bursar,
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
            res.render('admin/bursar/create', {
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
                        const bursar = new Bursar({
                            description , 
                            title,
                            thumbnial: filename,
                        })

                        await bursar.save();
                        req.flash('alertMessage',"Informasi Bursar Berhasil di Tambahkan")
                        req.flash('alertStatus',"success")
                        res.redirect('/bursar');
                    } catch (err) {
                      req.flash('alertMessage', `${err.message}`)
                      req.flash('alertStatus','danger')
                        res.redirect('/bursar')
                        console.log(err) 
                    }
                })
            }
        } catch (err) {
            
            res.redirect('/bursar')
            console.log(err)     
           }
    },
    viewEdit: async(req, res) => {
        try {
            const {id} = req.params
            const bursar = await Bursar.findOne({_id: id})
            res.render('admin/bursar/edit', {
              bursar,
                //name: req.session.user.name,
                 title: 'Edit'
            })
        } catch (err) {
           // req.flash('alertMessage', `${err.message}`)
            //req.flash('alertStatus','danger')
            res.redirect('/bursar')
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
                  const bursar = await Bursar.findOne({ _id: id });
          
                  if (!bursar) {
                    return res.status(404).send('Informasi Bursar tidak ditemukan');
                  }
          
                  if (req.file) {
                    let currentImage = path.resolve(config.rootPath, `public/images/${bursar.thumbnial}`);
                    if (fs.existsSync(currentImage)) {
                      fs.unlinkSync(currentImage);
                    }
                  }
          
                  await Bursar.findOneAndUpdate(
                    { _id: id },
                    { description, title, thumbnial: req.file ? filename : bursar.thumbnial }
                  );
                  req.flash('alertMessage',"Informasi Bursar Berhasil di Ubah")
                  req.flash('alertStatus',"success")
                  res.redirect('/bursar');
                } catch (err) {
                  console.error(err);
                  res.status(500).send('Terjadi kesalahan dalam mengupdate bursar');
                }
              });
            } else {
              // Jika tidak ada berkas yang diunggah, perbarui hanya deskripsi dan judul
              const bursar = await Bursar.findOne({ _id: id });
              
              if (!bursar) {
                return res.status(404).send('Informasi Bursar tidak ditemukan');
              }
          
              await Bursar.findOneAndUpdate(
                { _id: id },
                { description, title }
              );
              req.flash('alertMessage',"Informasi Bursar Berhasil di Ubah")
              req.flash('alertStatus',"success")
              res.redirect('/bursar');
            }
          } catch (err) {
            console.error(err);
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus','danger')
            res.status(500).send('Terjadi kesalahan dalam memproses permintaan');
          }
    },
    deleteBursar : async (req, res) => {
        try {
          const { id } = req.params;
          const bursar = await Bursar.findOne({ _id: id });
      
          if (!bursar) {
            console.log('Bursar tidak ditemukan.');
            return res.status(404).send('Bursar tidak ditemukan');
          }
      
          if (bursar.thumbnial) {
            const imagePath = path.resolve(config.rootPath, `public/images/${bursar.thumbnial}`);
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
              console.log('Berkas gambar dihapus.');
            }
          }
          
          await Bursar.findOneAndDelete({ _id: id });
          req.flash('alertMessage',"Informasi Bursar Berhasil di Hapus")
          req.flash('alertStatus',"success")
          console.log('bursar berhasil dihapus.');
          //req.flash('alertMessage',"bursar Berhasil di Hapus")
          //req.flash('alertStatus',"success")
          res.redirect('/bursar');
        } catch (err) {
          req.flash('alertMessage', `${err.message}`)
          req.flash('alertStatus','danger')
          res.redirect('/bursar');
          console.log(err);
        }
      },
      
}