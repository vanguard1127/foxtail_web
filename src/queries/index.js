//TODO: Remove apollo boost and replace with something smaller or already used
import gql from "graphql-tag";

/* Subscriptions */
export const NEW_MESSAGE_SUB = gql`
  subscription($chatID: ID!) {
    newMessageSubscribe(chatID: $chatID) {
      id
      text
      fromUser {
        username
        id
      }
      profilePic
      type
      createdAt
    }
  }
`;

export const NEW_INBOX_SUB = gql`
  subscription {
    newInboxMsgSubscribe {
      id
      text
      fromUser {
        username
        id
      }
      fromProfile {
        profileName
        id
      }
      createdAt
      profilePic
      chatID
      participants {
        profileName
        profilePic
        id
      }
      invited {
        profileName
        profilePic
        id
      }
      unSeenCount
    }
  }
`;

export const NEW_NOTICE_SUB = gql`
  subscription {
    newNoticeSubscribe {
      id
      seen
      read
      type
      text
      targetID
      date
      fromProfile {
        profilePic
        profileName
      }
    }
  }
`;

/* Mutations */
export const CREATE_USER = gql`
  mutation(
    $username: String!
    $email: String!
    $phone: String!
    $gender: String!
    $interestedIn: [String]
    $dob: String!
    $lang: String
  ) {
    createUser(
      username: $username
      email: $email
      phone: $phone
      gender: $gender
      interestedIn: $interestedIn
      dob: $dob
      lang: $lang
    ) {
      token
      access
    }
  }
`;

export const CREATE_SUBSCRIPTION = gql`
  mutation($token: String!, $ccLast4: String!) {
    createSubcription(token: $token, ccLast4: $ccLast4)
  }
`;

export const UPDATE_SUBSCRIPTION = gql`
  mutation($token: String!, $ccLast4: String!) {
    updateSubcription(token: $token, ccLast4: $ccLast4)
  }
`;

export const SUBMIT_PHOTO = gql`
  mutation($reason: String!, $photo: String!) {
    submitPhoto(reason: $reason, photo: $photo)
  }
`;

export const CANCEL_SUBSCRIPTION = gql`
  mutation {
    cancelSubcription
  }
`;

export const LINK_PROFILE = gql`
  mutation($code: String!) {
    linkProfile(code: $code) {
      id
      partnerName
    }
  }
`;

export const READ_CHAT = gql`
  mutation($chatID: ID!) {
    readChat(chatID: $chatID)
  }
`;

export const UNLINK_PROFILE = gql`
  mutation {
    unlinkProfile
  }
`;

export const SUBMIT_PHOTO_REVIEW = gql`
  mutation($reason: String!, $photo: String!) {
    submitPhotoReview(reason: $reason, photo: $photo)
  }
`;

export const DELETE_PHOTO = gql`
  mutation($publicPhotoList: [String], $privatePhotoList: [String]) {
    deletePhoto(
      publicPhotoList: $publicPhotoList
      privatePhotoList: $privatePhotoList
    )
  }
`;

export const SEND_MESSAGE = gql`
  mutation($chatID: ID, $text: String!, $invitedProfile: ID) {
    sendMessage(chatID: $chatID, text: $text, invitedProfile: $invitedProfile)
  }
`;

export const POST_COMMENT = gql`
  mutation($chatID: ID!, $text: String!) {
    postComment(chatID: $chatID, text: $text)
  }
`;

export const REMOVE_LOCLOCK = gql`
  mutation {
    removeLocation
  }
`;

export const DELETE_USER = gql`
  mutation {
    deleteUser
  }
`;

export const UPDATE_LOCATION = gql`
  mutation($lat: Float!, $long: Float!, $city: String!, $country: String) {
    updateLocation(lat: $lat, long: $long, city: $city, country: $country)
  }
`;

