import ReactLoadable from "react-loadable";
import Spinner from "../common/Spinner";

export default function Loadable(opts) {
  return ReactLoadable({
    loading: Spinner,
    delay: 200,
    timeout: 10000,
    ...opts
  });
}
