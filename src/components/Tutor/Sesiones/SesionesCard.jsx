import React, { Component } from "react";
import {
  Grid,
  Chip,
  Paper,
  Typography,
  Button,
  Dialog,
  Avatar,
  withStyles,
} from "@material-ui/core";
import ImagenCircular from "../../Shared/ImagenCircular";
import RevisarSesion from "./RevisarSesion";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
const stylesXXX = (theme) => ({
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
const styles = {
  paper1: {
    borderTop: "3px solid #3AAFA9",
    backgroundColor: "#cccccc",
  },
  paper2: {
    borderTop: "3px solid #3AAFA9",
    backgroundColor: "#ffffff",
  },
  chip: {
    textAlign: "center",
    display: "flex"
  },
};

class SesionesCard extends Component {
  constructor() {
    super();
    this.state = {
      tutores: {
        columns: [
          {
            title: "Nombre",
            field: "nombre",
          },
        ],
        data: [{ nombre: "" }],
      }, //aqui va el nombre de la tablilla
      open: false,
    };

    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleOnClose = this.handleOnClose.bind(this);
  }

  //=============================================================
  handleOnClick() {
    this.setState({ open: true });
  }

  handleOnClose() {
    this.props.refreshCalendarioCitas();
    this.setState({ open: false });
  }

  render() {
    const cita = this.props.cita;
    console.log("PERRO", cita);
    // si es que es pospuesta o futura
    if (cita.ESTADO.includes("03") || cita.ESTADO.includes("04")) {
      return (
        <>
          <Button onClick={this.handleOnClick}>
            <Paper style={styles.paper2}>
              {/** Encabezado Imagen y nombre */}
              <Grid container spacing={0} >
                {/** IMAGEN  */}
                <Grid item md={3} xs={3}>
                  {/* <ImagenCircular src="https://www.w3schools.com/howto/img_avatar.png" /> */}
                  {
                    cita.PROCESO_TUTORIum.GRUPAL === 1 ? (
                      <ImagenCircular
                        src="https://ututor-recursos.s3.amazonaws.com/WhatsApp+Image+2020-08-02+at+5.06.55+PM.jpeg"
                      />
                    ) : (
                        cita.ALUMNOs[0].USUARIO.IMAGEN ? (
                          <ImagenCircular
                            src={`data:image/jpeg;base64,${cita.ALUMNOs[0].USUARIO.IMAGEN}`}
                          />
                        ) : (
                            <ImagenCircular src="https://www.w3schools.com/howto/img_avatar.png" />
                          )
                      )
                  }


                </Grid>

                {/** NOMBRE-APELLIDOS  */}
                <Grid item md={9} xs={9}>

                  {
                    cita.PROCESO_TUTORIum.GRUPAL ?
                      <>
                        <Grid item md={12} xs={12}>
                          <Typography component="paragraph">
                            Grupal
                          </Typography>
                        </Grid>
                      </>
                      :
                      <>

                        <Grid item md={12} xs={12}>
                          <Typography component="paragraph">
                            {cita.ALUMNOs[0].USUARIO.NOMBRE + " "}
                          </Typography>
                        </Grid>
                        <Grid item md={12} xs={12}>
                          <Typography component="paragraph">
                            {cita.ALUMNOs[0].USUARIO.APELLIDOS}
                          </Typography>
                        </Grid>

                      </>
                  }


                </Grid>
              </Grid>

              {/* Las horas */}
              <Grid container spacing={0} alignContent="center">
                <Grid item md={6} xs={6}>
                  <Chip
                    label={cita.HORA_INICIO}
                    color="primary"
                    size="small"
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={6}>
                  <Chip
                    label={cita.HORA_FIN}
                    color="primary"
                    size="small"
                    variant="outlined"
                  />
                </Grid>
                {/**fin minicontainer */}
              </Grid>
            </Paper>
          </Button>
          <RevisarSesion
            cita={this.props.cita}
            fexaForm={this.props.fexaForm}
            open={this.state.open}
            onClose={this.handleOnClose}
          />

          <br />
        </>
      );
    } else {
      return (
        <>
          <Button onClick={this.handleOnClick}>
            <Paper style={styles.paper1}>
              {/** Encabezado Imagen y nombre */}
              <Grid container spacing={0} >
                {/** IMAGEN  */}
                <Grid item md={3} xs={3}>
                  {/* <ImagenCircular src="https://www.w3schools.com/howto/img_avatar.png" /> */}
                  {
                    cita.PROCESO_TUTORIum.GRUPAL === 1 ? (
                      <ImagenCircular
                        src="https://ututor-recursos.s3.amazonaws.com/WhatsApp+Image+2020-08-02+at+5.06.55+PM.jpeg"
                      />
                    ) : (
                        cita.ALUMNOs[0].USUARIO.IMAGEN ? (
                          <ImagenCircular
                            src={`data:image/jpeg;base64,${cita.ALUMNOs[0].USUARIO.IMAGEN}`}
                          />
                        ) : (
                            <ImagenCircular src="https://www.w3schools.com/howto/img_avatar.png" />
                          )
                      )
                  }
                </Grid>

                {/** NOMBRE-APELLIDOS  */}
                <Grid item md={9} xs={9}>
                  {/* {cita.ALUMNOs[0].USUARIO.NOMBRE.split()[0] + " " + cita.ALUMNOs[0].USUARIO.APELLIDOS.split()[0]} */}

                  {/* <Typography
                    variant="button"
                    component="h5"
                    style={styles.control}
                    display="block"
                    gutterBottom
                  >
                  
                  {cita.PROCESO_TUTORIum.GRUPAL
                    ? "Sesión  --  Grupal"
                    : cita.ALUMNOs[0].USUARIO.NOMBRE.split()[0] +
                    " " +
                    cita.ALUMNOs[0].USUARIO.APELLIDOS.split()[0]}

                  </Typography> */}


                  {
                    cita.PROCESO_TUTORIum.GRUPAL ?
                      <>
                        <Grid item md={12} xs={12}>
                          <Typography component="paragraph">
                            Grupal
                          </Typography>
                        </Grid>
                      </>
                      :
                      <>

                        <Grid item md={12} xs={12}>
                          <Typography component="paragraph">
                            {cita.ALUMNOs[0].USUARIO.NOMBRE + " "}
                          </Typography>
                        </Grid>
                        <Grid item md={12} xs={12}>
                          <Typography component="paragraph">
                            {cita.ALUMNOs[0].USUARIO.APELLIDOS}
                          </Typography>
                        </Grid>

                      </>
                  }
                </Grid>
              </Grid>

              {/* Las horas */}
              <Grid container spacing={0} alignContent="center">
                <Grid item md={6} xs={6}>
                  <Chip
                    label={cita.HORA_INICIO}
                    color="primary"
                    size="small"
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={6}>
                  <Chip
                    label={cita.HORA_FIN}
                    color="primary"
                    size="small"
                    variant="outlined"
                  />
                </Grid>
                {/**fin minicontainer */}
              </Grid>
            </Paper>
          </Button>

          <RevisarSesion
            cita={this.props.cita}
            fexaForm={this.props.fexaForm}
            open={this.state.open}
            onClose={this.handleOnClose}
          />

          {/* <Dialog
            open={this.state.open}
            onClose={this.handleOnClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogContent>
  
              <RevisarSesion cita={this.props.cita}
                fexaForm={this.props.fexaForm}   />
  
            </DialogContent>
  
            <DialogActions>
              
            </DialogActions>
          </Dialog> */}

          <br />
        </>
      );
    }
  }
}

export default withStyles(stylesXXX)(SesionesCard);
