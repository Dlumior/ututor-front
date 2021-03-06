import React, {useEffect,useCallback, useRef} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    marginTop:"3%",
    backgroundColor: theme.palette.background.paper,
  },
}));

const Roles = (props) => {
  
  const rols=['Tutor','Alumno'];
  const classes = useStyles();
  const {disabled,roles,setRoles,datos}=props;

  const handleToggle = (ind,value) => () => {
    const currentIndex =roles.indexOf(ind+3);//cambio por coordP
    if (currentIndex === -1) {
      roles.push(ind+3);//cambio por coordP
    } else {
      roles.splice(currentIndex,1);
    }
    setRoles({
      ...datos,
      roles:roles
    });
};

  return (

      <div>
          {
          <List dense className={classes.root}>
          <h3>Roles:</h3>
            {rols.map((value,index) => {
                const labelId = `checkbox-list-secondary-label-${value}`;
                return (
                <ListItem key={index}   button>
                    <ListItemText id={labelId} primary={value} />
                    <ListItemSecondaryAction>
                    {<Checkbox
                        disabled={disabled}
                        edge="end"
                        color="primary"
                        id={index}
                        onChange={handleToggle(index,value)}
                        checked={roles.indexOf(index+3)!==-1}//si el rol esta en el arreglo checked
                        inputProps={{ 'aria-labelledby': labelId }}                        
                    >
                      {/*console.log("vemaos:",roles[index],index+2)*/}
                    </Checkbox>}
                    </ListItemSecondaryAction>
                </ListItem>
                );
            })}
            </List>}
      </div>
  );
}

export default Roles;