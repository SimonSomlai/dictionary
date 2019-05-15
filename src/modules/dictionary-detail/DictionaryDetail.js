/* eslint-disable smells/no-this-assign */
/* eslint-disable max-statements */
// @flow
// NPM Modules
import { compose } from "redux";
import { findIndex, get, isEmpty, set, uniqWith } from "lodash";
import { withRouter } from "react-router-dom";
import Joi from "@hapi/joi";
import React, { PureComponent } from "react";

// External Modules
import {
  createDictionary,
  deleteDictionary,
  updateDictionary
} from "@modules/shared/utils/index";
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
  history: *,
  refetch: *,
  match: *
};

type StateType = {
  validationErrors: *,
  editedDictionary: *
};

const DEFAULT_SEVERITY = 1;
/**
 * DictionaryDetail
 */
class DictionaryDetail extends PureComponent<PropsType, StateType> {
  // ------------------------------------
  // React Lifecycle Functions
  // ------------------------------------
  constructor(props) {
    super(props);
    this.state = {
      validationErrors: {},
      editedDictionary: {}
    };
  }

  componentDidUpdate(previousProps) {
    const {
      state: { editedDictionary },
      props: {
        editMode,
        dictionaryDetailData: { loading, data: dictionary }
      }
    } = this;
    const wasEditing = get(previousProps, "match.params.mode", "") === "edit";
    const isCreating = get(this.props, "match.params.mode", "") === "new";

    if (wasEditing && isCreating) {
      this.setState(
        (old): * => ({
          ...old,
          editedDictionary: {}
        })
      );
    }

    if (editMode && !loading && isEmpty(editedDictionary)) {
      this.setState(
        (old): * => ({
          ...old,
          editedDictionary: dictionary
        })
      );
    }
  }

  // ------------------------------------
  // Render Functions
  // ------------------------------------
  render(): React$Node {
    const {
      classes: { grid },
      dictionaryDetailData: { loading },
      editMode
    } = this.props;

    if (loading) return <Loader />;

    return (
      <Grid container spacing={24} className={grid}>
        {editMode ? this.renderEditMode() : this.renderDefaultMode()}
      </Grid>
    );
  }

