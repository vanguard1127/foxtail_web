import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";

Tooltip.defaultProps = {
  enterTouchDelay: 50
};
const StyledTooltip = withStyles({
  tooltip: {
    fontSize: "15px",
  }
})(Tooltip);

export default StyledTooltip;
