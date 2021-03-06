import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextArea from "react-textarea-autosize";
import { fileAbsolute } from "paths.macro";

import { button, textarea } from "../styles";

const styles = {
  commentArea: {
    ...textarea,
    minHeight: 75,
    marginBottom: 10,
    outline: "none",
    padding: "9px 11px",
    paddingBottom: 0,
    boxShadow: "0 1px 2px rgba(0,0,0,.23)"
  },
  saveComment: button
};

const Comments = ({ classes }) => (
  <React.Fragment>
    <Typography
      className={classes.commentArea}
      component={TextArea}
      placeholder="Write a comment..."
    />
    <Typography>
      <Button
        className={classes.saveComment}
        size="small"
        variant="raised"
        disabled
      >
        Save
      </Button>
    </Typography>
  </React.Fragment>
);

const Component = withStyles(styles)(Comments);

Component.displayName = require("../../utils").moduleName(fileAbsolute);

export default Component;
