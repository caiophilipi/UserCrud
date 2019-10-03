const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

//Conexão com o banco de dados
mongoose.connect(
    "mongodb+srv://signaljr:signaljr@trainee-8oaih.mongodb.net/trainee?retryWrites=true&w=majority",
    {
         useCreateIndex: true,
         useFindAndModify: false,
         useUnifiedTopology: true,
         useNewUrlParser: true
    }
)

//Uso dos middlewares
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())


//Rotas
app.use( '/', require('./api/routes/usuario-routes') )
app.use((req, res) => res.json('Página não encontrada!') )

//Exportar o módulo
module.exports = app