export const UPDATE_SETTINGS = gql`
  mutation(
    $distance: Int
    $distanceMetric: String
    $profilePic: String
    $ageRange: [Int]
    $lang: String
    $interestedIn: [String]
    $city: String
    $country: String
    $email: String
    $phone: String
    $username: String
    $gender: String
    $lat: Float
    $long: Float
    $visible: Boolean
    $newMsgNotify: Boolean
    $emailNotify: Boolean
    $showOnline: Boolean
    $likedOnly: Boolean
    $vibrateNotify: Boolean
    $desires: [String]
    $about: String
    $publicPhotoList: [String]
    $privatePhotoList: [String]
    $includeMsgs: Boolean
  ) {
    updateSettings(
      distance: $distance
      distanceMetric: $distanceMetric
      profilePic: $profilePic
      ageRange: $ageRange
      lang: $lang
      interestedIn: $interestedIn
      city: $city
      country: $country
      lat: $lat
      long: $long
      email: $email
      phone: $phone
      username: $username
      gender: $gender
      visible: $visible
      newMsgNotify: $newMsgNotify
      emailNotify: $emailNotify
      showOnline: $showOnline
      likedOnly: $likedOnly
      vibrateNotify: $vibrateNotify
      desires: $desires
      about: $about
      publicPhotoList: $publicPhotoList
      privatePhotoList: $privatePhotoList
      includeMsgs: $includeMsgs
    )
  }
`;

export const FLAG_ITEM = gql`
  mutation($type: String!, $reason: String!, $targetID: ID!) {
    flagItem(type: $type, reason: $reason, targetID: $targetID)
  }
`;

export const LIKE_PROFILE = gql`
  mutation($toProfileID: ID!) {
    likeProfile(toProfileID: $toProfileID)
  }
`;

export const BLOCK_PROFILE = gql`
  mutation($blockedProfileID: ID!) {
    blockProfile(blockedProfileID: $blockedProfileID)
  }
`;
export const LOGIN = gql`
  mutation($phone: String!) {
    login(phone: $phone) {
      token
      access
    }
  }
`;

export const UPDATE_NOTIFICATIONS = gql`
  mutation($notificationIDs: [String]!, $read: Boolean, $seen: Boolean) {
    updateNotifications(
      notificationIDs: $notificationIDs
      read: $read
      seen: $seen
    )
  }
`;

export const INVITE_PROFILES = gql`
  mutation($chatID: ID!, $invitedProfiles: [ID]!) {
    inviteProfile(chatID: $chatID, invitedProfiles: $invitedProfiles)
  }
`;

export const INVITE_PROFILES_EVENT = gql`
  mutation($eventID: ID!, $invitedProfiles: [ID]!) {
    inviteProfileEvent(eventID: $eventID, invitedProfiles: $invitedProfiles)
  }
`;

export const REMOVE_PROFILES_EVENT = gql`
  mutation($eventID: ID!, $removedProfiles: [ID]!) {
    removeProfileEvent(eventID: $eventID, removedProfiles: $removedProfiles)
  }
`;

export const REMOVE_PROFILES_CHAT = gql`
  mutation($chatID: ID!, $removedProfiles: [ID]!) {
    removeProfilesChat(chatID: $chatID, removedProfiles: $removedProfiles)
  }
`;

export const TOGGLE_ONLINE = gql`
  mutation($online: Boolean!) {
    toggleOnline(online: $online)
  }
`;

export const CREATE_EVENT = gql`
  mutation(
    $eventname: String!
    $tagline: String
    $desires: [String]
    $interestedIn: [String]
    $description: String!
    $lat: Float!
    $long: Float!
    $address: String!
    $type: String!
    $startTime: String!
    $endTime: String!
    $image: String
    $eventID: ID
  ) {
    createEvent(
      eventname: $eventname
      tagline: $tagline
      desires: $desires
      interestedIn: $interestedIn
      description: $description
      lat: $lat
      long: $long
      startTime: $startTime
      endTime: $endTime
      eventID: $eventID
      address: $address
      image: $image
      type: $type
    ) {
      id
      eventname
      tagline
      type
      participants {
        profileName
        profilePic
        id
      }
      description
      desires
      interestedIn
      distance
      address
      startTime
      endTime
      image
    }
  }
`;

export const SEEN_TOUR = gql`
  mutation($tour: String!) {
    seenTour(tour: $tour)
  }
`;

