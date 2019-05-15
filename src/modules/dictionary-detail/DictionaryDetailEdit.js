/* eslint-disable smells/no-this-assign */
// @flow
// NPM Modules
import { compose } from "redux";
import { findIndex, get, isEmpty, set, throttle, uniqWith } from "lodash";
import { withRouter } from "react-router-dom";
import Joi from "@hapi/joi";
import PropTypes from "prop-types";
import React, { Component } from "react";

// External Modules
import {
  DEFAULT_SEVERITY,
  DICTIONARY_STATUSES
} from "@modules/shared/constants/index";
import {
  createDictionary,
  deleteDictionary,
  updateDictionary
} from "@modules/shared/utils/index";
import { generateId } from "@modules/shared/utils/index";

// Components
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import SaveIcon from "@material-ui/icons/Save";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";

// Queries & Query Constants

// Assets & Styles

type PropsType = {
  classes: *,
  history: *,
  dictionary: *,
  match: *,
  refetch: *
};

type StateType = {
  validationErrors: *,
  editedDictionary: *
};

const dictionarySchema = Joi.object().keys({
  id: Joi.string()
    .trim()
    .lowercase()
    .required(),
  title: Joi.string()
    .trim()
    .required(),
  status: Joi.string()
    .trim()
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

// ======================================================
// DictionaryDetailEdit Stateless Component
// ======================================================
class DictionaryDetailEdit extends Component<PropsType, StateType> {
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

  componentDidMount() {
    const {
      props: { dictionary },
      state: { editedDictionary }
    } = this;

    // When switching from "default" mode to edit (update/new) mode -> copy data into state for altering
    if (isEmpty(editedDictionary)) {
      this.setState(
        (old): * => ({
          ...old,
          editedDictionary: dictionary
        }),
        this.runValidations
      );
    }
  }
  // ------------------------------------
  // Render Functions
  // ------------------------------------
  render(): React$Node {
    const {
      props: {
        classes,
        history,
        match: {
          params: { id: dictionaryId }
        }
      },
      state: { editedDictionary: dictionary }
    } = this;

    const entries = get(dictionary, "entries", []);
    const title = get(dictionary, "title", "");
    const status = get(dictionary, "status", "");

    return (
      <Grid item xs={12} className={classes.gridItem}>
        <div className={classes.fab}>
          <Fab
            color="primary"
            aria-label="Save"
            onClick={(): * => this.runValidations(true)}
          >
            <SaveIcon />
          </Fab>
          <Fab color="secondary" aria-label="Delete">
            <DeleteIcon
              onClick={() => {
                deleteDictionary(dictionaryId)
                  .then((): void => history.replace("/"))
                  .catch((err): * => err);
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
          onChange={this.handleInputChange}
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
            <TableBody>{this.renderEntries(entries)}</TableBody>
          </Table>
          <div className={classes.addButtonRow}>
            <Fab
              color="primary"
              aria-label="Add"
              onClick={this.addDictionaryEntry}
            >
              <AddIcon />
            </Fab>
          </div>
        </Paper>
      </Grid>
    );
  }

  renderEntries = (entries): React$Node => {
    const { classes } = this.props;
    return entries.map(
      ({ domain, range, id: entryId }, index): React$Node => (
        <TableRow key={entryId}>
          <TableCell component="th" scope="row">
            {entryId}
          </TableCell>
          <TableCell className={classes.cell} component="th" scope="row">
            <TextField
              id="standard-name"
              label="domain"
              className={classes.textField}
              value={domain}
              name={`entries[${index}].domain`}
              onChange={this.handleInputChange}
              margin="normal"
              error={this.hasError(`entries[${index}]`)}
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
              onChange={this.handleInputChange}
              margin="normal"
              error={this.hasError(`entries[${index}]`)}
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
    );
  };

  // ------------------------------------
  // Helper Functions
  // ------------------------------------
  // *************** CRUD Helpers **********************
  handleInputChange = event => {
    const path = get(event, "target.name", null);
    const value = get(event, "target.value", null);
    const {
      state: { editedDictionary }
    } = this;

    const newDictionary = set(editedDictionary, path, value);
    this.setState(
      (old): * => ({
        ...old,
        editedDictionary: newDictionary
      }),
      throttle(this.runValidations, 500, { leading: true, trailing: true }) // Run throttled validations when input changes
    );
  };

  addDictionaryEntry = () => {
    this.setState(
      (old): * => ({
        ...old,
        editedDictionary: {
          ...old.editedDictionary,
          entries: [
            ...old.editedDictionary.entries,
            { id: generateId(), domain: "", range: "" }
          ]
        }
      }),
      this.runValidations
    );
  };

  deleteDictionaryEntry = entryId => {
    const { editedDictionary } = this.state;
    const shouldDelete = window.confirm(
      "Are you sure that you want to delete this entry?"
    );

    if (!shouldDelete) return;

    const newEntries = editedDictionary.entries.filter(
      ({ id }): boolean => id !== entryId
    );

    this.setState(
      (old): * => ({
        ...old,
        editedDictionary: {
          ...old.editedDictionary,
          entries: newEntries
        }
      }),
      this.runValidations
    );
  };

  saveDictionary = (id, dictionary): * => {
    const { match } = this.props;
    const mode = get(match, "params.mode");
    return mode === "edit"
      ? updateDictionary(id, dictionary)
      : createDictionary(dictionary);
  };

  // *************** Validation Helpers **********************
  runValidations = async (shouldSave: boolean = false): * => {
    const {
      state: { editedDictionary }
    } = this;
    // Check schema
    const schemaValidation = await this.runSchemaValidations(editedDictionary);
    const schemaErrors = get(schemaValidation, "details", []);
    // Check duplicates/consistency
    const entries = get(editedDictionary, "entries", []);
    const consistencyErrors = this.checkConsistency(entries);

    const errors = [...schemaErrors, ...consistencyErrors];

    isEmpty(errors) && shouldSave
      ? this.updateDictionary()
      : this.handleValidationErrors(shouldSave, errors);
  };

  runSchemaValidations = (dictionary): * => {
    return Joi.validate(dictionary, dictionarySchema, {
      abortEarly: false,
      allowUnknown: true
    })
      .catch(({ ...all }): * => all)
      .then((validatedObject): * => validatedObject);
  };

  checkConsistency = (entries): * => {
    const arr = [];
    uniqWith(
      entries,
      (a, b): any => {
        if (this.isInvalid(a, b)) return false;
        const duplicated = this.hasDuplicates(a, b);
        const forked = this.hasForks(a, b);
        const cyclical = this.hasCycles(a, b);
        const chained = this.hasChains(a, b);
        const index = findIndex(entries, (entry): * => entry.id === a.id);

        if (duplicated) arr.push(this.getErorMessage("duplicated", 1, index));
        if (forked) arr.push(this.getErorMessage("forked", 2, index));
        if (chained) arr.push(this.getErorMessage("chained", 2, index));
        if (cyclical) arr.push(this.getErorMessage("cyclical", 2, index));
      }
    );

    return arr;
  };

  getErorMessage = (type, severity, index): * => ({
    type: `array.${type}`,
    message: `${type} entry detected`,
    severity,
    path: ["entries", index],
    index
  });

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

  handleValidationErrors = (shouldSave, errors): * => {
    // Map errors to an easy to work with format
    const validationErrors = errors.reduce(
      (acc, error): * =>
        set(acc, error.path, { severity: DEFAULT_SEVERITY, ...error }),
      {}
    );

    this.setState(
      (old): * => ({ ...old, validationErrors }),
      (): * => this.handleSave(shouldSave, errors)
    );
  };

  handleSave = (shouldSave, errors) => {
    if (!shouldSave) return;
    const maxSeverity = this.getMaxSeverity(errors);

    if (maxSeverity > 1) {
      window.alert("Please resolve critical validation errors before saving");
    } else {
      const confirm = window.confirm(
        "There are still some none-critical errors left. Continue and save as draft?"
      );
      if (confirm) this.updateDictionary(DICTIONARY_STATUSES.DRAFT);
    }
  };

  getMaxSeverity = (errors): number => {
    return errors.reduce((max, error): * => {
      if (error.severity > max) max = error.severity;
      return max;
    }, 1);
  };

  updateDictionary = (status = DICTIONARY_STATUSES.VALID): * => {
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

    this.setState((old): * => ({ ...old, validationErrors: {} })); // Clear old errors when validation succeeds

    this.saveDictionary(dictionaryId, {
      ...editedDictionary,
      status
    }).then(
      (): * => {
        history.push(`/dictionary/${dictionaryId}`);
        refetch();
      }
    );
  };
}

DictionaryDetailEdit.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  dictionary: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired
};

export default compose(withRouter)(DictionaryDetailEdit);
