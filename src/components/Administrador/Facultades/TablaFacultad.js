import React from "react";
import MaterialTable from "material-table";
import { withStyles, makeStyles } from '@material-ui/core/styles';


function Tabla(props) {

    return (      
      <MaterialTable 
        //className={classes.table} 
        title=""
        columns={props.facultades.columns}
        data={props.facultades.data}

        options={{
          rowStyle: {
             backgroundColor: '#FFF',
           },
           headerStyle: {
            backgroundColor: '#3AAFA9',
            color: '#FFF',
            fontSize: 16
          },
        }}
       
      />
    );
  }
export default Tabla;
