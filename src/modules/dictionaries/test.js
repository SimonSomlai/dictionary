// @flow

import { shallow } from "enzyme";
import React from "react";

import Dictionaries from "./";

test.skip("Renders", (): * =>
  expect(shallow(<Dictionaries content="Hello" />)).toMatchSnapshot());
