import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import * as Conexion from "./../../../Conexion/Controller";
import { InputLabel, Paper } from "@material-ui/core";
const estilos = {
  paper: {
    marginTop: "1%",
    marginRight: "10%",
    marginLeft: "10%",
    flexDirection: "column",
    backgroundImage: "",
  },
};

class ListaEtiquetas extends React.Component {
  constructor() {
    super();
    this.state = {
      etiquetas: [],
      etiquetasSeleccionadas: [],
      icon: <CheckBoxOutlineBlankIcon fontSize="small" color="primary" />,
      checkedIcon: <CheckBoxIcon fontSize="small" color="primary" />,
    };
    this.handle = this.handle.bind(this);
  }
  async componentDidMount() {
    let listaEtiquetas = await Conexion.GET({ servicio: this.props.enlace });
    console.log("Etiquetas", listaEtiquetas);
    this.setState({ etiquetas: listaEtiquetas.etiquetas });

    console.log("etiquetas del state", this.state.etiquetas);
  }
  handle = (etiqueta, valor) => {
    let etiquetaSeleccionada = { id: etiqueta, agregar: valor };
    let etiquetas = this.state.etiquetasSeleccionadas;
    let found = false;
    let change = false;
    etiquetas.forEach((element) => {
      //console.log("element",element);
      if (element.id === etiquetaSeleccionada.id) {
        found = true;
        if (element.agregar !== etiquetaSeleccionada.agregar) {
          element.agregar = etiquetaSeleccionada.agregar;
          change = true;
        }
      }
    });
    if (!found || change) {
      if (!found) {
        etiquetas.push(etiquetaSeleccionada);
      }
      this.setState({ etiquetasSeleccionadas: etiquetas });
      this.props.obtenerEtiquetas(this.state.etiquetasSeleccionadas);
    }
  };
  render() {
    return (
      <Paper elevation={0} style={estilos.paper}>
        <br />
        <InputLabel id="demo-simple-select-placeholder-label-label">
          {this.props.titulo}
        </InputLabel>
        <br />
        <Autocomplete
          color="primary"
          multiple
          options={this.state.etiquetas}
          disableCloseOnSelect
          getOptionLabel={(etiqueta) => etiqueta.DESCRIPCION}
          renderOption={(option, { selected }) => {
            this.handle(option.ID_ETIQUETA, selected);
            return (
              <React.Fragment>
                <Checkbox
                  color="primary"
                  checkedIcon={this.state.checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.DESCRIPCION}
              </React.Fragment>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Etiquetas"
              color="primary"
            />
          )}
        />
      </Paper>
    );
  }
}

export default ListaEtiquetas;
/*
<Autocomplete
        
        color="primary"
        multiple
        id="tags-filled"
        options={this.state.etiquetas}
        renderTags={(value, getTagProps) =>
           
          value.map((option, index) => 
            <Chip color="primary" variant="outlined" label={option.DESCRIPCION} {...getTagProps({ index })} />
          )
        }
        renderInput={(params) => (
          <TextField {...params} color="primary" variant="outlined" label="Etiquetas" />
        )}
      />*/
