import React from 'react'

import {
    BrowserRouter,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import Home  from './pages/home'
import Login from './pages/login'
import { isAuthenticated } from './services/auth'

const PrivateRoute = ({ component: Component  }) => (
    <Route
        render={props => ( // Recebe as propriedades passadas no render por quem chamou
            isAuthenticated()
                ? <Component {...props}/> // isso aqui é um ternário, o ? significa se
                : <Redirect to ={{ pathname: '/', state: { from: props.location } }}/> // os : significam se não

        )
        }
    />
)

const Routes = () => (
    <BrowserRouter>
         <Switch>
             <Route exact path= "/" component = { Login } />
             <PrivateRoute path="/home" component={ Home } />  
             <Route path="*" component={ () => <h3>Page not found!</h3>} />

         </Switch>
    </BrowserRouter>
)

export default Routes 