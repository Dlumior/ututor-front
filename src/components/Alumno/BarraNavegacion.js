import React from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import NoteAddRoundedIcon from '@material-ui/icons/NoteAddRounded';
import AccountBalanceRoundedIcon from '@material-ui/icons/AccountBalanceRounded';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import SupervisorAccountRoundedIcon from '@material-ui/icons/SupervisorAccountRounded';
import AssessmentRoundedIcon from '@material-ui/icons/AssessmentRounded';
import TodayRoundedIcon from '@material-ui/icons/TodayRounded';
import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded";
import DateRangeRoundedIcon from '@material-ui/icons/DateRangeRounded';
import { Link as LinkRouter } from "react-router-dom";
import { logOut } from "../../Sesion/actions/sesionAction";
import { useUserValue } from "../../Sesion/Sesion";

const drawerWidth = 250;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    //padding: theme.spacing(3), -> innecesario,malogra el diseño
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

const BarraNavegacion = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  
  const [{},dispatch] = useUserValue();
  const handleClick = () => {
    //te odio hooks
    console.log("Alumno LOG OUTTTTT",props);
    logOut(dispatch);
  }
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Ututor
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          {[
            "Perfil",
            "Agendar Cita",
            "Mis Citas",
          ].map((text, index) => (
            <ListItem
              button
              key={text}
              component={LinkRouter}
              to={"/alumno/" + text.split(' ').join('').toLowerCase()}
              
            >
              <ListItemIcon>
                {index === 0 ? <AccountCircleRoundedIcon /> : 
                 index === 2 ? <DateRangeRoundedIcon /> : 
                 index === 1 ? <TodayRoundedIcon/> :
                 <NoteAddRoundedIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}

          <ListItem
              button
              key={"Cerrar Sesion"}
              component={LinkRouter}
              to={"/"}
              onClick={handleClick}
            >
              <ListItemIcon>
                  <ExitToAppRoundedIcon/>
              </ListItemIcon>
              <ListItemText primary={"Cerrar Sesion"} />
            </ListItem>
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        {props.contenido}
        {props.children}
      </main>
    </div>
  );
};

export default BarraNavegacion;
