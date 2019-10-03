import React from 'react'
import { login } from './../services/auth' //o logout não é default, por isso estamos importante ele dentro de chaves, pois ali dentro tem várias coisas. 
import api from './../services/api'  //o api nós exportamos ele como default pq ele só tem uma coisa lá no api.js 
import {
    Navbar,
    NavbarBrand, // é onde fica a logo da empresa
    Nav,
    NavLink, // é o link que vai dentro dos nav itens
    NavItem,  //basicamente é um botão no nav
    Col,
    Form,
    FormGroup,
    Label,
    Button,
    Input,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Alert
} from 'reactstrap'

export default class Login extends React.Component { //aqui dentro vai ficar nossa aplicação
    
    constructor(props) {
        super(props)

        this.state = { //todas as variáveis que são dinâmicas vão ficar aqui, como por exemplo butões, informações, etc
            modal: false, //boolean (pode ser true ou false)
            erro:'',  //vai receber a mensagem de erro que pode deixar na tela
            usuarios: [], //vetor usa colchetes, esse vetor lista todos os usuarios
            usuario: { //usado para mostrar um usuário específico
                _id:'',
                nome:'',
                email:'',
                senha:''
            }

        }
    }

    

    renderNavbar = () => { //a barra de cima que teremos na página de login
        return (
            <Navbar expand = "md" color = "navbar navbar-dark bg-dark" >
                <NavbarBrand  href="/"> Signal Jr </NavbarBrand>
                <Nav className="ml-auto" navbar>
                    <NavItem>
                        <NavLink target="_blank" href="https://github.com/arthurmfgtab/trainee-signal-2019.2">
                            <Button color="light" outline> GitHub </Button>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink target="_blank" href="https://www.signaljunior.com.br">
                            <Button color="light" outline> Signal Jr Page </Button>
                        </NavLink>
                    </NavItem>
                 </Nav>  
             </Navbar>
        )
    }

    renderFormLogin = () => { // estrutura de login da página
        return (
            <div className="container-fluid" style={{ marginTop: 40 }} >
                <div className="d-flex flex-row align-items-center justify-content-center">
                    <div
                        className="bg-light"
                        style={{
                            border: '1px solid #000',
                            borderRadius: 15,
                            padding: 20,
                            paddingTop: 30,
                            paddingBottom: 30,
                            display: 'flex'



                        }}>
                        <img style={{ widht: 200, height: 200, paddingRight: 20, paddingTop: 10 }} alt="avatar" src='https://cdn.discordapp.com/attachments/489986023497924611/629368780988088320/token_1.png'/>          
                            
                            <Form onSubmit={ this.enviarFormLogin }>

                                {
                                    (this.state.erro) ? <Alert color="danger" > { this.state.erro } </Alert>: null
                                }

                                 <FormGroup row>
                                     <Label sm={ 2 }> Email</Label>
                                     <Col><Input onChange={ this.atualizarCampo } type="email" name="email" placeholder="Informe o seu email..." /></Col>
                                 </FormGroup>

                                <FormGroup row>
                                    <Label sm={2}> Senha </Label>
                                <Col><Input onChange={this.atualizarCampo} type="password" name="senha" placeholder="Informe a sua senha..." /></Col>
                                </FormGroup>

                                <br/>

                                <div className="d-flex flex-column">
                                    <Button color="dark">Entrar</Button> <br/>
                                    <Button color="dark" outline onClick={ this.alternarModal }>Cadastre-se</Button>

                                </div>

                            </Form>

                    </div>

                </div>

            </div>
        )
    }

