import React, { Component } from 'react';
import Tema from './Tema';
import SubTema from '../subtemas/';
import GetData from '../../servicios/getData';
import PostData from '../../servicios/PostData';
import { Row, Col } from 'reactstrap';
import Modal from '../preguntas/modal';
import {Button} from 'reactstrap';


class Temas extends Component {

    constructor() {
        super();
        this.state = {
            open: true,
            subtemas: [],
            idSubtema: 0,
            usuario: null,
            tipoModal: false,
            id_tema: 0,
            modal: false,          // flag para abrir o cerrar el modal
            pregunta: [],          // Array que almacena las preguntas que llegandesde el API
            rpta: 0,               //varaiable que almacena la respuesta, que recibe desde el componente mondal
            respuesta: "",         //se almacena la infomacion de la pregunta (explicacion de la pregunta)
            msj: null,             // mensjae que se envia al modal "Respuesta correcta o incorrecta"
            respuestas: [],        //se almacena las respuesta de cada pregunta para guardarlas al final del analisis 
            errorPregunta: false,   // flag para saber si respondió correctamente o se equivocó
            errores:0               //para saber si tuvo error en un subtema

        }
        this.handleGetSubTemas = this.handleGetSubTemas.bind(this);
        this.toggle = this.toggle.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleresponder = this.handleresponder.bind(this);
        this.handleCalificar = this.handleCalificar.bind(this);
        this.handleGetPreguntas = this.handleGetPreguntas.bind(this);
        this.handleSaltar = this.handleSaltar.bind(this);
        this.cerrar = this.cerrar.bind(this);
    }
    componentWillMount() {
        this.setState({
            usuario: JSON.parse(sessionStorage.getItem('user'))
        });
    }

    handleSaltar() {
        let respuesta = new this.crearObj(this.state.usuario.id_usuario, this.state.pregunta[0].id_pregunta, 0);
        this.setState({
            respuesta: this.state.pregunta[0].informacion,
            respuestas: this.state.respuestas.concat(respuesta),
            correcta: false,
            errorPregunta: true,
            msj: "La respuesta correcta es:"
        })
    }

    handleGetSubTemas(props) {
      //  console.log('abrir subtemas');
        /*const datos={
            id_asignatura:props,
            id_usuario:55
        }*/
        const dir = 'subtemaTema/';
        const data = props;
        GetData(dir, data, true).then((result) => {            
            this.setState({
                subtemas: result.data,
                id_tema: props,
                open: !this.state.open
            })
        })
    }
    /**
     * obtener las peguntas por subtema
     * @param {*subtema} props 
     */
    handleGetPreguntas(props) {        
        const dir = 'pregunta/';
        const data = `${props}/1`;
        GetData(dir, data, true).then((result) => {
            this.setState({
                pregunta: result.data,
                modal: !this.state.modal,
                rpta: 0,
                respuesta: "",
                respuestas: [],
                correcta: false,
                msj: null,
                idSubtema: props
            })
        }).catch( e => {
            throw new Error(e);
        })
        /* fetch(`https://cachimbogo.herokuapp.com/servicios/preguntaR/${props}/1`)
             .then(response => {
                 return (response.json())
             })
             .then(responseJson => {
                 this.setState({
                     pregunta: responseJson,
                     modal: !this.state.modal,
                     rpta: 0,
                     respuesta: "",
                     respuestas: [],
                     correcta: false,
                     msj: null,
                     idSubtema:props
                 })
             })*/
    }
    crearObj(id_usuario, id_pregunta, acertada) {
        this.id_usuario = id_usuario;
        this.id_pregunta = id_pregunta;
        this.acertada = acertada;
    }

    /**
     * funcion para validar si la respuesta pulsada por
     * el usuario fue correcta o no
     */
    handleCalificar(pregunta) {
        const preguntas = this.state.pregunta;
        let respuesta = {};
        //["id_usuario", "id_pregunta", "correcta_num", "monedas"]

        const currentPregunta = pregunta;
        const currentRpta = this.state.rpta;
        const id_usuario = this.state.usuario.id_usuario;

        const bodyRequest= {
          id_pregunta : currentPregunta.id_pregunta,
          correcta_num: currentRpta,
          id_usuario: id_usuario
        }

        PostData('respuesta',bodyRequest)
        .then(response => {
            const {correcta,informacion} = response;            
            this.setState({
                respuesta:informacion,
                correcta: correcta,
                errorPregunta: !correcta,
                msj: correcta ? 'Tu respuesta es correcta' : 'Tu respuesta es incorrecta',
                errores: correcta ? this.state.errores : this.state.errores++
            });
        }).catch( e => {
          throw new Error(e);
      })

    }

    getRptaFromPregunta(idPregunta){
      return this.state.respuestas.find(pregunta => pregunta.id_pregunta === idPregunta);
    }
    //codigo para leer el radio button presionado
    handleresponder(props) {
       // console.log(props);
        //console.log("Clave correcta" + this.state.pregunta[0].correcta_num);
       // console.log(this.state.respuestas);
        this.setState({
            rpta: props
        })
    }


