import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Mutation($email: String, $password: String) {
    login(email: $email, password: $password) {
      access_token
    }
  }
`;
export const FOR_YOU_TALENT_PAGE = gql`
  query TalentsForMe {
    talentsForMe {
      talentsForMe {
        _id
        name
        username
        email
        password
        aboutme
        role
        gender
        imgUrl
        tags
        reviews {
          message
          reviewerName
          updatedAt
          createdAt
          rating
        }
        rating
        talentLocations
        balance
        updatedAt
        createdAt
      }
    }
  }
`;

export const GET_USER = gql`
  query WhoAmI {
    whoAmI {
      name
      imgUrl
    }
  }
`;

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
`;

export const WHO_AM_I_USER = gql`
  query WhoAmI {
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
      createdAt
      updatedAt
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
    }
  }
`;

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
      imgUrl
      tags
      userLocations
      createdAt
      updatedAt
    }
  }
`;

export const WHO_AM_I_TALENT = gql`
  query WhoAmITalent {
    whoAmITalent {
      _id
      name
      username
      email
      password
      aboutme
      gender
      imgUrl
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
      talentBookings {
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
      talentTransactions {
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
      talentBankAccount {
        _id
        TalentId
        bankName
        accountName
        accountNumber
        updatedAt
        createdAt
      }
      updatedAt
      createdAt
    }
  }
`;


export const USER_REGISTER = gql`
  mutation Register($newUser: NewUser) {
  register(newUser: $newUser) {
    _id
    name
    username
    email
    password
    role
    gender
    imgUrl
    tags
    userLocations
    createdAt
    updatedAt
  }
}
`

export const GET_TALENTS_BY_ID = gql`
  query GetTalentsById($talentId: String) {
    getTalentsById(talentId: $talentId) {
      _id
      name
      username
      email
      password
      aboutme
      gender
      imgUrl
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
    }
  }
`;

