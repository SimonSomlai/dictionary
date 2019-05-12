// @flow
// NPM Modules
import React, { useState } from "react";

// External Modules

// Components
import { Loader } from "@modules/shared/components/index";
import { withStyles } from "@material-ui/core/styles";
// import Button from "@material-ui/core/Button";
// import Chip from "@material-ui/core/Chip";
// import Divider from "@material-ui/core/Divider";
// import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
// import ExpansionPanel from "@material-ui/core/ExpansionPanel";
// import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
// import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
// import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Grid from "@material-ui/core/Grid";

// Queries & Query Constants

// Assets & Styles
import { styles } from "./dictionaryDetailStyles";

type Props = {
  dictionaryDetailData: *,
  classes: *
};

/**
 * DictionaryDetail
 */
const DictionaryDetail = ({
  dictionaryDetailData: { data: dictionary, loading, error },
  classes
}: Props): React$Node => {
  const [editMode, setEditMode] = useState(false);
  if (loading) return <Loader />;

  const renderEditMode = (dictionary): React$Node => {
    return <p>editing</p>;
  };

  const renderNormalMode = (dictionary): React$Node => {
    return <p onClick={setEditMode}>Normal</p>;
  };

  return (
    <Grid container spacing={24} className={classes.grid}>
      {editMode ? renderEditMode(dictionary) : renderNormalMode(dictionary)}
    </Grid>
  );
};

export default withStyles(styles)(DictionaryDetail);
