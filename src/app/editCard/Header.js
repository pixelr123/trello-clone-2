import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Inbox from "@material-ui/icons/Inbox";
import Close from "@material-ui/icons/Close";
import TextArea from "react-textarea-autosize";
import Typography from "@material-ui/core/Typography";
import { fileAbsolute } from "paths.macro";
import { compose, setPropTypes } from "recompose";
import { graphql } from "react-apollo";
import merge from "deepmerge";

import { queries } from "../../cosmos/apollo/schema";
import { inject } from "mobx-react";
import { buttonIcon, headerTextarea } from "../styles";
import { makeFixtures, moduleName } from "../../utils";

const styles = {
  root: {
    position: "relative",
    margin: "15px 45px 30px 15px",
    display: "flex",
    alignItems: "flex-start",
    "& h2": {
      width: "100%"
    },
    "& textarea": {
      ...headerTextarea,
      marginLeft: 4,
      paddingLeft: 0
    }
  },
  close: merge(buttonIcon, {
    position: "absolute",
    top: -5,
    right: -37,
    margin: 0,
    "&:hover": {
      color: "black"
    }
  })
};

const Header = ({
  classes,
  className = "",
  boardState,
  updateCard,
  cardId,
  cardTitle
}) => {
  return (
    <div className={`${classes.root} ${className}`}>
      <Inbox />
      <Typography
        role="heading"
        variant="title"
        component={TextArea}
        defaultValue={cardTitle}
        spellCheck={false}
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === "Escape") e.target.blur();
        }}
        onBlur={e => {
          const title = e.target.value;
          if (title === cardTitle) return;
          updateCard({
            variables: {
              id: cardId,
              update: { title }
            }
          });
        }}
      />
      <button className={classes.close} onClick={boardState.finishCardEdit}>
        <Close />
      </button>
    </div>
  );
};

const Component = compose(
  setPropTypes({
    cardId: PropTypes.number.isRequired,
    cardTitle: PropTypes.string.isRequired
  }),
  graphql(queries.updateCard, { name: "updateCard" }),
  inject("boardState"),
  withStyles(styles)
)(Header);

export const fixtures = makeFixtures(moduleName(fileAbsolute), Component, {
  default: {
    props: {
      cardId: 1,
      cardTitle: "Ut sunt qui amet."
    },
    stores: {
      boardState: {
        finishCardEdit: () => {}
      }
    }
  }
});

export default Component;
