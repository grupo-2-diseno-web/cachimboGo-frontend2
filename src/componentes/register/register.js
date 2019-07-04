import React, { Component } from 'react';
import { Modal } from 'reactstrap';


import { Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

import PostData from './../../servicios/PostData';

import './../Login/auth.css';

const REGEX_USERNAME = /^[a-zA-Z0-9_.-]*$/;

class RegisterAuth extends Component {

  constructor() {
    super();
    this.state = {
      usuario: '',
      password: '',
      nombres: "",
      apellidos: "",
      correo: "",
      registrar: true,
      loader: false,
      showError: false
    }
   
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.handleSubmitAuth = this.handleSubmitAuth.bind(this);
    this.onDismiss = this.onDismiss.bind(this);

  }
  
  handleSubmitAuth(ev) {
    ev.preventDefault();
    const isValidForm = this.isValidForm(this.state);
    if (isValidForm) {
      this.setState({ loader: true });
      const { userIn, contraIn } = this.state;
      const datos = { userIn, contraIn };

      PostData("login", datos, true)
        .then(
          (result) => {
            if (result.usuario) {
              sessionStorage.setItem('user', JSON.stringify(result));
              this.setState({
                user: result,
                login: !this.state.login,
                modal: !this.state.modal
              })
            } else {
              this.setState({ showError: true });
            }
            this.setState({ loader: false });
          });
    } else {

    }
  }

  handleSubmitRegister(ev) {
    ev.preventDefault();
  }

  handleChangeInput(ev) {
    const nameInput = ev.target.name;
    const valueInput = ev.target.value;
    this.setState({ [nameInput]: valueInput });
  }

  isValidForm(valueForm) {
    const { userIn, contraIn } = { ...valueForm };
    let isValid = false;

    const isRequired = this.isRequired(userIn) && this.isRequired(contraIn);
    const isValidValue = REGEX_USERNAME.test(userIn.trim());
    isValid = isRequired && isValidValue;
    return isValid;
  }

  isRequired(value) {
    const _value = value.trim();
    return !!_value.length;
  }

  onDismiss() {
    this.setState({ showError: false });
  }



  render() {
    return (
      <Modal isOpen={this.props.modal} size='md' className='layout-window view-register'>
        <div className='layout-window__left position-relative'>
          <Alert color="danger" className='alert-auth' isOpen={this.state.showError} toggle={this.onDismiss}>
            Usuario/Password Incorrectos
          </Alert>
          <div className='form-auth'>
            <div className='text-center'>
              Imagen Logo
           </div>
            <h3 className='text-uppercase'>
              Crear Cuenta
           </h3>
            <form autoComplete='off'>
              <div className='go-input mb-3'>
                <label htmlFor="" className='d-block'>Nombres</label>
                <input placeholder='Ej. jhonwick' name='nombres' onChange={this.handleChangeInput} value={this.state.nombres} />
              </div>
              <div className='go-input mb-3'>
                <label htmlFor="" className='d-block'>Apellidos</label>
                <input placeholder='Ej. jhonwick' name='apellidos' onChange={this.handleChangeInput} value={this.state.apellidos} />
              </div>
              <div className='go-input mb-3'>
                <label htmlFor="" className='d-block'>Correo</label>
                <input placeholder='Ej. jhonwick' name='correo' onChange={this.handleChangeInput} value={this.state.correo} />
              </div>
              <div className='go-input mb-3'>
                <label htmlFor="" className='d-block'>Usuario</label>
                <input placeholder='Ej. jhonwick' name='usuario' onChange={this.handleChangeInput} value={this.state.usuario} />
              </div>
              <div className='go-input mb-3'>
                <label htmlFor="" className='d-block'>Contraseña</label>
                <input type='password' name='password' placeholder='******' onChange={this.handleChangeInput} value={this.state.password} />
              </div>
              <button type='submit' onClick={this.handleSubmitRegister} className={`go-btn go-btn-block go-btn-primary mb-3 ${(this.state.loader) ? 'go-btn-loading' : null}`}>
                Registrar
                {(this.state.loader) ? <span className='go-spinner'><FontAwesomeIcon spin icon={faCircleNotch} size='lg' /></span> : null}
              </button>
              <div className='divider'></div>
              <div className='text-auth'>
                ¿Ya tienes una cuenta?, Inicia sesion  <span className='pointer' onClick={() => { this.setState({ registrar: !this.state.registrar }) }}> aqui</span>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    )
  }
}

export default RegisterAuth;