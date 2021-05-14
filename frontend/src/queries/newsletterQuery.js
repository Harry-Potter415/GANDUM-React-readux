import gql from "graphql-tag";

const ADD_NEWSLETTER = gql`
  mutation(
    $email: String
  ) {
    addNewsletter(email: $email) {
      id
      email
      date
    }
  }
`;

export {
  ADD_NEWSLETTER
};
