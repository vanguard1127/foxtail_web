//TODO: Remove apollo boost and replace with something smaller or already used
import { gql } from "apollo-boost";

/* Subscriptions */
export const NEW_MESSAGE_SUB = gql`
  subscription($chatID: ID!) {
    newMessageSubscribe(chatID: $chatID) {
      id
      text
      fromUser
      profilePic
      createdAt
    }
  }
`;

/* Mutations */
//TODO: fix App version issue
export const CREATE_USER = gql`
  mutation(
    $username: String!
    $email: String!
    $phone: String!
    $gender: String
    $interestedIn: [String]
    $dob: String
  ) {
    createUser(
      username: $username
      email: $email
      appVersion: "3"
      phone: $phone
      gender: $gender
      interestedIn: $interestedIn
      dob: $dob
    ) {
      token
    }
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

export const UNLINK_PROFILE = gql`
  mutation {
    unlinkProfile
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

export const UPDATE_SETTINGS = gql`
  mutation(
    $distance: Int!
    $distanceMetric: String!
    $ageRange: [Int]!
    $interestedIn: [String]!
    $locationLock: String
    $visible: Boolean!
    $newMsgNotify: Boolean!
    $emailNotify: Boolean!
    $showOnline: Boolean!
    $likedOnly: Boolean!
    $vibrateNotify: Boolean
  ) {
    updateSettings(
      distance: $distance
      distanceMetric: $distanceMetric
      ageRange: $ageRange
      interestedIn: $interestedIn
      locationLock: $locationLock
      visible: $visible
      newMsgNotify: $newMsgNotify
      emailNotify: $emailNotify
      showOnline: $showOnline
      likedOnly: $likedOnly
      vibrateNotify: $vibrateNotify
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
    }
  }
`;

export const CREATE_EVENT = gql`
  mutation(
    $eventname: String!
    $desires: [String]
    $interestedIn: [String]
    $description: String
    $lat: Float
    $long: Float
    $address: String!
    $type: String!
    $time: String!
    $eventID: ID
  ) {
    createEvent(
      eventname: $eventname
      desires: $desires
      interestedIn: $interestedIn
      description: $description
      lat: $lat
      long: $long
      time: $time
      eventID: $eventID
      address: $address
      type: $type
    ) {
      id
      eventname
      type
      participants
      description
      desires
      interestedIn
      lat
      long
      address
      time
    }
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

export const FB_RESOLVE = gql`
  mutation($csrf: String, $code: String) {
    fbResolve(csrf: $csrf, code: $code)
  }
`;

export const UPLOAD_PHOTO = gql`
  mutation($order: Int!, $url: String!) {
    uploadPhoto(order: $order, url: $url)
  }
`;

export const UPLOAD_PHOTOLIST = gql`
  mutation($photoList: [String]!, $isPrivate: Boolean) {
    uploadPhotoList(photoList: $photoList, isPrivate: $isPrivate)
  }
`;

export const UPDATE_PROFILE = gql`
  mutation(
    $desires: [String]
    $about: String
    $publicPhotoList: [String]
    $privatePhotoList: [String]
  ) {
    updateProfile(
      desires: $desires
      about: $about
      publicPhotoList: $publicPhotoList
      privatePhotoList: $privatePhotoList
    )
  }
`;

export const SIGNS3 = gql`
  mutation($filename: String!, $filetype: String!) {
    signS3(filename: $filename, filetype: $filetype) {
      key
      signedRequest
    }
  }
`;

/* Queries */
export const SEARCH_EVENTS = gql`
  query(
    $long: Float!
    $lat: Float!
    $desires: [String]
    $limit: Int
    $skip: Int
    $all: Boolean
  ) {
    searchEvents(
      long: $long
      lat: $lat
      desires: $desires
      limit: $limit
      skip: $skip
      all: $all
    ) {
      date
      events {
        id
        eventname
        type
        participants
        description
        desires
        interestedIn
        lat
        long
        address
        time
      }
    }
  }
`;

export const SEARCH_PROFILES = gql`
  query($long: Float!, $lat: Float!, $limit: Int, $skip: Int) {
    searchProfiles(long: $long, lat: $lat, limit: $limit, skip: $skip) {
      id
      about
      desires
      photos {
        url
        private
      }
      users {
        id
        username
        dob
        gender
        verifications {
          std
          photo
        }
      }
      publicCode
    }
  }
`;

export const SEARCH_DESIRES = gql`
  query($searchTerm: String!) {
    searchDesires(searchTerm: $searchTerm)
  }
`;

export const GET_EVENT = gql`
  query($id: String!) {
    event(id: $id) {
      id
      eventname
      type
      participants
      description
      desires
      interestedIn
      lat
      long
      address
      time
      invited {
        id
      }
    }
  }
`;

export const GET_INBOX = gql`
  query {
    getInbox {
      id
      chatID
      text
      fromUser
      profilePic
      createdAt
      participants {
        profileName
        updatedAt
        profilePic
        _id
      }
    }
  }
`;

export const GET_MY_EVENTS = gql`
  query($skip: Int!) {
    getMyEvents(skip: $skip) {
      docs {
        id
        eventname
        time
      }
      total
      offset
    }
  }
`;

export const GET_MESSAGES = gql`
  query($chatID: ID!, $limit: Int!, $cursor: String) {
    getMessages(chatID: $chatID, limit: $limit, cursor: $cursor) {
      messages {
        id
        text
        fromUser
        profilePic
        createdAt
      }
      participants {
        profilePic
        profileName
        users {
          username
        }
      }
    }
  }
`;

export const GET_CURRENT_USER = gql`
  query {
    currentuser {
      username
      userID
      profileID
    }
  }
`;

export const GET_SETTINGS = gql`
  query {
    getSettings {
      distance
      distanceMetric
      ageRange
      interestedIn
      locationLock
      visible
      newMsgNotify
      emailNotify
      showOnline
      likedOnly
      vibrateNotify
      couplePartner
    }
  }
`;

export const GENERATE_CODE = gql`
  query {
    generateCode
  }
`;

export const GET_MY_PROFILE = gql`
  query {
    getMyProfile {
      users {
        username
      }
      photos {
        url
        private
        id
      }
      about
      desires
    }
  }
`;

export const GET_PROFILE = gql`
  query($id: String!) {
    profile(id: $id) {
      id
      about
      desires
      photos {
        url
        private
      }
      users {
        id
        username
        dob
        gender
        verifications {
          std
          photo
        }
      }
      publicCode
    }
  }
`;
