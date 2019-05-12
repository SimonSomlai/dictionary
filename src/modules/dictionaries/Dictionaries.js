// @flow
// NPM Modules
import { compose } from "redux";
import { get } from "lodash";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import React from "react";
import Typography from "@material-ui/core/Typography";

// External Modules

// Components
import { Loader } from "@modules/shared/components";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Grid from "@material-ui/core/Grid";

// Queries & Query Constants

// Assets & Styles
import { styles } from "./dictionariesStyles";

type PropsType = {
  dictionariesData: *,
  classes: *,
  history: *
};

const Dictionaries = ({
  dictionariesData: { data: dictionaries, loading, error },
  classes,
  history
}: PropsType): React$Node => {
  const renderDictionaries = (dictionaries): React$Node => {
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
                <Button size="small">Delete</Button>
                <Button
                  onClick={(): void => history.push(`/dictionary/${id}`)}
                  size="small"
                  color="primary"
                >
                  Edit
                </Button>
              </ExpansionPanelActions>
            </ExpansionPanel>
          </Grid>
        );
      }
    );
  };

  if (loading) return <Loader />;

  return (
    <Grid container spacing={24} className={classes.grid}>
      {renderDictionaries(dictionaries)}
    </Grid>
  );
};

Dictionaries.propTypes = {
  classes: PropTypes.object.isRequired,
  dictionariesData: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default compose(
  withStyles(styles),
  withRouter
)(Dictionaries);
