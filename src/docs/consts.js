// INDEX
/////////////////
// 1. ENVIRONMENT
// 2. ...
/////////////////

// 1. ENVIRONMENT
const localserver = "localhost:4444";
const prodserver = "api.foxtailapp.com";
const stageserver =
  "https://internal-foxtail-staging-private-alb-1501692418.us-east-1.elb.amazonaws.com";

export const env = {
  local: {
    server: localserver,
    httpurl: `http://${localserver}/graphql`,
    HTTPSurl: `https://${localserver}`,
    wsurl: `ws://${localserver}/subscriptions`
  },
  production: {
    server: prodserver,
    httpurl: `https://${prodserver}/graphql`,
    HTTPSurl: `https://${prodserver}`,
    wsurl: `wss://${prodserver}/subscriptions`
  },
  stage: {
    server: stageserver,
    httpurl: `https://${stageserver}/graphql`,
    HTTPSurl: `https://${stageserver}`,
    wsurl: `wss://${stageserver}/subscriptions`
  }
};

// 2. SEARCH EVENT TIMIT
export const SEARCHEVENT_LIMIT = 9;
export const NOTICELIST_LIMIT = 5;
export const SEARCHPROS_LIMIT = 20;
export const EVENTDISC_LIMIT = 4;
export const MEMSLIST_LIMIT = 5;
export const INBOXMSG_LIMIT = 12;
export const CHATMSGS_LIMIT = 10;
export const INBOXLIST_LIMIT = 11;

export const availableLangs = ["en", "tu", "de"];
