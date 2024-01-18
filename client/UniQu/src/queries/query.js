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
