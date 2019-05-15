// @flow
// NPM Modules
import { compose } from "redux";
import React from "react";

// External Modules

// Components
import { Loader } from "@modules/shared/components/index";
import { withStyles } from "@material-ui/core/styles";
import DictionaryDetailDefault from "./DictionaryDetailDefault";
import DictionaryDetailEdit from "./DictionaryDetailEdit";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";

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

/**
 * DictionaryDetail
 */
const DictionaryDetail = ({
  classes,
  dictionaryDetailData: { loading, data: dictionary },
  editMode,
  match,
  refetch
}: PropsType): React$Node => {
  if (loading) return <Loader />;

  return (
    <Grid container spacing={24} className={classes.grid}>
      {editMode ? (
        <DictionaryDetailEdit
          classes={classes}
          match={match}
          dictionary={dictionary}
          refetch={refetch}
        />
      ) : (
        <DictionaryDetailDefault
          classes={classes}
          match={match}
          dictionary={dictionary}
        />
      )}
    </Grid>
  );
};

DictionaryDetail.propTypes = {
  classes: PropTypes.object.isRequired,
  dictionaryDetailData: PropTypes.object.isRequired,
  editMode: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired
};

export default compose(withStyles(styles))(DictionaryDetail);
