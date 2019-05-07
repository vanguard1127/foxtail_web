const refreshToken = ({ operation, forward, HTTPSurl, ErrorHandler }) => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    return;
  }
  const axios = require("axios");
  axios
    .post(HTTPSurl + "/refresh", {
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
      }

      return forward(operation);
    })
    .catch(function(error) {
      ErrorHandler.catchErrors(error);
    });
};
export default refreshToken;
