// INDEX
/////////////////
// 1. ENVIRONMENT
// 2. ...
/////////////////

// 1. ENVIRONMENT
const localserver = "localhost:4444";
const prodserver = "prod.foxtailapi.com";

export const env = {
  local: {
    server: localserver,
    httpurl: `http://${localserver}/graphql`,
    HTTPSurl: `http://${localserver}`,
    wsurl: `ws://${localserver}/subscriptions`
  },
  production: {
    server: prodserver,
    httpurl: `https://${prodserver}/graphql`,
    HTTPSurl: `https://${prodserver}`,
    wsurl: `wss://${prodserver}/subscriptions`
  }
};

// 2. SEARCH EVENT TIMIT
export const SEARCHEVENT_LIMIT = 6;
export const NOTICELIST_LIMIT = 5;
export const SEARCHPROS_LIMIT = 20;
export const EVENTDISC_LIMIT = 4;
export const MEMSLIST_LIMIT = 5;
export const INBOXMSG_LIMIT = 6;
export const INBOXLIST_LIMIT = 9;