    renderModalCadastrar = () => { //vai ser o modal que a gente vai setar para abrir e fechar quando clicarmos em Cadastre-se
        return ( //esse modal vai abrir quando o state dele estiver em true, o modal isOpen faz com que ele feche quando clicamos fora dela, o modalHeader faz com que tenhamos um X no topo do modal que ao clicar ele feche, e o modalToggle faz com que ao clicarmos em cancelar ele feche
            <Modal isOpen={ this.state.modal} toggle={ this.alternarModal}>
                <ModalHeader toggle={ this.alternarModal }> Cadastro de Usuário </ModalHeader> 
                <ModalBody>

                <Form onSubmit={ this.enviarFormCadastro }>    
                    <FormGroup row>
                         <Label sm={2}> Nome</Label> 
                         <Col><Input onChange={ this.atualizarCampo } type="text" name="nome" placeholder="Informe o seu nome..." /></Col>
                    </FormGroup>
                    <FormGroup row>
                         <Label sm={2}> Email</Label>
                         <Col><Input onChange={this.atualizarCampo} type="email" name="email" placeholder="Informe o seu email..." /></Col>
                    </FormGroup>

                    <FormGroup row>
                         <Label sm={2}> Senha </Label>
                         <Col><Input onChange={this.atualizarCampo} type="password" name="senha" placeholder="Informe a sua senha..." /></Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label sm={2}> Confirmar Senha </Label>
                        <Col><Input onChange={this.atualizarCampo} type="password" name="senha" placeholder="Confirme sua senha..." /></Col>
                    </FormGroup>

                     <ModalFooter>
                         <Button type="submit" color="primary" >Cadastrar</Button>{''}
                         <Button color="secondary" onClick={ this.alternarModal }> Cancelar </Button>

                     </ModalFooter>
                </Form>
                </ModalBody>
            </Modal>
        )
    }

    alternarModal = () => { //nós queremos que o modal receba o estado anterior dele e troque para o contrário daquilo, se for false ele vai virar true e aparecer
        this.setState( prevState =>  ({ modal: !prevState.modal }))

    }

    atualizarCampo = (evento) => { //serve para atualizar meu state, e o usuario conseguir enviar os valores, deve ser bem dinâmica pois vai servir para vários inputs diferentes

        const { usuario } = this.state //aqui vou ter acesso a todos os itens dentro de determinada string
        usuario[ evento.target.name ] = evento.target.value  //esse value vai fazer eu pegar o valor que o usuário vai estar digitando
        this.setState({ usuario, erro: '' }) //o usuário que está na minha state vai receber o usuário que foi modificado   
        // a state tem que ser zerada depois de utilizada. Quando fazemos um cadastro, por exemplo, ela não pode deixar resquísios de senha ou usario ou email ali pois assim o próximo usuário a ser cadastrado vai acabar usando das mesmas informações se não for zerado 
    }

    enviarFormCadastro = async (evento) => { //isso vai ser chamado quando eu clicar no submit e vai enviar de fato para o meu back-end oque o usuario cadastrou
        evento.preventDefault() //

        const { nome, email, senha } = this.state.usuario //peguei coisas que estão dentro do meu usuario e referenciei dentro da minha state usuario, com base nisso eu vou criar um novo objeto

        const novoUsuario = {
            nome: nome,
            email: email,
            senha: senha
        }

        try {

            const resposta = await api.post('/api/usuario/cadastrar', novoUsuario) //aqui temos que criar uma resposta para a ação que o usuário vai estar fazendo
            if(resposta.data.erro){
                alert('Ocorreu um erro, favor checar o console!')
                this.alternarModal() //essa linha vai fazer com que o modal feche caso tenha um erro
                return console.log(resposta.data.mensagemErro) // caso dê algo errado ele vai acusar no meu console
            } else {
                alert('Usuário cadastrado com sucesso!')  //caso não seja detectado erro vai aparecer a seguinte mensagem para o usuário e o modal será fechado
                this.alternarModal()
                return console.log(resposta.data.usuario) //caso dê tudo certo ele vai acusar lá no meu console
            }

        } catch (erro) {
            console.log(erro)
            
        }

    }

    enviarFormLogin = async (evento) => {
        evento.preventDefault()

        const { email, senha } = this.state.usuario //é o que usaremos para poder logar

        const usuario = { email, senha}

        try {

            const resposta = await api.post('/api/usuario/logar', usuario) // o await faz com que a requisição aguarde essa linha de cima acontecer antes de acontecer o resto
            if (resposta.data.erro) {
                this.setState({ erro: resposta.data.mensagemErro })
                return console.log(resposta.data.mensagemErro)
            } else {
                login(resposta.data.token) //porque meu login é autenticado por um token
                return this.props.history.push('/home') // aqui nós iremos redirecionar o usuário para a home logo após logar caso não encontremos nenhum erro
            }

        } catch (erro) {
            console.log(erro)
        }
    }

    render = () => { //aqui nós chamamos as funções que nós criamos assima e queremos executar
        
        return (
            <div>
                { this.renderNavbar() }  
                { this.renderFormLogin() }
                { this.renderModalCadastrar() }
            </div>
        )
    }

}