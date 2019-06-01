import React, { Component } from 'react';
import { Row, Col, Container } from 'reactstrap';
import Tarjetas from './tarjetas';
import Temas from '../temas/';
import GetData from '../../servicios/getData';
class Asignaturas extends Component {

    constructor() {
            super();
            this.state = {
                asignaturas: [],
                open: true,
                id_asignatura: null,
                temas: [],
                usuario: JSON.parse(sessionStorage.getItem('user'))
            }
            this.handleGetTemas = this.handleGetTemas.bind(this);
            this.cerrar=this.cerrar.bind(this);
        }
        /**
         * Carga las asignaturas en las que esta matriculado 
         * el usuario
         */
    componentDidMount() {
        const dir = 'usuarioAsignatura';
        const data=`?id_usuario=${this.state.usuario.id_usuario}`;
       

        GetData(dir, data).then((result) => {
            console.log(result);
            this.setState({
                asignaturas: result.data
            })
        })
    }

    cerrar(){
        this.setState({
            open: !this.state.open
        })
    }
    /**
     * funcion para obtener los temas por asignatura  
     */
    handleGetTemas(props) {
        //console.log(props);
        const dir = 'temaAsignatura/';
        const data = props;
        GetData(dir, data, true).then((result) => {
            this.setState({
                temas: result.data,
                id_asignatura: props,
                open: !this.state.open
            })
        })
    }

    render() {
        const asignaturas = this.state.asignaturas;
        //this.handleData();
        if (this.state.open) {
            return ( <Container style = {
                    { overflowX: "auto" } } >
                <Row > {
                    asignaturas && asignaturas.map((valor, key) =>
                        <
                        Col sm = '6'
                        md = "4"
                        className = "mt-4"
                        key = { key } > < Tarjetas data = { valor }
                        comprar = { this.handleGetTemas }
                        /></Col >
                    )
                } </Row> </Container>
            )
        } else {
            return ( <Row >
                
                <Temas temas = { this.state.temas }  cerrar={this.cerrar}
                /> </Row>
            )
        }

    }

}
export default Asignaturas;