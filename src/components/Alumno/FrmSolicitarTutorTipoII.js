import React, { Component } from "react";
import * as Controller from "./../../Conexion/Controller";
import { withStyles } from "@material-ui/core";

import {
  Paper,
  Tabs,
  Tab,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  Avatar,
} from "@material-ui/core";
import TablaTutores from "./TablaTutores.js";

import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { getUser } from "../../Sesion/Sesion";
//import DialogTitle from "@material-ui/core/DialogTitle";
import CheckCircleRoundedIcon from "@material-ui/icons/CheckCircleRounded";

import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import ImagenCircular from "../Shared/ImagenCircular";
import Jloading from "../Coordinador/FormRegistroAlumno/Jloading";

const styles = (theme) => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    fontSize: "300%",
  },
  customContainer: {
    padding: theme.spacing(5),
    backgroundColor: "#ffffff",
  },
});

const style = {
  paper: {
    marginTop: "1.5%",
    display: "flex",
    flexDirection: "column",
    alignItems: "left",
    backgroundImage: "",
  },
};

class FrmSolicitarTutorTipoII extends Component {
  constructor() {
    super();
    this.state = {
      cargando: false,
      tutores: undefined, //aqui va el nombre de la tablilla
      openSolicitarTutor: false,
      openVerDispo: false,
      _tutorFijo: 0,
      mensajillo: "",
      botonDisable: false,
      actualizar: false,
    };

    {
      /* 
        this.handleOnChangePrograma = this.handleOnChangePrograma.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        */
    }
    this.handleOnClickSolicitarTutor = this.handleOnClickSolicitarTutor.bind(
      this
    );
    this.handleOnClose = this.handleOnClose.bind(this);
    this.handleOnClickVerDispo = this.handleOnClickVerDispo.bind(this);
    this.handleOnCloseVerDispo = this.handleOnCloseVerDispo.bind(this);

    //this.handleFiltroTutor=this.handleFiltroTutor.bind(this);
  }

  async handleOnClickSolicitarTutor(e, _idTutorFijo) {
    //this.setState( {openSolicitarTutor : true});

    //console.log("puto id ", e.target.id);

    //console.log("ZZZ ", _idTutorFijo);
    await this.setState({ _tutorFijo: _idTutorFijo });
    //console.log("ZZZ AFTER ", this.state._tutorFijo);

    let yo = getUser();
    const nuevaSolicitud = {
      solicitud: {
        ID_PROCESO_TUTORIA: this.props.frmIdProceso,
        ID_TUTOR: this.state._tutorFijo,
        ID_ALUMNO: yo.usuario.ID_USUARIO,
      },
    };

    const props = {
      servicio: "/api/solicitud/enviar",
      request: nuevaSolicitud,
    };

    //console.log("NUEVA SOLIXXXXX ", nuevaSolicitud);

    let sesionTyS = await Controller.POST(props);
    if (!sesionTyS) return;

    //console.log("TutoFIJOOO tYS XXX ", sesionTyS);

    if (sesionTyS.error || !sesionTyS) {
      this.setState({
        mensajillo: "UpS, Error Inesperado!    Por favor, Inténtelo más tarde.",
      });
    } else if (sesionTyS) {
      this.setState({
        mensajillo: `¡ Solicitud Registrada Satisfactoriamente ! \n Espere a que el Tutor Acepte su solicitud, Por favor, revise su bandeja.`,
      });
      this.setState({ botonDisable: true });
      this.setState({ actualizar: !this.state.actualizar });
    }

    this.setState({ openSolicitarTutor: true });
  }

  handleOnClose() {
    ////console.log("ctm",this.state.openSolicitarTutor);
    this.setState({ openSolicitarTutor: false });
    this.setState({ botonDisable: true });
  }

  //=============================================================
  handleOnClickVerDispo(e, _id, _nombre) {
    //this.setState( {openVerDispo : true});
    //console.log("EEE_handleDispo: ", { id: _id, nombre: _nombre });
    this.props.handleFiltroTutor({ id: _id, nombre: _nombre });
    this.props.modoBatallador(true);
  }

  handleOnCloseVerDispo() {
    ////console.log("ctm",this.state.openSolicitarTutor);
    this.setState({ openVerDispo: false });
  }

