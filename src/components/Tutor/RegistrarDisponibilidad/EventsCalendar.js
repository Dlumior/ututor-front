import React, { Component, useContext } from "react";
import {Calendar, momentLocalizer} from "react-big-calendar";
import moment from 'moment';
import Dialogo from "./Dialogo";
import * as Conexion from "../../../Conexion/Controller";
import { CircularProgress } from "@material-ui/core";
import Alertas from "../../Coordinador/Alertas";
import ComboBoxFacultad from "./ComboBoxFacultad";
import { getUser } from "../../../Sesion/Sesion";
import {usuario} from "../../../App"
require("./calendario.css")
require('moment/locale/es.js');
  
const localizer = momentLocalizer(moment);

const style = {
  carga :{
    align: "right"
  }
}

class EventsCalendar extends Component {
  constructor(){
    super();
    this.state = {
      tutor:(getUser()).usuario,
      modalIsOpen: false,
      fecha: "",
      fechaMostrar: "",
      horaInicio: "",
      idDisponibilidad: 0,
      enlace: "/api/disponibilidadporfacultad/",
      eventos: [],
      repeticion: 1,
      lugar: "",
      bandera: 0,
      modificar: 0, 
      visible: 1,
      facultades: [],
      facultad: 0,
      problema: false,
      loading: true,
      diasAnticipacion: 0,
      alerta: {
        mensaje: "",
        mensajeStrong: "",
        mostrar: false
      }
    } 
    this.actualizarMensaje = this.actualizarMensaje.bind(this);
  }
  
   async componentDidMount() {
    let facuTutor = await Conexion.GET({ servicio: "/api/facultad/tutor/" + this.state.tutor.ID_USUARIO})
    if(facuTutor){
      if(facuTutor.facultades){
        await this.setState({facultades: facuTutor.facultades})
        if(facuTutor.facultades.length !== 0){
          await this.setFacultad(facuTutor.facultades[0].FACULTAD.ID_PROGRAMA)
        }
      }
    }
    //console.log("facultades del tutor: ", facuTutor)
    let listaEventos = []
    let listaDisponibilidad = await Conexion.GET({ servicio: this.state.enlace  + this.state.tutor.ID_USUARIO + "/" + this.state.facultad  });    
    //console.log("disponibilidad", listaDisponibilidad);
    if(listaDisponibilidad){
      if(!listaDisponibilidad.hasOwnProperty('error')){
        await this.setState({loading: false})
        for (let disp of listaDisponibilidad.data){          
          let evento = {
            title: disp.HORA_INICIO.substring(0,5) + "-" + disp.HORA_FIN.substring(0,5),
            start: new Date(disp.FECHA + " " +  disp.HORA_INICIO),
            end: new Date(disp.FECHA + " " +  disp.HORA_FIN),
            id: disp.ID_DISPONIBILIDAD,
            repeticion: 1,
            lugar: disp.LUGAR
          }      
          listaEventos.push(evento);
          this.setState({problema:false})                   
        } 
        if(this.state.facultades){
          if(this.state.facultades.length!==0){
            this.setState({diasAnticipacion: this.state.facultades.filter(e=>e.FACULTAD.ID_PROGRAMA===this.state.facultad)[0].FACULTAD.ANTICIPACION_DISPONIBILIDAD})
          }
        }
      }else{
        this.setState({problema: true});
        let alerta = {...this.state.alerta};
        alerta.mensaje = "Parece que algo anda mal"
        alerta.mensajeStrong = "por favor actualice la página"
        this.setState({alerta: alerta})
      }
    }
    else{
      this.setState({problema:true});
      let alerta = {...this.state.alerta};
      alerta.mensaje = "Parece que algo anda mal"
      alerta.mensajeStrong = "por favor actualice la página"
      this.setState({alerta: alerta})
    }
    this.setState({eventos: listaEventos});    
  }

