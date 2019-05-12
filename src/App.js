// @flow
// NPM Modules
import { Route, BrowserRouter as Router } from "react-router-dom";
import React, { Component } from "react";

// External Modules
import { Navigation } from "@modules/shared/components/index";

// Components
import { DictionariesContainer } from "@modules/dictionaries";
import { DictionaryDetailContainer } from "@modules/dictionary-detail";

// Assets & Styles
import "@styles/main.scss";

type PropsType = {};

type StateType = {};

class App extends Component<PropsType, StateType> {
  // ------------------------------------
  // Render Functions
  // ------------------------------------
  render(): React$Node {
    return (
      <Router>
        <div>
          <Navigation />
          <Route path="/" exact component={DictionariesContainer} />
          <Route path="/dictionary/:id" component={DictionaryDetailContainer} />
        </div>
      </Router>
    );
  }
}

export default App;
