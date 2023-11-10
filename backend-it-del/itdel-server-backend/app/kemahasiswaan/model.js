const mongoose = require('mongoose');
let StudentAffairsSchema = mongoose.Schema({
    title : {
        type: String,
        required : [true, 'Judul Harus Diisi']
    },
    description : {
        type: String,
        required : [true, 'Deskripsi Harus Diisi']
    },
    thumbnial : {
        type : String,
    }
},
{timestamps: true}
)
module.exports = mongoose.model('StudentAffairs' , StudentAffairsSchema);