export const styles = theme => ({
  grid: {
    padding: "50px 200px"
  },
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3
  },
  tableWrapper: {
    overflowX: "auto"
  },
  cell: {
    textTransform: "capitalize"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    width: "100%",
    position: "relative",
    display: "flex",
    alignItems: "baseline",
    marginBottom: "10px",
    "& span": {
      fontWeight: "bold",
      verticalAlign: "baseline"
    }
  },
  fab: {
    margin: theme.spacing.unit,
    marginLeft: "auto",
    float: "right",
    "& button": {
      marginRight: "10px"
    }
  },
  textField: {
    width: "100%"
  },
  addButtonRow: {
    width: "100%",
    display: "flex",
    padding: "15px 0",
    justifyContent: "center"
  }
});
