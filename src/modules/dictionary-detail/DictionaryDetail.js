/* eslint-disable max-statements */
// @flow
// NPM Modules
import { compose } from "redux";
import { get, isEmpty, set } from "lodash";
import { withRouter } from "react-router-dom";
import Joi from "@hapi/joi";
import React, { useState } from "react";

// External Modules
import { deleteDictionary } from "@modules/shared/utils/index";
import { generateId } from "@modules/shared/utils/index";

// Components
import { Loader } from "@modules/shared/components/index";
import { withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
// import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";
import SaveIcon from "@material-ui/icons/Save";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

// Queries & Query Constants

// Assets & Styles
import { styles } from "./dictionaryDetailStyles";

type PropsType = {
  dictionaryDetailData: *,
  classes: *,
  editMode: boolean,
  history: *
};

/**
 * DictionaryDetail
 */
const hasDuplicates = (a, b): boolean => {
  return a.domain === b.domain && a.range === b.range;
};
const hasForks = (a, b): boolean => {
  return a.domain === b.domain;
};
const hasCycles = (a, b): boolean => {
  return a.domain === b.range && a.range === b.domain;
};
const hasChains = (a, b): boolean => {
  return a.range === b.domain || b.range === a.domain;
};

const comparator = (a, b): boolean => {
  return (
    hasDuplicates(a, b) || hasForks(a, b) || hasCycles(a, b) || hasChains(a, b)
  );
};

const getErrorStatus = ({ value: a, dupeValue: b }): * => {
  const duplicates = hasDuplicates(a, b);
  const forks = hasForks(a, b);
  const cycles = hasCycles(a, b);
  const chains = hasChains(a, b);

  switch (true) {
    case duplicates:
      return {
        message: "Duplicate domain & range detected",
        severity: 2
      };
    case forks:
      return { message: "Forked entry detected", severity: 2 };
    case cycles:
      return { message: "Cyclical entry detected", severity: 3 };
    case chains:
      return { message: "Chained entry detected", severity: 2 };
    default:
      break;
  }
};

const dictionaryValidations = Joi.object().keys({
  id: Joi.string().required(),
  title: Joi.string()
    .min(1)
    .max(30)
    .required(),
  status: Joi.string().required(),
  entries: Joi.array()
    .unique(comparator)
    .items(
      Joi.object().keys({
        id: Joi.string().required(),
        domain: Joi.string()
          .min(1)
          .max(30)
          .required(),
        range: Joi.string()
          .min(1)
          .max(30)
          .required()
      })
    )
});

const DictionaryDetail = ({
  editMode,
  dictionaryDetailData: { loading, data: dictionary, error },
  classes,
  history
}: PropsType): React$Node => {
  const [validationError, setValidationError] = useState({});
  const [editedDictionary, updateDictionary] = useState({});

  if (editMode && isEmpty(editedDictionary) && !isEmpty(dictionary)) {
    updateDictionary(dictionary);
  }

  const getDictionary = (): * => (editMode ? editedDictionary : dictionary);
  const entries = get(getDictionary(), "entries", []);
  const title = get(getDictionary(), "title", "");
  const status = get(getDictionary(), "status", "");
  const id = get(getDictionary(), "id", null);

  if (loading) return <Loader />;

  const addDictionaryEntry = () => {
    updateDictionary({
      ...editedDictionary,
      entries: [
        ...editedDictionary.entries,
        { id: generateId(), domain: "", range: "" }
      ]
    });
  };

  const deleteDictionaryEntry = entryId => {
    const shouldDelete = window.confirm(
      "Are you sure that you want to delete this entry?"
    );

    if (shouldDelete) {
      const newEntries = editedDictionary.entries.filter(
        ({ id }): boolean => id !== entryId
      );
      updateDictionary({
        ...editedDictionary,
        entries: newEntries
      });
    }
  };

  const validateDictionary = (): Promise<any> => {
    // console.log("validate");
    return new Promise((resolve, reject) => {
      Joi.validate(editedDictionary, dictionaryValidations)
        .then(({ ...success }): void => setValidationError({}))
        .catch(({ details }) => {
          const { context, type, path, message } = get(details, "[0]", {});
          switch (type) {
            case "array.unique": {
              setValidationError(set({}, path, getErrorStatus(context)));
              break;
            }
            default:
              setValidationError(set({}, path, { message, severity: 1 }));
          }
        });
    });
  };
  // console.log(errors);
  const handleInputChange = event => {
    const path = get(event, "target.name", null);
    const value = get(event, "target.value", null);
    const newDictionary = set(
      { ...dictionary, ...editedDictionary },
      path,
      value
    );
    updateDictionary(newDictionary);
  };

  const hasError = (path): boolean => {
    return !isEmpty(get(validationError, path, {}));
  };

  const getErrorMessage = (path): string => {
    if (!hasError(path)) return "";
    return get(validationError, path + "[message]", "");
  };

  const renderEditMode = (): React$Node => {
    return (
      <Grid item xs={12} className={classes.gridItem}>
        <div className={classes.fab}>
          <Fab color="primary" aria-label="Save" onClick={validateDictionary}>
            <SaveIcon />
          </Fab>
          <Fab color="secondary" aria-label="Delete">
            <DeleteIcon
              onClick={() => {
                deleteDictionary(id)
                  .then((): void => history.replace("/"))
                  .catch(err => {});
              }}
            />
          </Fab>
        </div>
        <TextField
          id="standard-name"
          label="title"
          name="title"
          className={classes.textField}
          defaultValue={title}
          onChange={e => {
            handleInputChange(e);
          }}
          margin="normal"
          error={hasError("title")}
          helperText={getErrorMessage("title")}
        />
        <TextField
          id="standard-name"
          label="status"
          className={classes.textField}
          defaultValue={status}
          margin="normal"
          disabled
        />
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Range</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.map(
                (entry, index): React$Node => (
                  <TableRow key={entry.id}>
                    <TableCell
                      className={classes.cell}
                      component="th"
                      scope="row"
                    >
                      {entry.id}
                    </TableCell>
                    <TableCell
                      className={classes.cell}
                      component="th"
                      scope="row"
                    >
                      <TextField
                        id="standard-name"
                        label="domain"
                        className={classes.textField}
                        defaultValue={entry.domain}
                        name={`entries[${index}].domain`}
                        onChange={e => {
                          handleInputChange(e);
                        }}
                        margin="normal"
                        error={
                          hasError(`entries[${index}].domain`) ||
                          hasError(`entries[${index}]`)
                        }
                        helperText={
                          getErrorMessage(`entries[${index}].domain`) ||
                          getErrorMessage(`entries[${index}]`)
                        }
                      />
                    </TableCell>
                    <TableCell className={classes.cell}>
                      <TextField
                        id="standard-name"
                        label="range"
                        className={classes.textField}
                        defaultValue={entry.range}
                        name={`entries[${index}].range`}
                        onChange={e => {
                          handleInputChange(e);
                        }}
                        margin="normal"
                        error={
                          hasError(`entries[${index}].range`) ||
                          hasError(`entries[${index}]`)
                        }
                        helperText={
                          getErrorMessage(`entries[${index}].range`) ||
                          getErrorMessage(`entries[${index}]`)
                        }
                      />
                    </TableCell>
                    <TableCell className={classes.cell}>
                      <Fab color="secondary" aria-label="Delete">
                        <DeleteIcon
                          onClick={() => {
                            deleteDictionaryEntry(entry.id);
                          }}
                        />
                      </Fab>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
          <div className={classes.addButtonRow}>
            <Fab
              color="primary"
              aria-label="Add"
              onClick={(): void => addDictionaryEntry()}
            >
              <AddIcon />
            </Fab>
          </div>
        </Paper>
      </Grid>
    );
  };

  const renderDefaultMode = (): React$Node => {
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
                  .catch(err => {});
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
              {entries.map(
                (entry): React$Node => (
                  <TableRow key={entry.id}>
                    <TableCell
                      className={classes.cell}
                      component="th"
                      scope="row"
                    >
                      {entry.id}
                    </TableCell>
                    <TableCell
                      className={classes.cell}
                      component="th"
                      scope="row"
                    >
                      {entry.domain}
                    </TableCell>
                    <TableCell className={classes.cell}>
                      {entry.range}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    );
  };

  return (
    <Grid container spacing={24} className={classes.grid}>
      {editMode ? renderEditMode() : renderDefaultMode()}
    </Grid>
  );
};

DictionaryDetail.propTypes = {
  classes: PropTypes.object.isRequired,
  dictionaryDetailData: PropTypes.object.isRequired,
  editMode: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired
};

export default compose(
  withRouter,
  withStyles(styles)
)(DictionaryDetail);
