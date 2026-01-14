import { gql } from '@apollo/client/core';

export const LOGIN_ADMIN_USER = gql`
  query LoginAdminUser($input: AdminLoginInput!) {
    loginAdminUser(input: $input) {
      id
      email
      token
    }
  }
`;

export const CREATE_ADMIN_USER = gql`
  mutation CreateAdminUser($input: AdminUserInput!) {
    createAdminUser(input: $input) {
      id
      username
      email
    }
  }
`;

export const CREATE_PROJECT_CATEGORY = gql`
  mutation CreateProjectCategory($name: String!) {
    createProjectCategory(name: $name) {
      id
      name
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation CreateProject($input: ProjectInput!) {
    createProject(input: $input) {
      id
      name
    }
  }
`;
