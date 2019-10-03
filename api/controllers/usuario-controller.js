const ModelUsuario = require('./../models/usuario-model')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.listar = async (req, res) => {

    try {
        const usuarios = await ModelUsuario.find()
        return res.json({ usuarios })
    } catch (mensagemErro) {
        console.log(mensagemErro)
        return res.json({ erro: true, mensagemErro })
    }
}

exports.cadastrar = async (req,res) => {

    const { nome, email, senha } = req.body
    
    if (nome === '' || nome === null || nome === undefined) {
        console.log('O campo nome é obrigatório!')
        return res.json({ erro: true, mensagemErro: 'O campo nome é obrigatório!' })       
    }

    if (email === '' || email === null || email === undefined) {
        console.log('O campo email é obrigatório!')
        return res.json({ erro: true, mensagemErro: 'O campo email é obrigatório!' })
    } 
     
    if (senha === '' || senha === null || senha === undefined) {
        console.log('O campo senha é obrigatório!')
        return res.json({ erro: true, mensagemErro: 'O campo senha é obrigatório!' })
    }

    try {

        const usuario = await ModelUsuario.findOne({ email })
        if (usuario) {
            return res.json({ erro: true, mensagemErro: 'Email em uso!'})
        }

        bcrypt.hash(senha, 10, async (erro,hash) => {

            if (erro) return res.json({ erro: true, mensagemErro: erro })
            
            const usuario = await ModelUsuario.create({
                ...req.body,
                senha: hash,
                _id: new mongoose.Types.ObjectId()
            })

            return res.json({ usuario })
                
         })

        } catch (mensagemErro) {
            console.log(mensagemErro)
            return res.json({ erro: true, mensagemErro })
        }
}                

exports.logar = async (req, res) => {

    const { email, senha } = req.body

    if (email === '' || email === null || email === undefined) {
        console.log('O campo email é obrigatório!')
        return res.json({ erro: true, mensagemErro: 'O campo email é obrigatório!' })
    }

    if (senha === '' || senha === null || senha === undefined) {
        console.log('O campo senha é obrigatório!')
        return res.json({ erro: true, mensagemErro: 'O campo senha é obrigatório!' })
    }
    
    try {

        const usuario = await ModelUsuario.findOne({ email })
        if (!usuario) { //o ponto de exclamação indica que a próxima afirmação é ao contrário do que ela é, assim se o usuário NÃO existe tem o return
            console.log('Usuário não existe')
            return res.json({ erro: true, mensagemErro:'Email e/ou senha incorretos!' })
        }
        // como a senha está criptografada nós não podemos simplesmente pegá-la, nós temos que comparar
        // esse usuario é um objeto, para acessarmos a senha dentro dele usamos o .senha
        bcrypt.compare(senha, usuario.senha, (mensagemErro, resultado) => {

            if (mensagemErro) {
                console.log('Email e/ou senha incorretos!')
                return res.json({ erro: true, mensagemErro:'Email e/ou senha incorretos!' })
                
            }

            if (resultado) {
                
                const token = jwt.sign(
                    {
                        email: usuario.email,
                        _id: usuario._id
                    },
                    process.env.JWT_KEY,
                    { 
                        expiresIn: 86400 
                    }
                )

                return res.json({ token })
                
            } else {
                console.log('Email e/ou senha incorretos!')
                res.json({ erro: true, mensagemErro: "Email e/ou senha incorretos!" })
            }
        })     
        

    } catch (mensagemErro) {
       console.log(mensagemErro)
       return res.json({ erro: true, mensagemErro })
    }

}

exports.editar = async (req, res) => {   
    
    const { nome, email } = req.body
    const { _id } = req.params

    try {

       const usuario = await ModelUsuario.findByIdAndUpdate(
            { _id },
            { nome, email },
            { new: true }
        )

        if (!usuario) {
            return res.json({ erro: true, mensagemErro:'Usuário não encontrado!' })
            
        }

        return res.json('Usuário editado com sucesso!')

    } catch (mensagemErro) {
        console.log(mensagemErro)
        return res.json({ erro: true, mensagemErro })
    }

}

exports.excluir = async (req, res) => {
    
    const { _id } = req.params

    try {

        const usuario = await ModelUsuario.findOne({ _id })

        if (!usuario) {
            return res.json({ erro: true, mensagemErro: 'Usuário inexistente!' })

        }
        await ModelUsuario.deleteOne({ _id })
        return res.json('Usuário Deletado!')

    } catch (mensagemErro) {
        console.log(mensagemErro)
        return res.json({ erro: true, mensagemErro })
    }
    
}