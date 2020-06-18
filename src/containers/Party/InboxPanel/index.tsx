import React, { useRef, useState, memo, useEffect } from "react";
import { useQuery } from "react-apollo";
import produce from "immer";
import { WithT } from "i18next";

import { GET_CHATROOMS } from "queries";
import * as ErrorHandler from "components/common/ErrorHandler";
import Spinner from "components/common/Spinner";

import PartyList from "./PartyList";
import { IUser } from "types/user";

const limit = parseInt(process.env.REACT_APP_PARTYLIST_LIMIT || "12");

interface IPartyPanelProps extends WithT {
  currentuser: IUser;
  openChat: (chatID: any) => void;
}

const PartyPanel: React.FC<IPartyPanelProps> = memo(
  ({ currentuser, openChat, t }) => {
    const unsubscribe = useRef(null);
    const unsubscribe2 = useRef(null);
    const [state, setState] = useState({
      searchTerm: "",
      skip: 0,
      hasMore: true
    });

    const { data, loading, error, fetchMore } = useQuery(GET_CHATROOMS, {
      variables: {
        skip: state.skip,
        limit,
        isMobile: sessionStorage.getItem("isMobile")
      },
      fetchPolicy: "cache-first"
    });

    useEffect(() => {
      return () => {
        if (unsubscribe) {
          unsubscribe.current();
        }
        if (unsubscribe2) {
          unsubscribe2.current();
        }
      };
    }, []);

    if (loading) {
      return (
        <div className="col-md-4 col-lg-3 col-xl-3">
          <div className="left">
            <Spinner page="inbox" title={t("allmems")} />
          </div>
        </div>
      );
    }

    const fetchData = (fetchMore) => {
      const { skip, hasMore } = state;
      if (!hasMore) {
        return;
      }

      setState({ ...state, skip: skip + limit });
      fetchMore({
        variables: { skip: skip + limit, limit: limit },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (
            !fetchMoreResult ||
            !fetchMoreResult.getChatrooms ||
            fetchMoreResult.getChatrooms.length === 0
          ) {
            setState({ ...state, hasMore: false });
            return previousResult;
          }

          if (!previousResult) {
            return { getChatrooms: [] };
          }

          const newParty = produce(previousResult, (draftState) => {
            draftState.getChatrooms = [
              ...previousResult.getChatrooms,
              ...fetchMoreResult.getChatrooms
            ];
          });

          return newParty;
        }
      });
    };

    if (error) {
      return (
        <ErrorHandler.report
          error={error}
          calledName={"getChatrooms"}
          userID={currentuser.userID}
        />
      );
    }

    const chatrooms = data.getChatrooms || [];

    return (
      <div className="col-md-4 col-lg-3 col-xl-3">
        <div className="left">
          <PartyList
            chatrooms={chatrooms}
            fetchData={() => fetchData(fetchMore)}
            openChat={openChat}
            currentuser={currentuser}
            t={t}
          />
        </div>
      </div>
    );
  }
);

export default PartyPanel;
