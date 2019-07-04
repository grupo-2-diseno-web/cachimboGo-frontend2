import React, { Component } from 'react';
import { Button, Modal, Form, FormGroup, ModalHeader, ModalBody, ModalFooter, Row, Container, Input, Label, Col } from 'reactstrap';
import { FaUserAlt } from "react-icons/fa";

// import { UncontrolledAlert } from 'reactstrap';
import { Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

import PostData from './../../servicios/PostData';

import './auth.css';

const REGEX_USERNAME = /^[a-zA-Z0-9_.-]*$/;

class ModalPreguntas extends Component {

  constructor() {
    super();
    this.state = {
      userIn: '',
      contraIn: '',
      nombres: "",
      apellidos: "",
      correo: "",
      registrar: true,
      loader: false,
      showError: false,
      username: '',
      password: '',
      isErrorUsername:false,
      isErrorPassword:false,
    }
    this.handleInputUser = this.handleInputUser.bind(this);
    this.handleInputContra = this.handleInputContra.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleCambiarRegistro = this.handleCambiarRegistro.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleNombres = this.handleNombres.bind(this);
    this.handleApellidos = this.handleApellidos.bind(this);
    this.handleCorreo = this.handleCorreo.bind(this);
    this.handleRegistrar = this.handleRegistrar.bind(this);
    this.handleRegistro = this.handleRegistro.bind(this);

    // myHandkles
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.handleSubmitAuth = this.handleSubmitAuth.bind(this);
    this.onDismiss = this.onDismiss.bind(this);

    this.isErrorUsername = false;
    this.isErrorPassword = false;

  }
  handleInputUser(data) {
    this.setState({
      userIn: data.target.value
    })
  }
  handleRegistro() {
    const obj = {
      usuario: this.state.userIn,
      password: this.state.contraIn,
      nombres: this.state.nombres,
      apellidos: this.state.apellidos,
      correo: this.state.correo,
      monedas: 0
    }
    this.props.registrar(obj, this.handleCambiarRegistro);
  }
  handleNombres(data) {
    this.setState({
      nombres: data.target.value
    });
  }
  handleCambiarRegistro() {
    this.setState({
      registrar: !this.state.registrar
    });
  }
  handleApellidos(data) {
    this.setState({
      apellidos: data.target.value
    });
  }
  handleCorreo(data) {
    this.setState({
      correo: data.target.value
    });
  }
  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.props.login(this.state.userIn, this.state.contraIn);
    }
  }

  handleSubmitAuth(ev) {
    ev.preventDefault();
    const isValidForm = this.isValidForm(this.state);
    if (isValidForm) {
      // this.setState({ loader: true });
      const { username, password } = this.state;
      const datos = { username, password };
      
      this.props.login(username, password);

      // PostData("login", datos, true)
      //   .then(
      //     (result) => {
      //       if (result.usuario) {
      //         sessionStorage.setItem('user', JSON.stringify(result));
      //         this.setState({
      //           user: result,
      //           login: !this.state.login,
      //           modal: !this.state.modal
      //         })
      //         history.push('/');
      //       } else {
      //         this.setState({ showError: true });
      //       }
      //       this.setState({ loader: false });
      //     });
    } else {
      const { username, password } = this.state;
      if(this.isRequired(username)){this.setState({isErrorUsername:false})}
      if(this.isRequired(password)){this.setState({isErrorPassword:false})}
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
    const { username, password } = { ...valueForm };
    let isValid = false;

    if(!this.isRequired(username)){this.setState({isErrorUsername:true})}
    if(!this.isRequired(password)){this.setState({isErrorPassword:true})}

    const isRequired = this.isRequired(username) && this.isRequired(password);
    const isValidValue = REGEX_USERNAME.test(username.trim());
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

  handleRegistrar() {
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
                <input placeholder='Ej. jhonwick' name='usuario' onChange={this.handleChangeInput} value={this.state.userIn} />
              </div>
              <div className='go-input mb-3'>
                <label htmlFor="" className='d-block'>Contraseña</label>
                <input type='password' name='password' placeholder='******' onChange={this.handleChangeInput} value={this.state.contraIn} />
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
        {/* <div className='layout-window__right'></div> */}
        {/* <ModalHeader toggle={this.props.toggle} charcode="X" className='text-align-center'>Registrar</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="nombre">Nombre</Label>
              <Input type="text" name="nombre" id="nombre" onChange={this.handleNombres} placeholder="nombre" value={this.state.nombres} />
            </FormGroup>
            <FormGroup>
              <Label for="examplePassword">Apellidos</Label>
              <Input type="text" name="contraseña" id="contraseña" onChange={this.handleApellidos} placeholder="Apellidos" />
            </FormGroup>
            <FormGroup>
              <Label for="nombre">Correo</Label>
              <Input type="email" name="email" id="nombre" onChange={this.handleCorreo} placeholder="email" />
            </FormGroup>
            <FormGroup>
              <Label for="nombre">Usuario</Label>
              <Input type="text" name="usuario" id="nombre" onChange={this.handleInputUser} placeholder="usuario" />
            </FormGroup>
            <FormGroup>
              <Label for="contraseña">Contraseña</Label>
              <Input type="password" name="contraseña" id="contraseña" onChange={this.handleInputContra} placeholder="contraseña" />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Container>
            <Row className="justify-content-center">
              <Col sm="4" xs="6">
                <Button onClick={() => { this.setState({ registrar: !this.state.registrar }); }}>Login</Button>
              </Col>
              <Col sm="4" xs="6">
                <Button onClick={this.handleRegistro}>Registrar</Button>
              </Col>
            </Row>
          </Container>
        </ModalFooter> */}
      </Modal>
    )
  }
  handleLogin() {
    // const 
    return (
      <Modal isOpen={this.props.modal} size='sm' className='layout-window'>
        <div className='layout-window__left position-relative'>
          <Alert color="danger" className='alert-auth' isOpen={this.state.showError} toggle={this.onDismiss}>
            Usuario/Password Incorrectos
          </Alert>
          <div className='form-auth'>
            <div className='text-center'>
              Imagen Logo
           </div>
            <h3 className='text-uppercase'>
              Ingresa con tu cuenta
           </h3>
            <form autoComplete='off'>
              <div className='go-input mb-3'>
                <label htmlFor="" className='d-block'>Usuario</label>
                <input placeholder='Ej. jhonwick' name='username' onChange={this.handleChangeInput} value={this.state.username} />
              </div>
              {(this.isErrorUsername || this.props.loader) ? <p>Campo Incorrecto</p> : null}
              <div className='go-input mb-3'>
                <label htmlFor="" className='d-block'>Contraseña</label>
                <input type='password' name='password' placeholder='******' onChange={this.handleChangeInput} value={this.password} />
              </div>
              {(this.isErrorPassword) ? <p>Campo Incorrecto</p> : null}
              <button type='submit' onClick={this.handleSubmitAuth} className={`go-btn go-btn-block go-btn-primary mb-3 ${(this.props.loader) ? 'go-btn-loading' : null}`}>
                Ingresar
                {(this.props.loader) ? <span className='go-spinner'><FontAwesomeIcon spin icon={faCircleNotch} size='lg' /></span> : null}
              </button>
              <div className='divider'></div>
              <div className='text-auth'>
                ¿No tienes una cuenta?, registrate  <span className='pointer' onClick={() => { this.setState({ registrar: !this.state.registrar }) }}> aqui</span>
              </div>
            </form>
          </div>
        </div>
        <div className='layout-window__right'></div>

        {/* <ModalHeader toggle={this.props.toggle} charcode="X" className='text-align-center'>Iniciar Sesion</ModalHeader>
        <ModalBody>
          <Label><span><FaUserAlt /></span>Usuario</Label>
          <Input type="text" placeholder="ingrese usuario" onChange={this.handleInputUser} onKeyPress={this.handleKeyPress} value={this.state.userIn} /><br />
          <Label>Contraseña</Label>
          <Input type="password" placeholder="Contraseña" onChange={this.handleInputContra} onKeyPress={this.handleKeyPress} value={this.state.contraIn} />
        </ModalBody>
        <ModalFooter>
          <Container>
            <Row className="justify-content-center">
              <Col sm="4" xs="6">
                <Button onClick={() => { this.props.login(this.state.userIn, this.state.contraIn) }}>Login</Button>
              </Col>
              <Col sm="4" xs="6">
                <Button onClick={() => { this.setState({ registrar: !this.state.registrar }); }}>Registrar</Button>
              </Col>
            </Row>
          </Container>
        </ModalFooter> */}
      </Modal>
    )
  }
  handleInputContra(data) {
    this.setState({
      contraIn: data.target.value
    })
  }

  render() {
    if (!this.props.modal) {
      return null;
    } if (!this.state.registrar) {
      return (this.handleRegistrar())
    }
    if (this.handleRegistrar) {
      return (this.handleLogin())
    }
  }
}

export default ModalPreguntas;