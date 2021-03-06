import React,{useState,useEffect} from "react";
//import useFetchData from "../../Conexion/useFetchData";
import { GET } from "../../../Conexion/Controller";
import { Grid, Button} from "@material-ui/core";
import { Paper} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import IconButton from '@material-ui/core/IconButton';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';

import * as Controller from "../../../Conexion/Controller";
import ComboBoxFacus from "../RegistrarCoordPrograma/ComboBoxFacus";
import { getUser } from "../../../Sesion/Sesion";
import ComboBoxPrograma from "../FormRegistroTutor/comboBoxProgramas";
import Roles from "./Roles";
import RolesCoordP from "./RolesCoordP";
import Alertas from "../../Coordinador/Alertas";
import { findAllByTestId } from "@testing-library/react";


const style = {
    paper: {
      marginTop: "3%",
      marginLeft: "3%",
      marginRight:"3%",
      marginBottom:"3%",
      display: "flex",
      flexDirection: "column",
      alignItems: "left",
      backgroundImage: "",
    }
  };


  const FrmAsignarRoles = () => {
    const [datosForm, setDatosForm] = React.useState({
      usuarioCodigo:0,
      usuarioNombre:'',
      idUsuario:getUser().usuario.ID_USUARIO,
      roles:[],
      idPrograma:'',
    });
  const [esCoordFacu, setEsCoordFacu]=useState(true);
  const [deshabilitar, setDeshabilitar] = useState(true);
  const [facultades, setFacultades] = useState([]);
  const [facultad, setFacultad] = useState([]);
  const [programas, setProgramas] = useState([]);
  const [programa, setPrograma] = useState([]);
  const [roles, setRoles] = useState([]);
  const [alerta, setAlerta]= useState({
    mensajeStrong: "",
    mensajeStrongError: "por favor revisalos!",
    mensajeStrongExito: "satisfactoriamente!",
    mensajeError: "Existen errores al completar el formulario",
    mensajeExito: "Facultad registrada",
    mensaje: "",
  });
  const [severidad, setSeveridad] = useState({
    severidad:"error",
    severW:"warning",
    severE:"error",
    severS:"success"
  });

//faultades por coordinador de facu o prog

useEffect(() => {
    async function fetchData() {
        //console.log("cpp",getUser().rol );
      if(getUser().rol === "Coordinador Facultad"){
        const endpoint = "/api/facultad/coordinador/"+getUser().usuario.ID_USUARIO;
        const params = { servicio: endpoint };
        const res = await GET(params);    
        //console.log("facultades:", res);
        if (res){
            setFacultades(res.facultades);
            setEsCoordFacu(true);
        }
        //console.log("facultad:", facultades);
      }else{
        const endpoint = "/api/facultad/lista/"+getUser().usuario.ID_USUARIO;
        const params = { servicio: endpoint };
        const res = await GET(params);    
        //console.log("ENTREE:", res);
        if (res){
            setFacultades(res.facultades);
            setEsCoordFacu(false);
        }
        //console.log("facultades:", facultades);
      }
    }
     fetchData();
  }, {});

    //programas a partir de un coordinador de Facultad
    useEffect(() => {
        async function fetchData() {
            if (getUser().rol ==="Coordinador Programa"){
                const endpoint = "/api/programa/lista/"+getUser().usuario.ID_USUARIO+"/"+facultad;
                const params = { servicio: endpoint };
                const res = await GET(params);    
                //console.log("proogramasss:", res);
                if (res){
                    setProgramas(res.programas);
                }
                //console.log("proograma:", programa);
            }else{
                const endpoint = "/api/programa/lista/"+facultad;
                const params = { servicio: endpoint };
                const res = await GET(params);    
                //console.log("proogramasss:", res);
                if (res){
                    setProgramas(res.programa);
                }
                //console.log("proograma:", programa);
            }
        }     
        if (facultad!=""){
            fetchData();
        }
    },[facultad]);
    //rolesxprograma
    useEffect(() => {
        async function fetchData() {
        const endpoint = "/api/usuario/rol/"+datosForm.idUsuario+"/"+programa;
        const params = { servicio: endpoint };
        const res = await GET(params);    
        //console.log("roles:", res);
        if (res){
            let arrRoles=[];
            for (let element of res.roles){
                arrRoles.push(element.ROL.ID_ROL);
            }
            //console.log("arrRoles: ",arrRoles);
            datosForm.roles=arrRoles;
            setRoles(res.roles);
            //console.log("roles",roles);
            //console.log("datosForm.usuarioCodigo",datosForm.usuarioCodigo);
            if (datosForm.usuarioCodigo!==0){
                setDeshabilitar(false);
            }
        }
        //console.log("roles:", datosForm.roles);
        }
        if (programa!=""){
        fetchData();
        }
    },[programa]);
  

    async function fetchData(cod) {
        const endpoint = "/api/usuario/buscar/"+cod;
        const params = { servicio: endpoint };
        const res = await GET(params);
        //console.log("res",res);
        if (res){
            if (res.usuario===null){
                setSeveridad({
                    severidad:"error",
                  }); 
                  setAlerta({
                    mensaje:"No existe ningún usuario con ese código",
                  }); 
                  //console.log("severidad= ",severidad.severidad);
    
            }else{
                setDatosForm({
                    ...datosForm,
                    usuarioNombre: res.usuario.NOMBRE+' '+res.usuario.APELLIDOS,
                    idUsuario:res.usuario.ID_USUARIO,
                }); 
            }
        }       
        
    }

    const handleName = (e) => {
        //console.log("cod",e.target.value);
        setDatosForm({
          ...datosForm,
          usuarioCodigo: e.target.value,
        });
    };
    
    const handleClick = async(e) =>{
        if (datosForm.idUsuario==='' || datosForm.usuarioCodigo==='' || 
            datosForm.usuarioNombre==='' || facultades.length===0){
                setSeveridad({
                    severidad:"error",
                  }); 
                  setAlerta({
                    mensaje:"Complete los campos obligatorios (*)",
                  }); 
                

            }else{
                const nuevaAsignacion = {
                    asignacion: {
                        ID_USUARIO: datosForm.idUsuario,
                        ID_ROLES: datosForm.roles,
                        ID_PROGRAMA: programa,
                    },
                    };
                    //console.log("lo que va:", nuevaAsignacion);
            
                    const props = { servicio: "/api/usuario/asignarrol", request: nuevaAsignacion };
                    //console.log("saving new asignacion in DB:", nuevaAsignacion);
                    let asignado = await Controller.POST(props);
                    //console.log("asignado",asignado);
                    if (asignado) {
                          setSeveridad({
                            severidad:"success",
                          }); 
                          setAlerta({
                            mensaje:"Los roles se han registrado satisfactoriamente",
                          }); 
                    }
                    //console.log("got updated alumno from back:", asignado);
            }

    }
    return(
        <div>
            <Paper elevation={0} style={style.paper} direction="row">
                <Alertas
                severity={severidad.severidad}
                titulo={"Observacion:"}
                alerta={alerta}
                />
                <Paper elevation={0} style={style.paper} >
                    <Grid container md={12} spacing={3} >
                        <Grid item md={3} >
                            <TextField
                                required
                                id="codigo  "
                                label="Código"
                                variant="outlined"
                                onChange={(e) => handleName(e)}
                                fullWidth   
                            />
                        </Grid>
                        <Grid item md={1} >
                            <IconButton color="primary" onClick={()=> fetchData(datosForm.usuarioCodigo)}>
                            <SearchRoundedIcon
                                color="primary"
                                fontsize="large" />
                            </IconButton> 
                        </Grid>
                        <Grid item md={7}>
                            <TextField
                                aria-readonly
                                id="usuario"
                                label="Usuario"
                                value={datosForm.usuarioNombre}
                                fullWidth   
                            />
                        </Grid>
                        <Grid item md={4}>
                            <ComboBoxFacus
                                facultades={facultades}
                                facultad={facultad}
                                setFacultad={setFacultad}
                            /> 
                        </Grid>
                        <Grid item md={4}>
                            <ComboBoxPrograma
                                programas={programas}
                                programa={programa}
                                setPrograma={setPrograma}
                                />
                        </Grid>
                    </Grid>
                    <Grid container md={12} spacing={3} justify="space-between" alignItems="flex-end">
                        <Grid item md={10}>
                            {esCoordFacu &&
                            <Roles
                                disabled={deshabilitar}
                                datos={datosForm}
                                roles={datosForm.roles}
                                setRoles={setDatosForm}
                            />}
                            {esCoordFacu===false &&
                            <RolesCoordP
                                disabled={deshabilitar}
                                datos={datosForm}
                                roles={datosForm.roles}
                                setRoles={setDatosForm}
                            />}
                        </Grid>
                        <Grid item md={2} >
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleClick}>
                                Guardar
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Paper>
        </div>
    );



}

export default FrmAsignarRoles;

const estilo={
    imagen:{
        width :"75%"
    }
}
