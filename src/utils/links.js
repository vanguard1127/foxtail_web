import { WebSocketLink } from "apollo-link-ws";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { ApolloLink, split } from "apollo-link";
import { getMainDefinition } from "apollo-utilities";
import { InMemoryCache } from "apollo-cache-inmemory";
import { withClientState } from "apollo-link-state";
import tokenHandler from "./tokenHandler";
import { toast } from "react-toastify";
import i18n from "../i18n";
const wsLink = new WebSocketLink({
  uri: process.env.REACT_APP_WS_URL,
  options: {
    reconnect: true,
    lazy: true,
    connectionParams: () => ({
      token: localStorage.getItem("token"),
      refreshToken: localStorage.getItem("refreshToken")
    })
  }
});

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_HTTP_URL
});

const AuthLink = new ApolloLink((operation, forward) => {
  operation.setContext(context => ({
    ...context,
    headers: {
      ...context.headers,
      authorization: `Bearer ${localStorage.getItem("token")}`,
      "x-refresh-token": localStorage.getItem("refreshToken")
    }
  }));
  return forward(operation);
});

const afterwareLink = new ApolloLink((operation, forward) => {
  return forward(operation).map(response => {
    const {
      response: { headers }
    } = operation.getContext();
    if (headers) {
      const token = headers.get("authorization");
      const refreshToken = headers.get("x-refresh-token");
      const headerlang = headers.get("lang");

      if (headerlang) {
        localStorage.setItem("i18nextLng", headerlang);
      }

      if (token) {
        localStorage.setItem("token", token.replace("Bearer", "").trim());
      }

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
    }

    return response;
  });
});

const httpLinkWithMiddleware = afterwareLink.concat(AuthLink.concat(httpLink));
const splitlink = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLinkWithMiddleware
);

export const cache = new InMemoryCache({
  dataIdFromObject: o => {
    if (o._id) return { [o.__typename]: o._id };
    else return null;
  },
  freezeResults: true
});

const defaults = {
  getNotifications: []
  }
;

const stateLink = withClientState({
  cache,
  defaults
});

const errorLink = onError(
  ({ graphQLErrors, networkError, response, operation, forward }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, path }) => {
        if (message.includes("Client")) {
          if (!toast.isActive(message)) {
            toast(i18n.t("common:" + message.replace("Client:", "").trim()), {
              position: toast.POSITION.TOP_CENTER,
              toastId: message
            });
          }
        } else if (~message.indexOf("authenticated")) {
          tokenHandler({ operation, forward });
        } else {
          if (process.env.NODE_ENV !== "production") {
            console.error("GQL ERROR:", message);
            Sentry.withScope(scope => {
              scope.setLevel("error");
              scope.setTag("resolver", path);
              scope.setFingerprint([window.location.pathname]);
              Sentry.captureException(message);
            });
          }
          if (!toast.isActive("err")) {
            toast.info(
              <span>
                {i18n.t("common:Something went wrong")}:
                <br />
                <span
                  onClick={Sentry.showReportDialog}
                  style={{ color: "yellow", textDecoration: "underline" }}
                >
                  {i18n.t("common:Report feedback")}
                </span>
              </span>,
              {
                position: toast.POSITION.TOP_CENTER,
                toastId: "err"
              }
            );
          }
        }
        return null;
      });
    }
    if (networkError) {
      if (networkError.statusCode === 429) {
        window.location.replace("/captcha");
      } else {
        if (!toast.isActive("networkError")) {
          toast.info(
            i18n.t(
              "common:We're having trouble connecting to you. Please check your connection and try again."
            ),
            {
              position: toast.POSITION.TOP_CENTER,
              toastId: "networkError"
            }
          );
          if (process.env.NODE_ENV !== "production") {
            console.error("Network Error:", networkError);
          }
        }
      }
    }
    return null;
  }
);

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
export const link = errorLink.concat(
  ApolloLink.from([stateLink, AuthLink, splitlink])
);