export const DELETE_EVENT = gql`
  mutation($eventID: ID!) {
    deleteEvent(eventID: $eventID)
  }
`;

export const TOGGLE_EVENT_ATTEND = gql`
  mutation($eventID: ID!) {
    toggleAttendEvent(eventID: $eventID)
  }
`;

export const SEND_PHONE_RESET_EMAIL = gql`
  mutation($phone: String!) {
    sendPhoneResetEmail(phone: $phone)
  }
`;

export const FB_RESOLVE = gql`
  mutation($csrf: String!, $code: String!) {
    fbResolve(csrf: $csrf, code: $code) {
      token
      access
    }
  }
`;

export const FB_RESET_PHONE = gql`
  mutation($csrf: String!, $code: String!, $token: String!) {
    fbResetPhone(csrf: $csrf, code: $code, token: $token) {
      token
      access
    }
  }
`;

export const SIGNS3 = gql`
  mutation($filename: String!, $filetype: String!) {
    signS3(filename: $filename, filetype: $filetype) {
      key
      signedRequest
      url
    }
  }
`;

export const SEARCH_DESIRES = gql`
  query($searchTerm: String!) {
    searchDesires(searchTerm: $searchTerm)
  }
`;

export const REMOVE_SELF = gql`
  mutation($chatID: ID!) {
    removeSelf(chatID: $chatID)
  }
`;
/* Queries */
export const SEARCH_EVENTS = gql`
  query(
    $long: Float!
    $lat: Float!
    $maxDistance: Int!
    $desires: [String]
    $limit: Int!
    $skip: Int!
  ) {
    searchEvents(
      long: $long
      lat: $lat
      maxDistance: $maxDistance
      desires: $desires
      limit: $limit
      skip: $skip
    ) {
      id
      eventname
      type
      image
      participants {
        profileName
        profilePic
        id
      }
      description
      desires
      interestedIn
      address
      startTime
      distance
      ownerProfile {
        profilePic
        profileName
        id
      }
    }
  }
`;

export const SEARCH_PROFILES = gql`
  query(
    $long: Float!
    $lat: Float!
    $distance: Int!
    $interestedIn: [String]!
    $ageRange: [Int]!
    $limit: Int!
    $skip: Int!
  ) {
    searchProfiles(
      long: $long
      lat: $lat
      distance: $distance
      interestedIn: $interestedIn
      ageRange: $ageRange
      limit: $limit
      skip: $skip
    ) {
      profiles {
        id
        about
        desires
        profileName
        profilePic
        distance
        users {
          id
          username
          dob
          gender
          verifications {
            stdVer {
              active
            }
            photoVer {
              active
            }
          }
        }
        publicCode
        showOnline
        updatedAt
        online
      }
      featuredProfiles {
        id
        about
        desires
        profileName
        profilePic
        users {
          id
          username
          dob
          gender
          verifications {
            stdVer {
              active
            }
            photoVer {
              active
            }
          }
        }
        publicCode
        showOnline
        updatedAt
        online
      }
    }
  }
`;

export const READ_CHAT_QUERY = gql`
  query($chatID: ID!) {
    readChatQuery(chatID: $chatID) {
      id
      updatedAt
      ownerProfile {
        id
      }
      messages {
        id
        text
        fromUser {
          username
          id
        }
        profilePic
        createdAt
      }
      participants {
        id
        profilePic
        profileName
        updatedAt
        online
        users {
          username
          id
        }
      }
    }
  }
`;

export const GET_EVENT = gql`
  query($id: ID!) {
    event(id: $id) {
      id
      eventname
      type
      image
      participants {
        profileName
        profilePic
        id
      }
      description
      desires
      interestedIn
      ownerProfile {
        profilePic
        profileName
        id
      }
      address
      startTime
      endTime
      distance
      chatID
      invited {
        id
      }
      createdAt
      lat
      long
      tagline
    }
  }
`;

export const GET_INBOX = gql`
  query {
    getInbox {
      id
      chatID
      text
      fromUser {
        username
        id
      }
      fromProfile {
        profileName
        id
      }
      profilePic
      createdAt
      participants {
        profileName
        profilePic
        id
      }
      unSeenCount
    }
  }
`;

