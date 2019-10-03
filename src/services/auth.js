// aqui vamos exportar funções que vão ficar salvas no localstorage. Quando logamos no facebook, saimos da página e dps quando voltamos ainda estamos logados, é por que nosso token ainda está salvo no localStorage

export const isAuthenticated = () => localStorage.getItem('TOKEN_KEY') !== null    // caso não exista eu vou retornar false como nada mas caso exista um token válido eu vou retornar true

export const getToken = () => localStorage.getItem('TOKEN_KEY')  //essa aqui vai pegar token

export const login = (token) => localStorage.setItem('TOKEN_KEY', token) //essa aqui vai gerar o token na hora que o usuario logar, colocar um valor naquele token

export const logout = () => localStorage.removeItem('TOKEN_KEY') //essa aqui vai destruir o token quando o usuário clicar em deslogar