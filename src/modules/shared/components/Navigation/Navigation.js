// @flow
// NPM Modules
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import React, { Component, Fragment } from "react";
import classNames from "classnames";

// External Modules

// Components
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SvgIcon
} from "@material-ui/core";

// Assets & Styles
import "@styles/main.scss";
import { styles } from "./navigationStyles.js";
import { withStyles } from "@material-ui/core/styles";

type PropsType = {
  classes: *,
  history: *
};

type StateType = {
  open: boolean
};

class Navigation extends Component<PropsType, StateType> {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  // ------------------------------------
  // Render Functions
  // ------------------------------------
  render(): React$Node {
    // eslint-disable-next-line smells/no-this-assign
    const {
      state: { open },
      props: { classes, history }
    } = this;
    return (
      <Fragment>
        <IconButton onClick={this.toggleDrawer} className={classes.menuButton}>
          <SvgIcon>
            <path
              fill="white"
              d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"
            />
          </SvgIcon>
        </IconButton>
        <Drawer
          className={classNames(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open
          })}
          classes={{
            paper: classNames(classes.list, {
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open
            })
          }}
          onClose={(): void => this.setState({ open: false })}
          open={open}
        >
          <List>
            <ListItem
              className={classNames(classes.listItem)}
              button
              key={"All Dictionaries"}
            >
              <ListItemIcon>
                <SvgIcon>
                  <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
                </SvgIcon>
              </ListItemIcon>
              <ListItemText primary={"All Dictionaries"} />
            </ListItem>
            <ListItem
              className={classNames(classes.listItem)}
              button
              key={"New Dictionary"}
              onClick={(): void => history.push("/dictionary/new")}
            >
              <ListItemIcon>
                <SvgIcon>
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  <path d="M0 0h24v24H0z" fill="none" />
                </SvgIcon>
              </ListItemIcon>
              <ListItemText primary={"New Dictionary"} />
            </ListItem>
          </List>
        </Drawer>
      </Fragment>
    );
  }

  // ------------------------------------
  // Helper Functions
  // ------------------------------------
  toggleDrawer = () => {
    this.setState({ open: !this.state.open });
  };
}

Navigation.propTypes = {
  classes: PropTypes.object
};

export default compose(
  withStyles(styles),
  withRouter
)(Navigation);
