const mongoose = require('mongoose')

const usuarioSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nome: {
        required: true,
        type: String,
    },
    email: {
        required: true,
        type: String,
    },
    senha: {
        required: true,
        type: String,
    },
})

module.exports = mongoose.model('Usuario', usuarioSchema)