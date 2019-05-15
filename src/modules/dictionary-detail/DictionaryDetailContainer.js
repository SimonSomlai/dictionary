// @flow
// NPM Modules
import { get } from "lodash";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

// External Modules
import { getDictionary, getNewDictionary } from "@modules/shared/utils/";

// Components
import DictionaryDetail from "./DictionaryDetail";

type DataState = {
  error: *,
  data: *,
  loading: boolean
};

// ======================================================
// DictionaryDetailContainer Stateless Component
// ======================================================
const DictionaryDetailContainer = ({ match }): React$Node => {
  // ------------------------------------
  // React Lifecycle Functions
  // ------------------------------------
  const dataState: DataState = {
    error: {},
    data: {},
    loading: true
  };

  const [state, setState] = useState(dataState);
  const id = get(match, "params.id", "");
  const mode = get(match, "params.mode", "default");
  const editMode = mode === "edit" || mode === "new";

  const getDictionaryById = () => {
    setState({ ...state, loading: true });
    getDictionary(id)
      .then(
        (data): void => {
          return setState({
            ...state,
            data: editMode ? data || getNewDictionary(id) : data,
            loading: false
          });
        }
      )
      .catch((err): * => err);
  };

  useEffect(getDictionaryById, []);
  useEffect(getDictionaryById, [id, mode]);

  // ------------------------------------
  // Helper Functions
  // ------------------------------------

  // ------------------------------------
  // Render Functions
  // ------------------------------------
  return (
    <DictionaryDetail
      dictionaryDetailData={state}
      editMode={editMode}
      refetch={getDictionaryById}
      match={match}
    />
  );
};

DictionaryDetailContainer.defaultProps = {};

DictionaryDetailContainer.propTypes = {
  match: PropTypes.object.isRequired
};

export default withRouter(DictionaryDetailContainer);
