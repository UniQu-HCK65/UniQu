import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Mutation($email: String, $password: String) {
    login(email: $email, password: $password) {
      access_token
    }
  }
`;
export const FOR_YOU_TALENT_PAGE = gql`
  query Talents {
    talentsForMe {
      _id
      username
      talentsForMe {
        _id
        name
        username
        email
        aboutme
        gender
        tags
        rating
        talentLocations
        balance
      }
    }
  }
`;

export const GET_USER = gql`
query WhoAmI {
  whoAmI {
    name
  }
}`

export const GET_ALL_TALENT = gql`
query Talents {
  talents {
    _id
    name
    username
    email
    password
    aboutme
    role
    gender
    tags
    reviews {
      message
      reviewerName
      rating
      updatedAt
      createdAt
    }
    rating
    talentLocations
    balance
    updatedAt
    createdAt
  }
}
`

export const WHO_AM_I_USER = gql`
query Query {
  whoAmI {
    _id
    name
    username
    email
    password
    role
    imgUrl
    gender
    tags
    userLocations
    userBookings {
      _id
      TalentId
      UserId
      talentName
      userName
      bookDate
      bookSession
      bookLocation
      bookStatus
      updatedAt
      createdAt
    }
    userTransactions {
      _id
      TalentId
      UserId
      talentName
      userName
      paymentId
      BookingId
      transactionStatus
      paidByAdmin
      updatedAt
      createdAt
    }
    createdAt
    updatedAt
  }
}`

export const EditUser = gql`
mutation EditProfile($editUser: EditUser) {
  editProfile(editUser: $editUser) {
    _id
    name
    username
    email
    password
    role
    gender
    tags
    userLocations
    createdAt
    updatedAt
  }
}`