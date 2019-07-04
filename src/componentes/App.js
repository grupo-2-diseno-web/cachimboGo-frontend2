import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Login from './Login/Login';

import Header from '../contenedores/Header';
import Nav from '../contenedores/Navigator';
import Footer from '../contenedores/Footer';
import Section from '../contenedores/Section';
import PostData from '../servicios/PostData';



class App extends Component {

    constructor() {
        super();
        this.state = {
            login: false,
            modal: true,
            loader:false,
            haveErrorLogin:false,
            user: {}
        }
        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleRegistrar = this.handleRegistrar.bind(this);
    }
    static propTypes = {
        children: PropTypes.object.isRequired
    }

    /**
     * Verifica si el usuario existe 
     * para restringir el acceso a la aplicacion
     */
    componentDidMount() {
            const usuario = JSON.parse(sessionStorage.getItem('user'));
            if (usuario) {
                this.setState({
                    login: !this.state.login,
                    modal: !this.state.modal
                });
            }
        }
        /**
         * Servicio para autenticar al usuario
         * 
         */
    handleLogin(user, contra) {
            const datos = {
                username: user,
                password: contra
            }
            this.setState({loader:true});
            PostData("login", datos, true).then((result) => {
                if (result.usuario) {
                    sessionStorage.setItem('user', JSON.stringify(result));
                    this.setState({
                        user: result,
                        login: !this.state.login,
                        modal: !this.state.modal,
                        loader: false
                    })
                } else {
                    alert("Usuario Incorrecto");
                    this.setState({loader:false});
                }

            })

        }
        /**
         * 
         * @param {*} props 
         * @param {*} estado 
         * Registrar a un nuevo usuario
         */
    handleRegistrar(props, estado) {  
      this.setState({loader:true})          
            PostData('usuario', props).then((result) => {
                if (result) {
                  this.setState({loader:false});
                    alert('Usuario registrado con exito');
                    estado();
                }                
            })
        }
        /**
         * funcion para cerrar sesion
         * 
         */
    handleLogout() {
        this.setState({
            login: !this.state.login,
            modal: !this.state.modal
        });
        sessionStorage.removeItem('user');
    }
    render() {
        const { children } = this.props;
        //comentario 2
        if (this.state.login) {
                return (
                    <div id = "page-top" >
                    <div id="wrapper2">
                    <Nav logout = { this.handleLogout } /> 
                        <div id="content-wrapper" class="d-flex flex-column">
                        <Section body = { children }/>

                        </div>
                        
                    </div>
                    
                    </div>
                    
                );

        }else{
            return (
                <Login modal={this.state.modal} login={this.handleLogin} registrar={this.handleRegistrar} loader={this.state.loader} haveErrorLogin={this.state.haveErrorLogin}/>
            )
        }
    }
}

export default App;