    // codigo para abrir el modal
    toggle() {
        if (this.state.pregunta.length !== 0) {
            this.setState({
                modal: !this.state.modal
            });
        } else {
            alert(`No se cargaron las preguntas del tema`);
        }

    }
    //#########################
    cerrar(){
        this.setState({
            open: !this.state.open
        })
        
    }
    //pasar a la siguiente pregunta
    
    handleNext() {
        let preguntas = this.state.pregunta;
        if (preguntas.length !== 1) {
            if (this.state.rpta === preguntas[0].correcta_num) {
                preguntas.shift();
                this.setState({
                    pregunta: preguntas,
                    respuesta: "",
                    correcta: false,
                    msj: ""
                })
            } else {
                let pre = preguntas.shift();
                // preguntas.push(pre);
                this.setState({
                    pregunta: preguntas,
                    respuesta: "",
                    correcta: false,
                    msj: ""
                })
            }
        } else {
            alert('terminaste');
            const id_usuario = this.state.usuario.id_usuario;

            const bodyRequest= {
                id_usuario : id_usuario,
                id_subtema : this.state.idSubtema,
                completado: this.state.errores>0 ? 0 : 1,

              }
      
              PostData('usuarioSubtema',bodyRequest)
              .then(response => {                    
                    this.props.refrescarTemas();
                  });
            /**
             * Objeto amalcena las monedas del usuario y sus monedas
             */
            //console.log(this.state.usuario.monedas);
            const arreglo = {
                monedas: this.state.usuario.monedas, // monedas que se extrae del perfil del usuario
                id_usuario: this.state.usuario.id_usuario //el codigo de usuario que se extrae del perfil de usuario
            }
            /**
             * Objeto creado para almacenar 
             * el id_usuario id_subtema mas 
             * completado(0 o 1)
             */
            const arregloEstadistica = {
                id_usuario: this.state.usuario.id_usuario, // el id del usuario
                id_subtema: this.state.idSubtema, //el id del subtem
                completado: 0
            }
            /**
             * Verificamos si el usuario cometio 
             * algun error al responder las preguntas
             */
            if (this.state.errorPregunta) {
                arreglo.monedas = arreglo.monedas + 2; // si se equivoco se le asigna 2 monedas 
            } else {
                arregloEstadistica.completado = 1; // si no se equivoco seteamos 1 a completado
                arreglo.monedas = arreglo.monedas + 3; // 3 si no se equivoco
            }
            /**
             * Servicio para asignar monedas al usuario 
             */
          /*  let dir = 'ganancia_moneda.php';
            let data = `?id_usuario=${this.state.usuario.id_usuario}&monedas=${arreglo.monedas}`;
            GetData(dir, data).then((result) => {
                console.log(result);
            })*/
            let dir = 'usuarioMonedas/';
            let data = {
                id_usuario:this.state.usuario.id_usuario,
                monedas:arreglo.monedas
            }
            // PostData(dir,data,true).then((result)=>{
            //     //console.log(result);
            // })

            /**
             * Se almacena todas las repuestas que respondió
             * el usuario de las pregruntas que se le envió
             */
            dir = 'respuesta/';
            data = this.state.respuestas;
            // PostData(dir, data, true).then((result) => {
            //    // console.log(result);
            // })

            /**
             * Se registrar en la base de datos que 
             * resolvio el subtema  
             */
            dir = 'insertar_usuario_subtema.php';
            data = `?id_usuario=${this.state.usuario.id_usuario}&id_subtema=${this.state.idSubtema}&completado=${arregloEstadistica.completado}`;
            // GetData(dir, data).then((result) => {
            //     //console.log(result);
            // })
            this.setState({
                modal: !this.state.modal,
                tipoModal: !this.state.tipoModal
            })
        }
    }
    render() {
        const temas = this.props.temas;                
        if (this.state.open) {
            return (
                <Row>
                    <Button color="success" className="btn margen-boton btn-lg btn-circle btn-danger" onClick={()=>{this.props.cerrar()}}><i class="fas fa-arrow-left"></i></Button>
                    {
                        temas && temas.map((valor, key) =>
                            <Col className="col col-md-11 my-5 mx-5" key={key}><Tema data={valor} getSubtemas={this.handleGetSubTemas} /></Col>
                        )
                    }
                </Row>
            )
        } else {
            return (
                <div>
                <div>
                    <Button color="success" className="btn margen-boton btn-lg btn-circle btn-danger" onClick={()=>{this.cerrar()}}><i class="fas fa-arrow-left"></i></Button>
                </div>
                <Row>
                    {this.state.subtemas && this.state.subtemas.map((valor, key) =>
                            <Col sm='4' className="col my-5 mx-5" key={key}><SubTema data={valor} getPreguntas={this.handleGetPreguntas} getTemas={this.props.getTemas}/></Col>
                        )
                    }
                    { typeof this.state.pregunta !== 'undefined'  ? 
                        <Modal titulo="Gestion de preguntas" modal={this.state.modal} calificar={this.handleCalificar} toggle={this.toggle}
                            pregunta={this.state.pregunta[0]} responder={this.handleresponder} saltar={this.handleSaltar} respuesta={this.state.respuesta} correcta={this.state.correcta}
                            mensaje={this.state.msj} next={this.handleNext} /> : null}
                </Row>
                </div>
            )
        }

    }
}
export default Temas;