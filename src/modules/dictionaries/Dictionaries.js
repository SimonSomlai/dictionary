// @flow
// NPM Modules
import { compose } from "redux";
import { get } from "lodash";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import React from "react";

// External Modules
import { generateId } from "@modules/shared/utils/index";

// Components
import { Loader } from "@modules/shared/components";
import { withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

// Queries & Query Constants

// Assets & Styles
import { deleteDictionary } from "@modules/shared/utils/index";
import { styles } from "./dictionariesStyles";

type PropsType = {
  dictionariesData: *,
  classes: *,
  history: *,
  refetch: *
};

const Dictionaries = ({
  dictionariesData: { data: dictionaries, loading, error },
  refetch,
  classes,
  history
}: PropsType): React$Node => {
  if (loading) return <Loader />;

  return (
    <Grid container spacing={24} className={classes.grid}>
      <Grid item xs={12} className={classes.fab}>
        <Fab
          color="primary"
          aria-label="Add"
          onClick={(): void => history.push(`/dictionary/${generateId()}/new`)}
        >
          <AddIcon />
        </Fab>
      </Grid>
      <DictionariesList
        classes={classes}
        refetch={refetch}
        dictionaries={dictionaries}
        history={history}
      />
    </Grid>
  );
};

const DictionariesList = ({
  dictionaries,
  classes,
  refetch,
  history
}): React$Node => {
  return dictionaries.map(
    (dictionary, index): React$Node => {
      const title = get(dictionary, "title");
      const entries = get(dictionary, "entries", []);
      const numberOfEntries = entries.length;
      const status = get(dictionary, "status", null);
      const id = get(dictionary, "id", null);
      return (
        <Grid key={title} item xs={12}>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <div className={classes.column}>
                <Typography className={classes.heading}>
                  {`${title} (${numberOfEntries} entries)`}
                </Typography>
              </div>
              <div className={classes.column}>
                <Typography className={classes.secondaryHeading}>
                  {status}
                </Typography>
              </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.details}>
              <div className={classes.column} />
            </ExpansionPanelDetails>
            <Divider />
            <ExpansionPanelActions>
              <Button
                size="small"
                onClick={(): void => history.push(`/dictionary/${id}`)}
              >
                View
              </Button>
              <Button
                onClick={(): void => history.push(`/dictionary/${id}/edit`)}
                size="small"
                color="primary"
              >
                Edit
              </Button>
              <Button
                size="small"
                color="secondary"
                onClick={() => {
                  deleteDictionary(id)
                    .then(refetch)
                    .catch(err => {});
                }}
              >
                Delete
              </Button>
            </ExpansionPanelActions>
          </ExpansionPanel>
        </Grid>
      );
    }
  );
};

Dictionaries.propTypes = {
  classes: PropTypes.object.isRequired,
  dictionariesData: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired
};

export default compose(
  withStyles(styles),
  withRouter
)(Dictionaries);
