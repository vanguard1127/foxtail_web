import React, { memo, useState, useEffect } from "react";
import { Prompt } from "react-router-dom";
import { toast } from "react-toastify";
import { useQuery, useMutation } from "react-apollo";
import { Waypoint } from "react-waypoint";

import { SEARCH_PROFILES, LIKE_PROFILE } from "queries";
import DirectMsgModal from "components/Modals/DirectMsg";
import BlockModal from "components/Modals/Block";
import Spinner from "components/common/Spinner";
import DailyLimitModal from "components/Modals/DailyLimit";

import InviteFriends from "./InviteFriends";
import InvisibleProfile from "./InvisibleProfile";
import LikesMatchModal from "./LikesMatchModal";
import ScrollUp from "./ScrollUp";

import FeaturedProfiles from "../FeaturedProfiles";
import MemberProfiles from "../MemberProfiles";

import 'assets/css/login-modal.css';

interface IProfilesContainerProps {
  ErrorHandler: any;
  ReactGA: any;
  ageRange: any;
  dayjs: any;
  distance: number
  distanceMetric: string;
  history: any;
  interestedIn: any;
  isBlackMember: boolean
  lat: number | string;
  likesSent: number;
  loading: boolean;
  long: number;
  msgsSent: any;
  t: any;
  toggleShareModal: () => void;
}

