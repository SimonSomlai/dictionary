// @flow
// NPM Modules
import { get } from "lodash";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

// External Modules
import { getDictionary } from "@modules/shared/utils/";

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

  const onMountEffect = () => {
    const id = get(match, "params.id");
    getDictionaryById(id);
  };

  const getDictionaryById = id => {
    setState({ ...state, loading: true });
    getDictionary(id)
      .then((data): void => setState({ ...state, data, loading: false }))
      .catch((err): void => alert(JSON.stringify(err)));
  };

  useEffect(onMountEffect, []);

  // ------------------------------------
  // Helper Functions
  // ------------------------------------

  // ------------------------------------
  // Render Functions
  // ------------------------------------
  const mode = get(match, "params.mode", "default");
  const editMode = mode === "edit";
  return <DictionaryDetail dictionaryDetailData={state} editMode={editMode} />;
};

DictionaryDetailContainer.defaultProps = {};

DictionaryDetailContainer.propTypes = {
  match: PropTypes.object.isRequired
};

export default withRouter(DictionaryDetailContainer);
