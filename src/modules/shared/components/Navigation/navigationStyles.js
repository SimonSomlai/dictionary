// @flow
const drawerWidth = 240;

export const styles = (theme: *): * => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap"
  },
  menuButton: {
    outline: "none",
    position: "fixed",
    top: "15px",
    left: "15px",
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    cursor: "pointer",
    "&:focus": {
      outline: "none"
    }
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  activeItem: {
    backgroundColor: "rgba(0, 0, 0, 0.08)"
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: "hidden",
    width: theme.spacing.unit * 7 + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing.unit * 9 + 1
    }
  },
  listItem: {
    color: "white",
    paddingLeft: 23,
    textTransform: "capitalize"
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  button: {
    outline: "none !important",
    cursor: "pointer"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3
  }
});