  shouldComponentUpdate(nextState, nextProps) {
    if (nextState.actualizar != this.state.actualizar) {
      return true;
    }
    return false;
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.actualizar != this.state.actualizar) {
      this.setState({cargando:true});
      let res = await Controller.GET({
        servicio:
          "/api/tutor/estadosolicitud/" +
          getUser().usuario.ID_USUARIO +
          "/" +
          this.props.frmIdProceso,
      });
      if (res) {
        this.props.actualizarVisibilidadColumnas(res.estado);
        if (res.estado === 0) {
          this.setState({cargando:true});
          let arregloDeTutores = await Controller.GET({
            servicio:
              "/api/tutor/lista/" +
              getUser().usuario.ROL_X_USUARIO_X_PROGRAMAs[0].ID_PROGRAMA,
          });
          /**if arreglo ttores hago lo q esta sino le meto s harcodeo */
          //console.log("arreglo: ", arregloDeTutores);

          //id del alumno
          //id del proceso de tutoria
          let arreglillo = [];
          let cont = 0;
          //console.log(res.estado)

          for (let element of arregloDeTutores.tutores) {
            cont++;
            arreglillo.push({
              campoCont: cont,
              imagen: (
                <div>
                  {/* <img
                    style={estilo.imagen}
                    src="https://files.pucp.education/profesor/img-docentes/tupia-anticona-manuel-francisco-19931850.jpg"
                  ></img> */}

                  {element.USUARIO.IMAGEN ? (
                    <ImagenCircular
                      tablas
                      src={`data:image/jpeg;base64,${element.USUARIO.IMAGEN}`}
                    />
                  ) : (
                    // <img
                    //   style={estilo.imagen}
                    //   src="https://files.pucp.education/profesor/img-docentes/tupia-anticona-manuel-francisco-19931850.jpg"
                    // ></img>
                    <Avatar
                      alt={element.USUARIO.NOMBRE.replace(/["]+/g, "")}
                      //src={props.imagen}
                      className={this.props.classes.large}
                    >
                      {element.USUARIO.NOMBRE[0].match(/[a-z]/i)
                        ? element.USUARIO.NOMBRE[0]
                        : element.USUARIO.NOMBRE[1]}
                    </Avatar>
                  )}
                </div>
              ),
              //numeroOrden: cont,
              nombre: element.USUARIO.NOMBRE + " " + element.USUARIO.APELLIDOS,
              correo: element.USUARIO.CORREO,
              /*rboton: <div>
                                <input
                                    type="radio"
                                    id="age1"
                                    name="tutor"
                                    value={element.ID_TUTOR}>
                                </input>
                            </div>,*/
              btnVerDisponibilidad: (
                <Button
                  size="large"
                  variant="outlined"
                  color="secondary"
                  onClick={(e) =>
                    this.handleOnClickVerDispo(
                      e,
                      element.ID_TUTOR,
                      element.USUARIO.NOMBRE + " " + element.USUARIO.APELLIDOS
                    )
                  }
                >
                  Ver Disponibilidad
                </Button>
              ),
              btnSolicitarTutor: (
                <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  onClick={(e) =>
                    this.handleOnClickSolicitarTutor(e, element.ID_TUTOR)
                  }
                  disabled={this.state.botonDisable}
                  //id={element.ID_TUTOR}

                  //onClick={e=>this.handleOnClick(e,element.ID_SESION,element.ID_TUTOR)}
                >
                  SOLICITAR TUTOR
                </Button>
              ),
            });
          }

          const data = {
            columns: [
              {
                title: "N°",
                field: "campoCont",
              },
              {
                title: "",
                field: "imagen",
              },
              {
                title: "Tutor",
                field: "nombre",
              },
              {
                title: "Correo Electrónico",
                field: "correo",
              },
              /*
                            {
                                title: "",
                                field: "rboton"
                            },
                            */
              {
                title: "",
                field: "btnVerDisponibilidad",
              },
              {
                title: "",
                field: "btnSolicitarTutor",
              },
            ],
            data: arreglillo,
            /*
                        [       
                        { nombre: "Alva Nuñez",correo :"ing informatica" },
                        { nombre: "Pedro Arce" ,correo :"ing informatica2"},
                        { nombre: "Alfredo Gomez",correo :"ing informatica3" },
                        { nombre: "Bill Grace",correo :"ing informatica4" },
                        { nombre: "Camilo Echeverry" ,correo :"ing informatica5"},
                        ],*/
          };

          await this.setState({ tutores: data ,cargando:false});
        } else {
          const data = {
            columns: [
              {
                title: "Observación",
                field: "mensaje",
              },

              /*}
                            {
                                title: "",
                                field: "imagen",
                            },*/
              {
                title: "Tutor",
                field: "nombre",
              },
              {
                title: "Correo electrónico",
                field: "correo",
              },
              /*
                            {
                                title: "",
                                field: "rboton"
                            },
                            */
            ],
            data: [
              {
                mensaje: res.mensaje,
                nombre:
                  res.tutor.USUARIO.NOMBRE + " " + res.tutor.USUARIO.APELLIDOS,
                correo: res.tutor.USUARIO.CORREO,
              },
            ],
          };
          await this.setState({ tutores: data ,cargando:false});
        }
      }
    }
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.frmIdProceso !== this.props.frmIdProceso) {
      
      this.setState({cargando:true});
      let res = await Controller.GET({
        servicio:
          "/api/tutor/estadosolicitud/" +
          getUser().usuario.ID_USUARIO +
          "/" +
          nextProps.frmIdProceso,
      });
      if (res) {
        this.props.actualizarVisibilidadColumnas(res.estado);
        if (res.estado === 0) {
          this.setState({cargando:true});
          let arregloDeTutores = await Controller.GET({
            servicio:
              "/api/tutor/lista/" +
              getUser().usuario.ROL_X_USUARIO_X_PROGRAMAs[0].ID_PROGRAMA,
          });
          /**if arreglo ttores hago lo q esta sino le meto s harcodeo */
          //console.log("arreglo: ", arregloDeTutores);

          //id del alumno
          //id del proceso de tutoria
          let arreglillo = [];
          let cont = 0;
          //console.log(res.estado)

          for (let element of arregloDeTutores.tutores) {
            cont++;
            arreglillo.push({
              campoCont: cont,
              imagen: (
                <div>
                  {/* <img
                    style={estilo.imagen}
                    src="https://files.pucp.education/profesor/img-docentes/tupia-anticona-manuel-francisco-19931850.jpg"
                  ></img> */}
                  {element.USUARIO.IMAGEN ? (
                    <ImagenCircular
                      tablas
                      src={`data:image/jpeg;base64,${element.USUARIO.IMAGEN}`}
                    />
                  ) : (
                    // <img
                    //   style={estilo.imagen}
                    //   src="https://files.pucp.education/profesor/img-docentes/tupia-anticona-manuel-francisco-19931850.jpg"
                    // ></img>
                    <Avatar
                      alt={element.USUARIO.NOMBRE.replace(/["]+/g, "")}
                      //src={props.imagen}
                      className={this.props.classes.large}
                    >
                      {element.USUARIO.NOMBRE[0].match(/[a-z]/i)
                        ? element.USUARIO.NOMBRE[0]
                        : element.USUARIO.NOMBRE[1]}
                    </Avatar>
                  )}
                </div>
              ),
              //numeroOrden: cont,
              nombre: element.USUARIO.NOMBRE + " " + element.USUARIO.APELLIDOS,
              correo: element.USUARIO.CORREO,
              /*rboton: <div>
                                <input
                                    type="radio"
                                    id="age1"
                                    name="tutor"
                                    value={element.ID_TUTOR}>
                                </input>
                            </div>,*/
              btnVerDisponibilidad: (
                <Button
                  size="large"
                  variant="outlined"
                  color="secondary"
                  onClick={(e) =>
                    this.handleOnClickVerDispo(
                      e,
                      element.ID_TUTOR,
                      element.USUARIO.NOMBRE + " " + element.USUARIO.APELLIDOS
                    )
                  }
                >
                  Ver Disponibilidad
                </Button>
              ),
              btnSolicitarTutor: (
                <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  onClick={(e) =>
                    this.handleOnClickSolicitarTutor(e, element.ID_TUTOR)
                  }
                  disabled={this.state.botonDisable}
                  //id={element.ID_TUTOR}

                  //onClick={e=>this.handleOnClick(e,element.ID_SESION,element.ID_TUTOR)}
                >
                  SOLICITAR TUTOR
                </Button>
              ),
            });
          }

          const data = {
            columns: [
              {
                title: "N°",
                field: "campoCont",
              },
              {
                title: "",
                field: "imagen",
              },
              {
                title: "Tutor",
                field: "nombre",
              },
              {
                title: "Correo electrónico",
                field: "correo",
              },
              /*
                            {
                                title: "",
                                field: "rboton"
                            },
                            */
              {
                title: "",
                field: "btnVerDisponibilidad",
              },
              {
                title: "",
                field: "btnSolicitarTutor",
              },
            ],
            data: arreglillo,
            /*
                        [       
                        { nombre: "Alva Nuñez",correo :"ing informatica" },
                        { nombre: "Pedro Arce" ,correo :"ing informatica2"},
                        { nombre: "Alfredo Gomez",correo :"ing informatica3" },
                        { nombre: "Bill Grace",correo :"ing informatica4" },
                        { nombre: "Camilo Echeverry" ,correo :"ing informatica5"},
                        ],*/
          };

          await this.setState({ tutores: data ,cargando:false});
        } else {
          const data = {
            columns: [
              {
                title: "Observación",
                field: "mensaje",
              },

              /*}
                            {
                                title: "",
                                field: "imagen",
                            },*/
              {
                title: "Tutor",
                field: "nombre",
              },
              {
                title: "Correo electrónico",
                field: "correo",
              },
              /*
                            {
                                title: "",
                                field: "rboton"
                            },
                            */
            ],
            data: [
              {
                mensaje: res.mensaje,
                nombre:
                  res.tutor.USUARIO.NOMBRE + " " + res.tutor.USUARIO.APELLIDOS,
                correo: res.tutor.USUARIO.CORREO,
              },
            ],
          };
          await this.setState({ tutores: data ,cargando:false});
        }
      }
    }
  }

  async componentDidMount() {
    let res = await Controller.GET({
      servicio:
        "/api/tutor/estadosolicitud/" +
        getUser().usuario.ID_USUARIO +
        "/" +
        this.props.frmIdProceso,
    });
    //console.log("RES",res);
    if (res) {
      this.props.actualizarVisibilidadColumnas(res.estado);
      if (res.estado === 0) {
        this.setState({cargando:true});
        let arregloDeTutores = await Controller.GET({
          servicio:
            "/api/tutor/lista/" +
            getUser().usuario.ROL_X_USUARIO_X_PROGRAMAs[0].ID_PROGRAMA,
        });
        /**if arreglo ttores hago lo q esta sino le meto s harcodeo */
        console.log("arreglo: ", arregloDeTutores);

        //id del alumno
        //id del proceso de tutoria
        let arreglillo = [];
        let cont = 0;
        //console.log(res.estado)

        for (let element of arregloDeTutores.tutores) {
          cont++;
          arreglillo.push({
            campoCont: cont,
            imagen: (
              <div>
                {element.USUARIO.IMAGEN ? (
                  <ImagenCircular
                    tablas
                    src={`data:image/jpeg;base64,${element.USUARIO.IMAGEN}`}
                  />
                ) : (
                  // <img
                  //   style={estilo.imagen}
                  //   src="https://files.pucp.education/profesor/img-docentes/tupia-anticona-manuel-francisco-19931850.jpg"
                  // ></img>
                  <Avatar
                    alt={element.USUARIO.NOMBRE.replace(/["]+/g, "")}
                    //src={props.imagen}
                    className={this.props.classes.large}
                  >
                    {element.USUARIO.NOMBRE[0].match(/[a-z]/i)
                      ? element.USUARIO.NOMBRE[0]
                      : element.USUARIO.NOMBRE[1]}
                  </Avatar>
                )}
              </div>
            ),
            //numeroOrden: cont,
            nombre: element.USUARIO.NOMBRE + " " + element.USUARIO.APELLIDOS,
            correo: element.USUARIO.CORREO,
            /*rboton: <div>
                            <input
                                type="radio"
                                id="age1"
                                name="tutor"
                                value={element.ID_TUTOR}>
                            </input>
                        </div>,*/
            btnVerDisponibilidad: (
              <Button
                size="large"
                variant="outlined"
                color="secondary"
                onClick={(e) =>
                  this.handleOnClickVerDispo(
                    e,
                    element.ID_TUTOR,
                    element.USUARIO.NOMBRE + " " + element.USUARIO.APELLIDOS
                  )
                }
              >
                Ver Disponibilidad
              </Button>
            ),
            btnSolicitarTutor: (
              <Button
                size="large"
                variant="contained"
                color="primary"
                onClick={(e) =>
                  this.handleOnClickSolicitarTutor(e, element.ID_TUTOR)
                }
                disabled={this.state.botonDisable}
                //id={element.ID_TUTOR}

                //onClick={e=>this.handleOnClick(e,element.ID_SESION,element.ID_TUTOR)}
              >
                SOLICITAR TUTOR
              </Button>
            ),
          });
        }

        const data = {
          columns: [
            {
              title: "N°",
              field: "campoCont",
            },
            {
              title: "",
              field: "imagen",
            },
            {
              title: "Tutor",
              field: "nombre",
            },
            {
              title: "Correo electrónico",
              field: "correo",
            },
            /*
                        {
                            title: "",
                            field: "rboton"
                        },
                        */
            {
              title: "",
              field: "btnVerDisponibilidad",
            },
            {
              title: "",
              field: "btnSolicitarTutor",
            },
          ],
          data: arreglillo,
          /*
                    [       
                    { nombre: "Alva Nuñez",correo :"ing informatica" },
                    { nombre: "Pedro Arce" ,correo :"ing informatica2"},
                    { nombre: "Alfredo Gomez",correo :"ing informatica3" },
                    { nombre: "Bill Grace",correo :"ing informatica4" },
                    { nombre: "Camilo Echeverry" ,correo :"ing informatica5"},
                    ],*/
        };

        await this.setState({ tutores: data ,cargando:false});
      } else {
        const data = {
          columns: [
            {
              title: "Observación",
              field: "mensaje",
            },

            /*}
                        {
                            title: "",
                            field: "imagen",
                        },*/
            {
              title: "Tutor",
              field: "nombre",
            },
            {
              title: "Correo electrónico",
              field: "correo",
            },
            /*
                        {
                            title: "",
                            field: "rboton"
                        },
                        */
          ],
          data: [
            {
              mensaje: res.mensaje,
              nombre:
                res.tutor.USUARIO.NOMBRE + " " + res.tutor.USUARIO.APELLIDOS,
              correo: res.tutor.USUARIO.CORREO,
            },
          ],
        };
        await this.setState({ tutores: data ,cargando:false});
      }
    }
  }

  render() {
    //console.log("propsFormTipoII:", this.props);
    if (!this.state.tutores || this.state.cargando) {
      return <Jloading mensaje={"Cargando Tutores"} size={"md"} base fondoBlanco/>;
    } else 
      return (
        <div>
          <Dialog
            open={this.state.openSolicitarTutor}
            onClose={this.handleOnClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            {/* <DialogTitle >
                        <h3 >Resultado </h3>

                    </DialogTitle> */}

            <DialogTitle id="form-dialog-title">
              <Grid container md={12} justify="center">
                {this.state.mensajillo.includes("Satisfactoriamente") ? (
                  <CheckCircleRoundedIcon
                    color="primary"
                    style={{ fontSize: 70 }}
                  />
                ) : (
                  ///caso  ups error inesperado
                  <CancelRoundedIcon color="error" style={{ fontSize: 70 }} />
                )}
              </Grid>
            </DialogTitle>
            <DialogContent>{this.state.mensajillo}</DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleOnClose}
              >
                Aceptar
              </Button>
            </DialogActions>
          </Dialog>

          <Paper elevation={0} style={style.paper}>
            {/*<TablaTutores  tutores={arregloDeTutores}  />*/}
            <TablaTutores tutores={this.state.tutores} />
          </Paper>

          <Dialog
            open={this.state.openVerDispo}
            onClose={this.handleOnCloseVerDispo}
            aria-labelledby="form-dialog-title"
          >
            <DialogContent>
              <Grid container xs={12}>
                <Paper style={style.paper}>
                  {
                    ">> Redireccionando al calendario de disponibilidades de tutores..."
                  }
                </Paper>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button
                size="large"
                variant="contained"
                color="primary"
                onClick={this.handleOnCloseVerDispo}
              >
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
  }
}

export default withStyles(styles)(FrmSolicitarTutorTipoII);

const estilo = {
  imagen: {
    width: "100%",
    borderRadius: "100%",
  },
};
