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
