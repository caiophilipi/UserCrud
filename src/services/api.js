import axios from 'axios'
import { getToken } from './auth' // Função que retorna o token, caso este exista.

const api = axios.create({ baseURL: "http://localhost:4000" })

api.interceptors.request.use(async config => { // basicamente o que está sendo feito aqui é: pedir para api, caso exista um token, colocar ele no cabeçalho pro back-end me reconhecer mais sem eu precisar colocar algo no cabeçalho diretamente
    const token = getToken()
    if (token) config.headers.Authorization = 'Bearer ' + token // esse token vem do  pegar token
    return config 
})

export default api