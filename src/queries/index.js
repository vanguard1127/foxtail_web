import { gql } from "apollo-boost";

/* Mutations */
export const CREATE_USER = gql`
  mutation(
    $username: String!
    $email: String!
    $password: String!
    $phone: String!
    $sex: String
    $desires: [String]
    $interestedIn: [String]
    $dob: String
    $about: String
  ) {
    createUser(
      username: $username
      email: $email
      password: $password
      appVersion: "3"
      phone: $phone
      sex: $sex
      desires: $desires
      interestedIn: $interestedIn
      dob: $dob
      about: $about
    ) {
      token
    }
  }
`;

export const LOGIN = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export const CREATE_EVENT = gql`
  mutation(
    $eventname: String!
    $desires: [String]
    $sexes: [String]
    $description: String
    $lat: Float
    $long: Float
    $address: String
    $time: String
  ) {
    createEvent(
      eventname: $eventname
      desires: $desires
      sexes: $sexes
      description: $description
      lat: $lat
      long: $long
      time: $time
      address: $address
    ) {
      id
      eventname
      type
      description
      desires
      sexes
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

/* Queries */
export const SEARCH_EVENTS = gql`
  query {
    searchEvents(lat: -23.00, long: 73.00, desires: "M") {
      id
      eventname
      type
      description
      desires
      sexes
      lat
      long
      address
      time
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
      time
      participants
      invited {
        id
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

export const GET_MY_PROFILE = gql`
  query {
    getMyProfile {
      profilename
      desires
    }
  }
`;
