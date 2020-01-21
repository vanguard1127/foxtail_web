import axios from "axios";
const refreshToken = ({ operation, forward }) => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    return;
  }

  axios
    .post(process.env.REACT_APP_HTTPS_URL + "/refresh", {
      refreshToken
    })
    .then(function(response) {
      const newTokens = response.data;
      if (
        newTokens &&
        newTokens.token !== undefined &&
        newTokens.refresh !== undefined
      ) {
        localStorage.setItem("token", newTokens.token);
        localStorage.setItem("refreshToken", newTokens.refresh);
        operation.setContext(context => ({
          ...context,
          headers: {
            ...context.headers,
            authorization: `Bearer ${newTokens.token}`,
            "x-refresh-token": newTokens.refresh
          }
        }));
      } else {
        localStorage.removeItem("token");

        localStorage.removeItem("refreshToken");
        window.location.reload(false);
        return;
      }

      return forward(operation);
    });
};
export default refreshToken;
