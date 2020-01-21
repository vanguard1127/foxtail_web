import Loadable from "react-loadable";
import Spinner from "../common/Spinner";

export default function LoadableComponent(opts) {
  return Loadable(
    Object.assign(
      {
        loading: Spinner,
        delay: 200,
        timeout: 10000
      },
      opts
    )
  );
}
