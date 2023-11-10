const StudentAffairs = require('./model');
const path = require('path');
const fs = require('fs');
const config = require('../../config');
module.exports = {
    index: async(req,res) => {
        try {
            const kemahasiswaan = await StudentAffairs.find();
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");

            const alert = {message: alertMessage , status: alertStatus}
            res.render('admin/kemahasiswaan/view_kemahasiswaan', {
                title: 'Kemahasiswaan',
                kemahasiswaan,
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
            res.render('admin/kemahasiswaan/create', {
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
                        const kemahasiswaan = new StudentAffairs({
                            description , 
                            title ,
                            thumbnial: filename,
                        })

                        await kemahasiswaan.save();
                        req.flash('alertMessage',"Informasi Kemahasiswaan Berhasil di Tambahkan")
                        req.flash('alertStatus',"success")
                        res.redirect('/kemahasiswaan');
                    } catch (err) {
                      req.flash('alertMessage', `${err.message}`)
                      req.flash('alertStatus','danger')
                        res.redirect('/kemahasiswaan')
                        console.log(err) 
                    }
                })
            }
        } catch (err) {
            
            res.redirect('/kemahasiswaan')
            console.log(err)     
           }
    },
    viewEdit: async(req, res) => {
        try {
            const {id} = req.params
            const kemahasiswaan = await StudentAffairs.findOne({_id: id})
            res.render('admin/kemahasiswaan/edit', {
                kemahasiswaan,
                //name: req.session.user.name,
                 title: 'Edit'
            })
        } catch (err) {
           // req.flash('alertMessage', `${err.message}`)
            //req.flash('alertStatus','danger')
            res.redirect('/kemahasiswaan')
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
                  const kemahasiswaan = await StudentAffairs.findOne({ _id: id });
          
                  if (!kemahasiswaan) {
                    return res.status(404).send('Informasi Kemahasiswaan tidak ditemukan');
                  }
          
                  if (req.file) {
                    let currentImage = path.resolve(config.rootPath, `public/images/${kemahasiswaan.thumbnial}`);
                    if (fs.existsSync(currentImage)) {
                      fs.unlinkSync(currentImage);
                    }
                  }
          
                  await StudentAffairs.findOneAndUpdate(
                    { _id: id },
                    { description, title, thumbnial: req.file ? filename : kemahasiswaan.thumbnial }
                  );
                  req.flash('alertMessage',"Informasi Kemahasiswaan Berhasil di Ubah")
                  req.flash('alertStatus',"success")
                  res.redirect('/kemahasiswaan');
                } catch (err) {
                  console.error(err);
                  res.status(500).send('Terjadi kesalahan dalam mengupdate kemahasiswaan');
                }
              });
            } else {
              // Jika tidak ada berkas yang diunggah, perbarui hanya deskripsi dan judul
              const kemahasiswaan = await StudentAffairs.findOne({ _id: id });
          
              if (!kemahasiswaan) {
                return res.status(404).send('Informasi Kemahasiswaan tidak ditemukan');
              }
          
              await StudentAffairs.findOneAndUpdate(
                { _id: id },
                { description, title }
              );
              req.flash('alertMessage',"Informasi Kemahasiswaan Berhasil di Ubah")
              req.flash('alertStatus',"success")
              res.redirect('/kemahasiswaan');
            }
          } catch (err) {
            console.error(err);
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus','danger')
            res.status(500).send('Terjadi kesalahan dalam memproses permintaan');
          }
    },
    deleteKemahasiswaan : async (req, res) => {
        try {
          const { id } = req.params;
          const kemahasiswaan = await StudentAffairs.findOne({ _id: id });
      
          if (!kemahasiswaan) {
            console.log('StudentAffairs tidak ditemukan.');
            return res.status(404).send('StudentAffairs tidak ditemukan');
          }
      
          if (kemahasiswaan.thumbnial) {
            const imagePath = path.resolve(config.rootPath, `public/images/${kemahasiswaan.thumbnial}`);
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
              console.log('Berkas gambar dihapus.');
            }
          }
          
          await StudentAffairs.findOneAndDelete({ _id: id });
          req.flash('alertMessage',"Informasi Kemahasiswaan Berhasil di Hapus")
          req.flash('alertStatus',"success")
          console.log('StudentAffairs berhasil dihapus.');
          //req.flash('alertMessage',"StudentAffairs Berhasil di Hapus")
          //req.flash('alertStatus',"success")
          res.redirect('/kemahasiswaan');
        } catch (err) {
          req.flash('alertMessage', `${err.message}`)
          req.flash('alertStatus','danger')
          res.redirect('/kemahasiswaan');
          console.log(err);
        }
      },
      
}