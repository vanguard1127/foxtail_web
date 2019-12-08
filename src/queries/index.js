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
        profile {
          id
        }
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
      type
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

export const CREATE_SUBSCRIPTION = gql`
  mutation(
    $ccnum: String!
    $exp: String!
    $cvc: String!
    $fname: String!
    $lname: String!
  ) {
    createSubcription(
      ccnum: $ccnum
      exp: $exp
      cvc: $cvc
      fname: $fname
      lname: $lname
    )
  }
`;

export const UPDATE_SUBSCRIPTION = gql`
  mutation($token: String!, $ccLast4: String!) {
    updateSubcription(token: $token, ccLast4: $ccLast4)
  }
`;

export const SUBMIT_PHOTO = gql`
  mutation($type: String!, $image: String!) {
    submitPhoto(type: $type, image: $image)
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
      profileID
      partnerName
    }
  }
`;

export const CONFIRM_HUMAN = gql`
  mutation($capToken: String!) {
    confirmHuman(capToken: $capToken)
  }
`;

export const RESET_CHAT = gql`
  mutation($chatID: ID!) {
    resetChat(chatID: $chatID)
  }
`;

export const READ_CHAT = gql`
  mutation($chatID: ID) {
    readChat(chatID: $chatID)
  }
`;

export const UNLINK_PROFILE = gql`
  mutation {
    unlinkProfile
  }
`;

export const RESEND_EMAIL_VER = gql`
  mutation {
    resendVerEMail
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
  mutation(
    $chatID: ID
    $text: String!
    $invitedProfile: ID
    $instant: Boolean
  ) {
    sendMessage(
      chatID: $chatID
      text: $text
      invitedProfile: $invitedProfile
      instant: $instant
    )
  }
`;

export const MESSAGE_ADMIN = gql`
  mutation($name: String, $email: String, $text: String!) {
    messageAdmin(name: $name, email: $email, text: $text)
  }
`;

export const POST_COMMENT = gql`
  mutation($chatID: ID!, $text: String!) {
    postComment(chatID: $chatID, text: $text)
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
    $sex: String
    $lat: Float
    $long: Float
    $visible: Boolean
    $newMsgNotify: Boolean
    $emailNotify: Boolean
    $showOnline: Boolean
    $likedOnly: Boolean
    $vibrateNotify: Boolean
    $kinks: [String]
    $about: String
    $sexuality: String
    $publicPhotoList: [String]
    $privatePhotoList: [String]
    $includeMsgs: Boolean
    $profileID: String
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
      sex: $sex
      sexuality: $sexuality
      visible: $visible
      newMsgNotify: $newMsgNotify
      emailNotify: $emailNotify
      showOnline: $showOnline
      likedOnly: $likedOnly
      vibrateNotify: $vibrateNotify
      kinks: $kinks
      about: $about
      publicPhotoList: $publicPhotoList
      privatePhotoList: $privatePhotoList
      includeMsgs: $includeMsgs
      profileID: $profileID
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

export const READ_NOTIFICATION = gql`
  mutation($notificationID: String!) {
    readNotification(notificationID: $notificationID)
  }
