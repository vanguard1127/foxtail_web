import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";

const StyledTooltip = withStyles({
  tooltip: {
    fontSize: "15px"
  }
})(Tooltip);

export default StyledTooltip;
