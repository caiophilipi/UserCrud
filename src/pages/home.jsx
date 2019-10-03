import React from 'react'
import api from './../services/api'
import {logout} from './../services/auth'
import {
    Navbar,
    NavbarBrand,
    NavLink,
    Table,
    Nav, 
    NavItem,
    Col,
    Input,
    Label,
    Button,
    ModalHeader,
    ModalFooter,
    ModalBody,
    Modal,
    Form,
    FormGroup,
    Alert
} from 'reactstrap'

export default class Home extends React.Component {

    constructor(props) {
        super(props)

        this.state = { //está servindo para a gente declarar um estado, que é algo que o usuário vê na tela, uma informação dinâmica que varia de usuário pra usuário
            modal: false,
            erroCadastrar:'',
            erro:'',
            usuarios: [],
            usuario: {
                _id: '',
                nome: '',
                email: '',
                senha: ''
            }
        }
    } 


    componentDidMount = async () => {  //Vamos fazer uma requisição pro front-end montar algo na tela com a informação que vem do back-end

        try {

            const resposta = await api.get('/api/usuario/listar')
            if (resposta.data.erro) { //se existe um erro vamos usar isso de baixo
                return this.setState({ erro: resposta.data.mensagemErro })
            }
            this.setState({ usuarios: resposta.data.usuarios }) //se deu tudo certo um vetor de usuarios será retornado para mim no front-end

        } catch (erro) {
            console.log(erro)
        }
    }


    excluirUsuario = async (_id) => {
        const { usuarios } = this.state

        try {
            const resposta = await api.delete('/api/usuario/excluir/' + _id) // eu quero deletar um usuario através daquela rota e para isso eu quero achar ele pelo id específico dele no banco de dados e eliminar apenas esse id
            if (resposta.data.erro) {
                console.log(resposta.data.mensagemErro)
            } else {
                console.log('Usuário deletado com sucesso!')
                this.setState({ usuarios: usuarios.filter((usuario) => usuario._id !== _id) }) // basicamente é um filtro que vai deletar no nosso back-end exatamente o id que queremos
            }
        } catch (erro) {
            console.log(erro)
        }
    }
    
    zerarStateUsuario = () => {
        const usuario = {
            _id: '',
            nome: '',
            email: '',
            senha: ''
        }
        this.setState({ usuario })
    }
    
    alternarModal = () => {
        this.zerarStateUsuario()
        this.setState(prevState => ({ modal: !prevState.modal }))
    }

    editarUsuario = async () => {

    }


    cadastrarUsuario = async (event) => {
        event.preventDefault()

        const { usuario, usuarios } = this.state

        try {

            const resposta = await api.post('/api/usuario/cadastrar', usuario)
            if (resposta.data.erro) {
                this.setState({ erroCadastrar: resposta.data.mensagemErro })
                console.log(resposta.data.mensagemErro)
            } else {
                alert('Usuário cadastrado com sucesso!')
                console.log('Usuário cadastrado com sucesso!')
                usuario._id = resposta.data.usuario._id
                usuarios.push(usuario)
                this.setState({ usuarios })
                this.alternarModal()
                this.zerarStateUsuario()
            }

        } catch (erro) {
            console.log(erro)
        }

    }

    atualizarCampo = (event) => {
        const { usuario } = this.state
        usuario[event.target.name] = event.target.value
        this.setState({ usuario, erroCadastrar: '', erroLogar: '' })
    }



    renderNavbar = () => { 
        return (
            <div>   
                <Navbar expand="md" color="navbar navbar-dark bg-dark" >
                    <NavbarBrand href="/"> Signal Jr </NavbarBrand>
                    <Nav className="ml-auto" navbar>
                        <NavItem>    
                            <Button onClick={ this.alternarModal } style={{marginTop: 8, marginRight: 8 , }} color="light" outline> Cadastrar Usuário </Button>   
                        </NavItem>
                        <NavItem>
                            <NavLink target="_blank" href="https://github.com/arthurmfgtab/trainee-signal-2019.2">
                                <Button color="light" outline> GitHub </Button>
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink onClick={ logout } href="/">
                                <Button color="light" outline> Sair </Button>
                            </NavLink>
                        </NavItem>
                    </Nav>
                </Navbar>
            </div>    
        )
    }

    renderModal = () => {
        return (
            <div>
                <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}> Cadastrar Usuário </ModalHeader>
                    <ModalBody>

                        {(this.state.erroCadastrar) ? <Alert color="danger"> {this.state.erroCadastrar} </Alert> : undefined }

                        <Form onSubmit={this.cadastrar}>
                            <FormGroup row>
                                <Label sm={2}> <strong> Nome </strong> </Label>
                                <Col sm={10}>
                                    <Input onChange={this.atualizarCampo} type="text" name="nome" placeholder="seuNome" />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label sm={2}> <strong> Email </strong> </Label>
                                <Col sm={10}>
                                    <Input onChange={this.atualizarCampo} type="email" name="email" placeholder="seuEmail" />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label sm={2}> <strong> Senha </strong> </Label>
                                <Col sm={10}>
                                    <Input onChange={this.atualizarCampo} type="password" name="senha" placeholder="suaSenha" />
                                </Col>
                            </FormGroup>
                            <ModalFooter>
                                <Button type='submit' color="success"> Cadastrar </Button>
                                <Button outline color="success" onClick={this.toggleModal}> Cancelar </Button>
                            </ModalFooter>
                        </Form>
                    </ModalBody>

                </Modal>
            </div>
        )
    }



    renderTabelaUsuarios = () => { //aqui criaremos a tabela que usaremos na aplicação, a estrutura inicial
        return (
            <div style={{ marginLeft: 200, marginRight: 200, marginTop: 100 }}>
                <Table hover striped size="sm">
                    <thead>  
                        <tr> 
                            <th> ID </th>
                            <th> Nome </th>
                            <th> Email </th>
                            <th> Opções </th>
                        </tr>

                    </thead>
                    <tbody>
                        { this.renderTabelaItem() } 

                    </tbody>
                </Table>

            </div>
        )
    }


    renderTabelaItem = () => { //essa função vai levar cada linha ou seja cada registro da minha tabela
        const { usuarios } = this.state

        return usuarios.map(usuario => { // essa função map vai fazer com que eu faça uma coisa para cada usuario presente no elemento usuarios, no caso eu quero que cada usuario tenha uma linha
            return (
                <tr key={ usuario._id }>
                    <td> { usuario._id } </td>
                    <td> {usuario.nome}  </td>
                    <td> {usuario.email} </td>
                    <td>  
                        <Button onClick={() => console.log('Funcionalidade de editar usuário!')} style={{ marginRight: 10 }} color='warning' > Editar </Button>
                        <Button onClick={() => { if (window.confirm('Você deseja realmente excluir o usuário? Essa ação não pode ser desfeita!')) this.excluir(usuario._id) }} color='danger'> Excluir </Button> 
                    </td>

                </tr>
            )
         })

    }

    render = () => { //aqui eu vou ter meus componetes de CRUD, como listar, editar, excluir e outras coisas na tela. Ele recebe uma função e sempre que ela colocar alguma coisa na tela eu vou colocar na tela
         return (
             <div>
                { this.renderNavbar() }
                { this.renderTabelaUsuarios() }
             </div>
         )

     }
}     