  renderEditMode = (): React$Node => {
    const {
      props: { classes, history, match },
      state: { editedDictionary: dictionary }
    } = this;

    const entries = get(dictionary, "entries", []);
    const title = get(dictionary, "title", "");
    const status = get(dictionary, "status", "");
    const id = get(match, "params.id", "");

    return (
      <Grid item xs={12} className={classes.gridItem}>
        <div className={classes.fab}>
          <Fab
            color="primary"
            aria-label="Save"
            onClick={this.validateDictionary}
          >
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
          value={title}
          onChange={e => {
            this.handleInputChange(e);
          }}
          margin="normal"
          error={this.hasError("title")}
          helperText={this.getErrorMessage("title")}
        />
        <TextField
          id="standard-name"
          label="status"
          className={classes.textField}
          value={status}
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
                ({ domain, range, id: entryId }, index): React$Node => (
                  <TableRow key={entryId}>
                    <TableCell component="th" scope="row">
                      {entryId}
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
                        value={domain}
                        name={`entries[${index}].domain`}
                        onChange={e => {
                          this.handleInputChange(e);
                        }}
                        margin="normal"
                        error={
                          this.hasError(`entries[${index}].domain`) ||
                          this.hasError(`entries[${index}]`)
                        }
                        helperText={
                          this.getErrorMessage(`entries[${index}].domain`) ||
                          this.getErrorMessage(`entries[${index}]`)
                        }
                      />
                    </TableCell>
                    <TableCell className={classes.cell}>
                      <TextField
                        id="standard-name"
                        label="range"
                        className={classes.textField}
                        value={range}
                        name={`entries[${index}].range`}
                        onChange={e => {
                          this.handleInputChange(e);
                        }}
                        margin="normal"
                        error={
                          this.hasError(`entries[${index}].range`) ||
                          this.hasError(`entries[${index}]`)
                        }
                        helperText={
                          this.getErrorMessage(`entries[${index}].range`) ||
                          this.getErrorMessage(`entries[${index}]`)
                        }
                      />
                    </TableCell>
                    <TableCell className={classes.cell}>
                      <Fab color="secondary" aria-label="Delete">
                        <DeleteIcon
                          onClick={() => {
                            this.deleteDictionaryEntry(entryId);
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
              onClick={(): void => this.addDictionaryEntry()}
            >
              <AddIcon />
            </Fab>
          </div>
        </Paper>
      </Grid>
    );
  };

  renderDefaultMode = (): React$Node => {
    const {
      props: {
        classes,
        history,
        match,
        dictionaryDetailData: { data: dictionary }
      }
    } = this;

    const entries = get(dictionary, "entries", []);
    const title = get(dictionary, "title", "");
    const status = get(dictionary, "status", "");
    const id = get(match, "params.id", null);

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
                ({ domain, range, id: entryId }): React$Node => (
                  <TableRow key={entryId}>
                    <TableCell component="th" scope="row">
                      {entryId}
                    </TableCell>
                    <TableCell
                      className={classes.cell}
                      component="th"
                      scope="row"
                    >
                      {domain}
                    </TableCell>
                    <TableCell className={classes.cell}>{range}</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    );
  };
  // ------------------------------------
  // Helper Functions
  // ------------------------------------
  addDictionaryEntry = () => {
    this.setState(
      (old): * => ({
        ...old,
        editedDictionary: {
          ...old.editedDictionary,
          validationErrors: {},
          entries: [
            ...old.editedDictionary.entries,
            { id: generateId(), domain: "", range: "" }
          ]
        }
      })
    );
  };

  deleteDictionaryEntry = entryId => {
    const { editedDictionary } = this.state;
    const shouldDelete = window.confirm(
      "Are you sure that you want to delete this entry?"
    );

    if (shouldDelete) {
      const newEntries = editedDictionary.entries.filter(
        ({ id }): boolean => id !== entryId
      );
      this.setState(
        (old): * => ({
          ...old,
          validationErrors: {},
          editedDictionary: {
            ...old.editedDictionary,
            entries: newEntries
          }
        })
      );
    }
  };

  checkConsistency = (entries): * => {
    const messages = [];
    uniqWith(
      entries,
      (a, b): boolean => {
        if (this.isInvalid(a, b)) return false;
        const duplicate = this.hasDuplicates(a, b);
        const fork = this.hasForks(a, b);
        const cycle = this.hasCycles(a, b);
        const chain = this.hasChains(a, b);
        let index = findIndex(entries, (entry): * => entry.id === a.id);

        if (duplicate) {
          messages.push({
            type: "array.duplicate",
            message: "Duplicate domain & range detected (critical)",
            severity: 2,
            path: ["entries", index],
            index
          });
        }

        if (fork) {
          messages.push({
            type: "array.fork",
            message: "Forked entry detected (critical)",
            severity: 2,
            path: ["entries", index],
            index
          });
        }

        if (cycle) {
          messages.push({
            type: "array.cycle",
            message: "Cyclical entry detected (critical)",
            severity: 3,
            path: ["entries", index],
            index
          });
        }
        if (chain) {
          messages.push({
            type: "array.chain",
            message: "Chained entry detected (critical)",
            severity: 2,
            path: ["entries", index],
            index
          });
        }
        return duplicate || fork || cycle || chain;
      }
    );

    return messages;
  };

  runSchemaValidations = (dictionary): * => {
    return Joi.validate(dictionary, this.dictionarySchema, {
      abortEarly: false,
      allowUnknown: true
    })
      .catch(({ ...all }): * => all)
      .then((validatedObject): * => validatedObject);
  };

  validateDictionary = async (): * => {
    const {
      state: { editedDictionary },
      props: {
        history,
        refetch,
        match: {
          params: { id: dictionaryId }
        }
      }
    } = this;

    const validationResults = await this.runSchemaValidations(editedDictionary);
    const schemaErrors = validationResults.details || [];
    const consistencyErrors = this.checkConsistency(editedDictionary.entries);
    const errors = [...schemaErrors, ...consistencyErrors];

    if (!isEmpty(errors)) {
      const maxSeverity = errors.reduce((max, error): * => {
        if (error.severity > max) max = error.severity;
        return max;
      }, 1);

      const validationErrors = errors.reduce(
        (acc, error): * =>
          set(acc, error.path, { severity: DEFAULT_SEVERITY, ...error }),
        {}
      );

      this.setState(
        (old): * => ({ ...old, validationErrors }),
        () => {
          if (maxSeverity > 1) {
            window.alert(
              "Please resolve critical validation errors before saving"
            );
          } else {
            const confirm = window.confirm(
              "There are still some none-critical errors left. Continue and save as draft?"
            );
            if (confirm) {
              this.saveDictionary(dictionaryId, {
                ...editedDictionary,
                status: "DRAFT"
              }).then(
                (): * => {
                  history.push(`/dictionary/${dictionaryId}`);
                  refetch();
                }
              );
            }
          }
        }
      );
    } else {
      this.setState((old): * => ({ ...old, validationErrors: {} }));
      this.saveDictionary(dictionaryId, {
        ...validationResults,
        status: "VALID"
      }).then(
        (): * => {
          history.push(`/dictionary/${dictionaryId}`);
          refetch();
        }
      );
    }
  };

  saveDictionary = (id, dictionary): * => {
    const { match } = this.props;
    const mode = get(match, "params.mode");
    if (mode === "edit") {
      return updateDictionary(id, dictionary);
    } else {
      return createDictionary(dictionary);
    }
  };

  handleInputChange = event => {
    const path = get(event, "target.name", null);
    const value = get(event, "target.value", null);
    const {
      state: { editedDictionary },
      props: {
        dictionaryDetailData: { data: dictionary }
      }
    } = this;
    const newDictionary = set(
      { ...dictionary, ...editedDictionary },
      path,
      value
    );
    this.setState(
      (old): * => ({
        ...old,
        editedDictionary: newDictionary
      })
    );
  };

  hasError = (path): boolean => {
    const { validationErrors } = this.state;
    return !isEmpty(get(validationErrors, path, {}));
  };

  getErrorMessage = (path): string => {
    const { validationErrors } = this.state;
    if (!this.hasError(path)) return "";
    return get(validationErrors, path + "[message]", "");
  };

  isInvalid = (a, b): boolean => {
    return !(a.id !== b.id && a.domain && b.domain && a.range && b.range);
  };

  hasDuplicates = (a, b): boolean => {
    return a.domain === b.domain && a.range === b.range;
  };

  hasForks = (a, b): boolean => {
    return a.domain === b.domain && a.range !== b.range;
  };

  hasCycles = (a, b): boolean => {
    return a.domain === b.range && a.range === b.domain;
  };

  hasChains = (a, b): boolean => {
    return a.range === b.domain || b.range === a.domain;
  };

  dictionarySchema = Joi.object().keys({
    id: Joi.string()
      .trim()
      .lowercase()
      .required(),
    title: Joi.string()
      .trim()
      .lowercase()
      .required(),
    status: Joi.string()
      .trim()
      .lowercase()
      .required(),
    entries: Joi.array()
      .items(
        Joi.object().keys({
          id: Joi.string()
            .trim()
            .lowercase()
            .required(),
          domain: Joi.string()
            .trim()
            .lowercase()
            .required(),
          range: Joi.string()
            .trim()
            .lowercase()
            .required()
        })
      )
      .required()
  });
}

DictionaryDetail.propTypes = {
  classes: PropTypes.object.isRequired,
  dictionaryDetailData: PropTypes.object.isRequired,
  editMode: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default compose(
  withRouter,
  withStyles(styles)
)(DictionaryDetail);