`;

export const CONVERT_COUPLE = gql`
  mutation($coupleProID: ID!) {
    convertToCouple(coupleProID: $coupleProID)
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

export const CREATE_EVENT = gql`
  mutation(
    $eventname: String!
    $tagline: String
    $kinks: [String]
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
    $isImageAlt: Boolean
  ) {
    createEvent(
      eventname: $eventname
      tagline: $tagline
      kinks: $kinks
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
      isImageAlt: $isImageAlt
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
      kinks
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

export const RESET_PASSWORD = gql`
  mutation($password: String!, $token: String) {
    resetPassword(password: $password, token: $token)
  }
`;

export const SEND_PASSWORD_RESET_EMAIL = gql`
  mutation($phone: String!, $email: String!) {
    sendPasswordResetEmail(phone: $phone, email: $email)
  }
`;

export const FB_RESOLVE = gql`
  mutation(
    $csrf: String!
    $code: String!
    $isCreate: Boolean!
    $email: String
    $password: String
    $username: String
    $lang: String
    $dob: String
    $sex: String
    $interestedIn: [String]
    $refer: String
    $aff: String
  ) {
    fbResolve(
      csrf: $csrf
      code: $code
      isCreate: $isCreate
      email: $email
      password: $password
      username: $username
      lang: $lang
      dob: $dob
      sex: $sex
      interestedIn: $interestedIn
      refer: $refer
      aff: $aff
    ) {
      token
      access
    }
  }
`;

export const FB_RESET_PHONE = gql`
  mutation($csrf: String!, $code: String!, $token: String, $password: String) {
    fbResetPhone(csrf: $csrf, code: $code, token: $token, password: $password)
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

export const REMOVE_SELF = gql`
  mutation($chatID: ID!, $isBlock: Boolean) {
    removeSelf(chatID: $chatID, isBlock: $isBlock)
  }
`;
/* Queries */
export const SEARCH_EVENTS = gql`
  query(
    $long: Float!
    $lat: Float!
    $maxDistance: Int!
    $kinks: [String]
    $limit: Int!
    $skip: Int!
  ) {
    searchEvents(
      long: $long
      lat: $lat
      maxDistance: $maxDistance
      kinks: $kinks
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
      kinks
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
      message
      profiles {
        id
        about
        kinks
        profileName
        profilePic
        distance
        users {
          id
          username
          dob
          sex
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
        kinks
        profileName
        profilePic
        distance
        users {
          id
          username
          dob
          sex
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
      kinks
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
  query($limit: Int!, $skip: Int!) {
    getInbox(limit: $limit, skip: $skip) {
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
      type
      blackMember
    }
  }
`;

export const GET_MY_EVENTS = gql`
  query {
    getMyEvents {
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
      kinks
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
        name
        event
        coupleProID
        fromProfile {
          profilePic
          profileName
        }
      }
      total
    }
  }
`;

export const GET_MESSAGES = gql`
  query($chatID: ID!, $limit: Int!, $cursor: String) {
    getMessages(chatID: $chatID, limit: $limit, cursor: $cursor) {
      id
      updatedAt
      ownerProfile {
        id
      }
      participants {
        id
        profilePic
        profileName
        updatedAt
        online
        showOnline
        users {
          username
          id
        }
      }
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
      unSeenCount
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
        blackMember
      }
    }
  }
`;

export const GET_COUNTS = gql`
  query {
    getCounts {
      msgsCount
      noticesCount
      newMsg
      alert {
        id
        type
        text
      }
    }
  }
`;

export const CONFIRM_EMAIL = gql`
  query($token: String!) {
    confirmEmail(token: $token)
  }
`;

export const GET_DEMO_COUNTS = gql`
  query {
    getDemoCounts {
      malesNum
      femalesNum
      couplesNum
    }
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
      isProfileOK
      isEmailOK
      tours
      announcement
      distanceMetric
      coupleProfileName
      location {
        city
        crds {
          long
          lat
        }
      }
      active
      captchaReq
      likesSent
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
      publicPhotos {
        url
        key
        id
      }
      privatePhotos {
        url
        key
        id
      }
      about
      kinks
      sexuality
      password
      ccLast4
      verifications
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
      kinks
      profilePic
      profileName
      interestedIn
      publicPhotos {
        url
        id
      }
      privatePhotos {
        url
        id
      }
      users {
        id
        username
        dob
        sex
        sexuality
        verifications {
          stdVer {
            active
          }
          photoVer {
            active
          }
        }
      }
      showOnline
      publicCode
      distance
      updatedAt
      online
      likedByMe
      msgdByMe
    }
  }
`;

export const GET_FULL_LINK = gql`
  query($shortenedUrl: String!) {
    getFullLink(shortenedUrl: $shortenedUrl)
  }
`;

export const SET_FULL_LINK = gql`
  query($url: String!) {
    setFullLink(url: $url)
  }
`;
