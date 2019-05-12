// @flow
// NPM Modules
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
const DictionaryDetailContainer = (): React$Node => {
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
    const id = 1;
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
  return <DictionaryDetail dictionaryDetailData={state} />;
};

DictionaryDetailContainer.defaultProps = {};

export default DictionaryDetailContainer;