  shouldComponentUpdate(nextState, nextProps) {
    if (nextState.eventos != this.state.eventos) {
      return true;
    }
    if (nextState.bandera !== this.state.bandera) {
      return true;
    }
    return false;
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.bandera !== prevState.bandera) {
      //let facuTutor = await Conexion.GET({ servicio: "/api/facultad/tutor/" + this.state.tutor.ID_USUARIO})
      // if(facuTutor.facultades){
      //   await this.setState({facultades: facuTutor.facultades})
      //   await this.setState({facultad:facuTutor.facultades[0].ID_PROGRAMA})
      // }
      ////console.log("facultades del tutor: ", facuTutor)
      let listaEventos = []
      let listaDisponibilidad = await Conexion.GET({ servicio: this.state.enlace  + this.state.tutor.ID_USUARIO + "/" + this.state.facultad  });    
    
      // let listaEventos = []
      // let listaDisponibilidad = await Conexion.GET({ servicio: this.state.enlace + this.state.tutor.ID_USUARIO });            
      //console.log("disponibilidad", listaDisponibilidad);
      if(listaDisponibilidad){
        if(!listaDisponibilidad.hasOwnProperty('error')){
          await this.setState({loading: false})
          for (let disp of listaDisponibilidad.data){
              let evento = {
                title: disp.HORA_INICIO.substring(0,5) + "-" + disp.HORA_FIN.substring(0,5),
                start: new Date(disp.FECHA + " " +  disp.HORA_INICIO),
                end: new Date(disp.FECHA + " " +  disp.HORA_FIN),
                id: disp.ID_DISPONIBILIDAD,
                repeticion: 1,
                lugar: disp.LUGAR
              }      
              listaEventos.push(evento);
              this.setState({problema: false});              
            }
            if(this.state.facultades){
              this.setState({diasAnticipacion: this.state.facultades.filter(e=>e.FACULTAD.ID_PROGRAMA===this.state.facultad)[0].FACULTAD.ANTICIPACION_DISPONIBILIDAD})
            }
          }else{
            this.setState({problema: true});
            let alerta = {...this.state.alerta};
            alerta.mensaje = "Parece que algo anda mal"
            alerta.mensajeStrong = "actualice la página"
            this.setState({alerta: alerta})
          }
      }else{
        this.setState({problema: true});
        let alerta = {...this.state.alerta};
        alerta.mensaje = "Parece que algo anda mal"
        alerta.mensajeStrong = "por favor actualice la página"
        this.setState({alerta: alerta})
      }
      this.setState({eventos: listaEventos});   
    }
  }

  
  handleSelectSlot = (slotInfo) => {
    //set model to true
   
    if(moment(slotInfo.start).format("YYYY-MM-DD") >= moment(new Date()).format("YYYY-MM-DD")){  
      if(moment(slotInfo.start).format("YYYY-MM-DD") >= moment(new Date()).add(this.state.diasAnticipacion,"days").format("YYYY-MM-DD")){
        let alerta = {...this.state.alerta}
        alerta.mostrar = false;
        this.setState({
          modalIsOpen: true,
          fechaMostrar: moment(slotInfo.start).format("dddd Do MMMM YYYY"),
          fecha: moment(slotInfo.start).format("YYYY-MM-DD"),
          horaInicio: moment(slotInfo.start).format("HH:mm"),
          horaFin: moment(slotInfo.end).format("HH:mm"),
          repeticion: 1,
          lugar: "",
          modificar: 0,
          visible: 1,
          alerta: alerta,
          problema: false
        });
      }else{
        this.setState({problema: true});
        let alerta = {...this.state.alerta};
        alerta.mostrar = false;
        alerta.mensaje = "Por politica de la facultad solo puede registrar/modificar su disponibilidad con mínimo "+this.state.diasAnticipacion +(this.state.diasAnticipacion ===1?" día":" días") +" de anticipación"
        alerta.mensajeStrong = ""
        this.setState({alerta: alerta})
      }
    }else{
      this.setState({problema: true});
        let alerta = {...this.state.alerta};
        alerta.mostrar = false;
        alerta.mensaje = "No puede registrar/modificar su disponibilidad en una fecha pasada"
        alerta.mensajeStrong = ""
        this.setState({alerta: alerta})
    }
  }

  handleSelectEvent = (event) => {
    //set model to true
    if(moment(event.start).format("YYYY-MM-DD") >= moment(new Date()).format("YYYY-MM-DD")){  
      if(moment(event.start).format("YYYY-MM-DD") >= moment(new Date()).add(this.state.diasAnticipacion,"days").format("YYYY-MM-DD")){      
        let alerta = {...this.state.alerta}
        alerta.mostrar = false;
        this.setState({
          modalIsOpen: true,
          fechaMostrar: moment(event.start).format("dddd Do MMMM YYYY"),
          fecha: moment(event.start).format("YYYY-MM-DD"),
          horaInicio: moment(event.start).format("HH:mm"),
          horaFin: moment(event.end).format("HH:mm"),
          idDisponibilidad: event.id,
          lugar: event.lugar,
          repeticion: event.repeticion,
          modificar: 1,
          visible:0,
          alerta: alerta,
          problema: false
        });
      }else{
        this.setState({problema: true});
        let alerta = {...this.state.alerta};
        alerta.mostrar = false;
        alerta.mensaje = "Por politica de la facultad solo puede registrar/modificar su disponibilidad con mínimo "+this.state.diasAnticipacion +(this.state.diasAnticipacion ===1?" día ":" días") +" de anticipación"
        alerta.mensajeStrong = ""
        this.setState({alerta: alerta})
      }
    }else{
      this.setState({problema: true});
        let alerta = {...this.state.alerta};
        alerta.mostrar = false;
        alerta.mensaje = "No puede registrar/modificar su disponibilidad en una fecha pasada"
        alerta.mensajeStrong = ""
        this.setState({alerta: alerta})
    }
  }

  closeDialog =() =>{ // cerrar la ventana de registro/modificacion
    this.setState({
      modalIsOpen: false,
    })
  }
  
  actualizarBandera = () =>{ //para volver a jalar los datos de la base
    this.setState({bandera:!this.state.bandera});
  }

  empezarCarga = () => { //aparece el simbolo de carga
    this.setState({loading:true});
  }

  actualizarMensaje (mensaje, mensajeStrong) {
    //console.log(mensaje);
    this.setState({alerta: {mensaje:mensaje, mensajeStrong:mensajeStrong, mostrar: true}});
  }

  activarVisibilidad = () =>{
    this.setState({visible:1})
  }

  setFacultad = (facultad) => {
    this.setState({facultad:facultad})
  }

  setAlerta = (alerta) => {
    this.setState({alerta:alerta})
  }
  renderModal = () => {
    if (!this.state.modalIsOpen) return;
    return(
      <div>
        <Dialogo datos = {this.state} closeDialog = {this.closeDialog} actualizarBandera = {this.actualizarBandera} 
        activarVisibilidad = {this.activarVisibilidad} empezarCarga = {this.empezarCarga} 
        actualizarMensaje = {(mensaje, mensajeStrong) => this.actualizarMensaje(mensaje, mensajeStrong)} closeOnDocumentClick/>
      </div>
    );    
  }
  render() {
  return (
    <>
  <ComboBoxFacultad 
    facultades = {this.state.facultades}
    facultad = {this.state.facultad}
    setFacultad = {this.setFacultad}
    alerta = {this.state.alerta}
    actualizarBandera = {this.actualizarBandera}
    setAlerta = {this.setAlerta}
    empezarCarga = {this.empezarCarga}
  />
  <br/>
  <div style={{height:`${400}px`}} className="Big-calendar-container">
    {this.state.alerta.mostrar && <Alertas severity={"success"} titulo={"Observacion"} alerta={this.state.alerta} />}
    {this.state.problema && <Alertas severity={"warning"} titulo={"Observacion"} alerta={this.state.alerta} />}
    {this.state.loading && <CircularProgress color="primary" style = {style.carga}  /> }
    <Calendar
      popup = {true}
      localizer={localizer}
      events={this.state.eventos}
      views={["month", "week"]}
      // min={new Date(0, 0, 0, 8, 0, 0)}
      // max={new Date(0, 0, 0, 20, 0, 0)}
      startAccessor="start"
      endAccessor="end"
      selectable = {true}
      onSelectEvent={event => this.handleSelectEvent(event)}
      onSelectSlot={slotInfo => this.handleSelectSlot(slotInfo)}
      messages={{
              next: "Sig",
              previous: "Ant",
              today: "Hoy",
              month: "Mes",
              week: "Semana",
              day: "Día",
              showMore: () => "Ver más"
            }            
          }
    />     
    {this.renderModal()}
  </div>
  </>);
  }
}

export default EventsCalendar;
