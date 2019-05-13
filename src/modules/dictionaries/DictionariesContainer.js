// @flow
// NPM Modules
import React, { useEffect, useState } from "react";

// External Modules
import { getDictionaries } from "@modules/shared/utils/";

// Components
import Dictionaries from "./Dictionaries";

type DataState = {
  error: *,
  data: *,
  loading: boolean
};
// ======================================================
// DictionariesContainer Stateless Component
// ======================================================
const DictionariesContainer = (): React$Node => {
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
    getAllDictionaries();
  };

  const getAllDictionaries = () => {
    setState({ ...state, loading: true });
    getDictionaries()
      .then((data): void => setState({ ...state, data, loading: false }))
      .catch((err): void => alert(JSON.stringify(err)));
  };

  useEffect(onMountEffect, []);

  // ------------------------------------
  // Render Functions
  // ------------------------------------
  return <Dictionaries dictionariesData={state} refetch={getAllDictionaries} />;
};

DictionariesContainer.defaultProps = {};

export default DictionariesContainer;
