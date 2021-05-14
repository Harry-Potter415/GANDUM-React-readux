import gql from "graphql-tag";

const GET_NEWSLETTERS = gql`
  {
    newsletters {
      id
      email
      date
      updated
    }
  }
`;

export {
  GET_NEWSLETTERS
};
