// @flow
// NPM Modules
import { compose } from "redux";
import { get } from "lodash";
import { withRouter } from "react-router-dom";

import React from "react";

// External Modules
import { deleteDictionary } from "@modules/shared/utils/index";

// Components
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";

// Queries & Query Constants

// Assets & Styles

type PropsType = {
  classes: *,
  history: *,
  dictionary: *,
  match: *
};

// ======================================================
// DictionaryDetailDefault Stateless Component
// ======================================================
const DictionaryDetailDefault = ({
  classes,
  history,
  dictionary,
  match
}: PropsType): React$Node => {
  const entries = get(dictionary, "entries", []);
  const title = get(dictionary, "title", "");
  const status = get(dictionary, "status", "");
  const id = get(match, "params.id", "");
  return (
    <Grid item xs={12} className={classes.gridItem}>
      <div className={classes.fab}>
        <Fab
          color="primary"
          aria-label="Edit"
          onClick={() => {
            history.push(`/dictionary/${id}/edit`);
          }}
        >
          <EditIcon />
        </Fab>
        <Fab color="secondary" aria-label="Delete">
          <DeleteIcon
            onClick={() => {
              deleteDictionary(id)
                .then((): void => history.replace("/"))
                .catch((err): * => err);
            }}
          />
        </Fab>
      </div>
      <Typography className={classes.heading}>
        Title: <span> {title}</span>
      </Typography>
      <Typography className={classes.heading}>
        Status: <span> {status}</span>
      </Typography>
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Domain</TableCell>
              <TableCell>Range</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <Entries entries={entries} classes={classes} />
          </TableBody>
        </Table>
      </Paper>
    </Grid>
  );
};

const Entries = ({ entries, classes }): React$Node => {
  return entries.map(
    ({ domain, range, id: entryId }): React$Node => {
      return (
        <TableRow key={entryId}>
          <TableCell component="th" scope="row">
            {entryId}
          </TableCell>
          <TableCell className={classes.cell} component="th" scope="row">
            {domain}
          </TableCell>
          <TableCell className={classes.cell}>{range}</TableCell>
        </TableRow>
      );
    }
  );
};

DictionaryDetailDefault.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  dictionary: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default compose(withRouter)(DictionaryDetailDefault);
