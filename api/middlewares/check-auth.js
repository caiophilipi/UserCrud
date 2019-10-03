//Aqui iremos criar o nosso model, que vai checar se a requisição que foi recebida tem um token.
//Se existir um token ele deixa o usuário fazer o que quiser, se não ele manda uma msg de erro e diz que precisa de uma autenticação.
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {

    try {
        
        const token = req.headers.authorization.split(' ')[1] //aqui estou selecionando o segundo valor da string criada token
        const tokenDecodificado = jwt.verify(token, process.env.JWT_KEY)
        req.dadosUsuario = tokenDecodificado
        next() //Essa função existe porque nós vamos usar esse check-auth em lugares específicos, no caso na rota em listar, editar e excluir.

    } catch (mensagemErro) {
        console.log(mensagemErro)
        return res.json({ erro: true, mensagemErro:'Erro na autenticação!' })
        
    }
}