export const GET_MY_EVENTS = gql`
  query {
    getMyEvents {
      docs {
        id
        eventname
        type
        image
        participants {
          profileName
          profilePic
          id
        }
        description
        desires
        interestedIn
        address
        startTime
        endTime
        distance
        ownerProfile {
          profilePic
          profileName
          id
        }
      }
      total
      offset
    }
  }
`;
export const GET_FRIENDS = gql`
  query($limit: Int!, $skip: Int, $chatID: ID, $isEvent: Boolean) {
    getFriends(limit: $limit, skip: $skip, chatID: $chatID, isEvent: $isEvent) {
      profilePic
      profileName
      id
    }
  }
`;

export const GET_CHAT_PARTICIPANTS = gql`
  query($chatID: ID!) {
    chat(id: $chatID) {
      participants {
        profilePic
        profileName
        id
      }
    }
  }
`;

export const GET_EVENT_PARTICIPANTS = gql`
  query($eventID: ID) {
    event(id: $eventID) {
      participants {
        profilePic
        profileName
        id
      }
    }
  }
`;

export const GET_NOTIFICATIONS = gql`
  query($limit: Int!, $skip: Int!) {
    getNotifications(limit: $limit, skip: $skip) {
      notifications {
        id
        seen
        read
        type
        text
        targetID
        date
        body
        fromProfile {
          profilePic
          profileName
        }
      }
      alert {
        id
        seen
        read
        type
        text
        targetID
        date
        title
        body
      }
      total
    }
  }
`;

export const GET_MESSAGES = gql`
  query($chatID: ID!, $limit: Int!, $cursor: String) {
    getMessages(chatID: $chatID, limit: $limit, cursor: $cursor) {
      messages {
        id
        text
        fromUser {
          username
          id
          profile {
            id
          }
        }
        profilePic
        type
        createdAt
      }
    }
  }
`;

export const GET_COMMENTS = gql`
  query($chatID: ID!, $limit: Int!, $cursor: String) {
    getComments(chatID: $chatID, limit: $limit, cursor: $cursor) {
      messages {
        id
        text
        fromUser {
          username
          id
          profile {
            id
          }
        }
        profilePic
        type
        createdAt
      }
    }
  }
`;

export const GET_COUNTS = gql`
  query {
    getCounts {
      msgsCount
      noticesCount
    }
  }
`;

export const CONFIRM_EMAIL = gql`
  query($token: String!) {
    confirmEmail(token: $token)
  }
`;

export const GET_CURRENT_USER = gql`
  query {
    currentuser {
      username
      userID
      profileID
      profilePic
      blackMember {
        active
        renewalDate
      }
      ccLast4
      isProfileOK
      isEmailOK
      tours
      location {
        city
        crds {
          long
          lat
        }
      }
    }
  }
`;

export const GET_SEARCH_SETTINGS = gql`
  query {
    getSettings {
      distance
      distanceMetric
      ageRange
      lang
      interestedIn
      city
    }
  }
`;

export const GET_SETTINGS = gql`
  query {
    getSettings {
      distance
      distanceMetric
      ageRange
      lang
      interestedIn
      city
      visible
      newMsgNotify
      emailNotify
      showOnline
      likedOnly
      vibrateNotify
      profilePic
      profilePicUrl
      couplePartner
      includeMsgs
      lastActive
      users {
        username
        verifications {
          photoVer {
            active
          }
          stdVer {
            active
          }
        }
      }
      photos {
        url
        private
        key
        id
      }
      about
      desires
    }
  }
`;

export const GENERATE_CODE = gql`
  query {
    generateCode
  }
`;

export const GET_PROFILE = gql`
  query($id: ID!) {
    profile(id: $id) {
      id
      about
      desires
      profilePic
      profileName
      interestedIn
      photos {
        url
        private
        id
      }
      users {
        id
        username
        dob
        gender
        verifications {
          stdVer {
            active
          }
          photoVer {
            active
          }
        }
      }
      publicCode
      distance
      updatedAt
      online
    }
  }
`;
