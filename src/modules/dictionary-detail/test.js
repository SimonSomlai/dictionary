// @flow

import { shallow } from "enzyme";
import React from "react";

import DictionaryDetail from "./";

test.skip("Renders", (): * =>
  expect(shallow(<DictionaryDetail content="Hello" />)).toMatchSnapshot());