const ProfilesContainer: React.FC<IProfilesContainerProps> = memo(({
  ErrorHandler,
  ReactGA,
  ageRange,
  dayjs,
  distance,
  distanceMetric,
  history,
  interestedIn,
  isBlackMember,
  lat,
  likesSent,
  loading,
  long,
  msgsSent,
  t,
  toggleShareModal
}) => {
  const [state, setState] = useState<any>({
    skip: 0,
    loading: false,
    msgModalVisible: false,
    profile: null,
    matchDlgVisible: false,
    maxLikeDlgVisible: false,
    blockDlgVisible: false,
    chatID: null,
    likedProfiles: [],
    msgdProfiles: [],
    hasMore: true
  });

  const searchParams = {
    long,
    lat,
    distance,
    ageRange,
    interestedIn,
    limit: parseInt(process.env.REACT_APP_SEARCHPROS_LIMIT),
    skip: 0,
    isMobile: sessionStorage.getItem("isMobile"),
  }

  const { data, loading: queryLoading, fetchMore, error } = useQuery(SEARCH_PROFILES, {
    variables: searchParams,
    fetchPolicy: "cache-first",
  });

  const [likeProfile] = useMutation(LIKE_PROFILE, {
    variables: {
      toProfileID: state.profile && state.profile.id
    }
  });

  useEffect(() => {
    document.title = t("common:Search Profiles");
  }, []);

  const setMaxLikeDlgVisible = () => {
    ErrorHandler.setBreadcrumb("Max Like Dialog Toggled:");
    setState({ ...state, maxLikeDlgVisible: !state.maxLikeDlgVisible })
  };

  const toggleBlockModalVisible = (profile = null) => {
    ErrorHandler.setBreadcrumb("Block Dialog Toggled:");
    setState({ ...state, profile, blockDlgVisible: !state.blockDlgVisible });
  };

  const setMatchDlgVisible = (matchDlgVisible, profile, chatID = null) => {
    ErrorHandler.setBreadcrumb("Match Dialog Toggled:");
    if (profile) {
      setState({ ...state, profile, matchDlgVisible, chatID, linkedProfiles: [...state.likedProfiles, profile.id] })
    }
    else {
      setState({ ...state, matchDlgVisible });
    }
  };

  const setMsgModalVisible = (msgModalVisible, profile = null) => {
    ErrorHandler.setBreadcrumb(
      "Message Modal visible:" + msgModalVisible
    );

    if (msgsSent > 4 && msgModalVisible) {
      if (!toast.isActive("maxmsgs")) {
        toast.info(t("common:Daily Direct Message Limit Reached. *Only 5 allowed daily."), {
          position: toast.POSITION.TOP_CENTER,
          toastId: "maxmsgs"
        });
      }
      return;
    }

    if (!isBlackMember) {
      if (!toast.isActive("directerr")) {
        toast.info(
          <div
            onClick={() =>
              history.push({
                pathname: "/settings",
                state: { showBlkMdl: true }
              })
            }
          >
            {t("common:directerr")}
          </div>,
          {
            position: toast.POSITION.TOP_CENTER,
            toastId: "directerr"
          }
        );
      }
      return;
    }
    if (profile) {
      setState({ ...state, profile, msgModalVisible })
    }
    else {
      setState({ ...state, msgModalVisible });
    }
  };

  const handleLike = (likeProfile, profile) => {
    ErrorHandler.setBreadcrumb("Liked:" + likeProfile);

    if (likesSent > 24) {
      setMaxLikeDlgVisible();
      return;
    }
    let { likedProfiles } = state;
    if (likedProfiles.includes(profile.id)) {
      likedProfiles = likedProfiles.filter(
        likeID => likeID.toString() !== profile.id
      );
    } else {
      likedProfiles = [...state.likedProfiles, profile.id];
    }

    setState({ ...state, profile, likedProfiles });
    likeProfile({ variables: { toProfileID: profile && profile.id } })
      .then(({ data }) => {
        switch (data.likeProfile) {
          case "like":
            ReactGA.event({
              category: "Search Profiles",
              action: "Liked"
            });
            toast.success(t("common:Liked") + " " + profile.profileName + "!", {
              autoClose: 1500,
              hideProgressBar: true
            });
            break;
          case "unlike":
            ReactGA.event({
              category: "Search Profiles",
              action: "UnLiked"
            });
            toast.success(t("common:UnLiked") + " " + profile.profileName + "!", {
              autoClose: 1500,
              hideProgressBar: true
            });
            break;
          default:
            ReactGA.event({
              category: "Search Profiles",
              action: "Matched"
            });
            setMatchDlgVisible(true, profile, data.likeProfile);
            break;
        }
      })
      .catch(res => {
        ErrorHandler.catchErrors(res);
      });
  };

  const fetchData = async fetchMore => {
    ErrorHandler.setBreadcrumb("Fetch more profiles");
    const { skip, hasMore } = state;

    if (hasMore) {
      setState({ ...state, loading: true });
      fetchMore({
        variables: {
          long,
          lat,
          distance,
          ageRange,
          interestedIn,
          skip: skip,
          limit: parseInt(process.env.REACT_APP_SEARCHPROS_LIMIT)
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          setState({ ...state, loading: false })
          if (
            !fetchMoreResult ||
            fetchMoreResult.searchProfiles.profiles.length === 0
          ) {
            setState({ ...state, hasMore: false });
            return previousResult;
          }

          return {
            searchProfiles: {
              ...previousResult.searchProfiles,
              profiles: [
                ...previousResult.searchProfiles.profiles,
                ...fetchMoreResult.searchProfiles.profiles
              ]
            }
          };
        }
      })
    }
  };

  const handleEnd = ({ previousPosition, fetchMore }) => {
    if (previousPosition === Waypoint.below) {
      setState({ ...state, skip: state.skip + parseInt(process.env.REACT_APP_SEARCHPROS_LIMIT) })
      fetchData(fetchMore);
    }
  };

  const setMessaged = profileID => {
    ErrorHandler.setBreadcrumb("Messaged:" + profileID);
    setState({ ...state, msgdProfiles: [state.msgdProfiles, profileID], msgModalVisible: false });
  };

  const {
    profile,
    msgModalVisible,
    matchDlgVisible,
    chatID,
    likedProfiles,
    msgdProfiles,
    maxLikeDlgVisible,
    blockDlgVisible
  } = state;

  if (loading && state.loading || queryLoading) {
    return <Spinner page="searchProfiles" title={t("allmems")} />;
  }

  if (error) {
    return (
      <ErrorHandler.report
        error={error}
        calledName={"searchProfiles"}
      />
    );
  }

  if (
    !data || !data.searchProfiles ||
    (data &&
      data.searchProfiles.profiles.length === 0 &&
      data.searchProfiles.featuredProfiles.length === 0)
  ) {
    if (data.searchProfiles.message === "invisible") {
      return (
        <InvisibleProfile t={t} />
      );
    }
    return (
      <InviteFriends t={t} toggleShareModal={toggleShareModal} />
    );
  }

  const result = data.searchProfiles;

  return (
    <React.Fragment>
      {result.featuredProfiles.length !== 0 && (
        <FeaturedProfiles
          featuredProfiles={result.featuredProfiles}
          showMsgModal={profile =>
            setMsgModalVisible(true, profile)
          }
          likeProfile={profile =>
            handleLike(likeProfile, profile)
          }
          history={history}
          t={t}
          dayjs={dayjs}
          likedProfiles={likedProfiles}
          msgdProfiles={msgdProfiles}
          distanceMetric={distanceMetric}
          toggleBlockModalVisible={profile =>
            toggleBlockModalVisible(profile)
          }
        />
      )}
      {result.profiles.length !== 0 && (
        <MemberProfiles
          profiles={result.profiles}
          showMsgModal={profile => setMsgModalVisible(true, profile)}
          likeProfile={profile => handleLike(likeProfile, profile)}
          history={history}
          handleEnd={({ previousPosition }) =>
            handleEnd({ previousPosition, fetchMore })
          }
          t={t}
          dayjs={dayjs}
          distanceMetric={distanceMetric}
          likedProfiles={likedProfiles}
          msgdProfiles={msgdProfiles}
          toggleBlockModalVisible={profile =>
            toggleBlockModalVisible(profile)
          }
        />
      )}

      <ScrollUp loading={state.loading} t={t} />
      {profile && msgModalVisible && (
        <DirectMsgModal
          profile={profile}
          close={() => setMsgModalVisible(false)}
          ErrorHandler={ErrorHandler}
          setMsgd={setMessaged}
          ReactGA={ReactGA}
        />
      )}
      {profile && blockDlgVisible && (
        <BlockModal
          id={profile.id}
          profile={profile}
          close={toggleBlockModalVisible}
          ErrorHandler={ErrorHandler}
          ReactGA={ReactGA}
          isRemove={true}
          searchParams={searchParams}
        />
      )}
      {profile && chatID && matchDlgVisible && (
        <LikesMatchModal
          onConfirm={() => { history.push(`/inbox/${chatID}`) }}
          onClose={() => setMatchDlgVisible(false, profile)}
          profileName={profile.name}
          t={t}
        />
      )
      }
      {maxLikeDlgVisible && (
        <DailyLimitModal
          close={setMaxLikeDlgVisible}
          t={t}
          history={history}
        />
      )}
      <Prompt
        message={(location, actionType) => {
          if (actionType === "POP") {
            history.goForward();
            setMsgModalVisible(false, profile);
            return false;
          } else {
            return true;
          }
        }}
        when={msgModalVisible}
      />
    </React.Fragment>
  );
});

export default ProfilesContainer;
