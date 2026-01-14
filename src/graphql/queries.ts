import { gql } from '@apollo/client/core';

export const GET_ADMIN_USERS = gql`
  query GetAdminUsers($limit: Int!) {
    getAdminUsers(limit: $limit) {
      data {
        id
        username
        email
        role
        type
        created_at
        updated_at
        last_login
      }
      pagination {
        totalItems
        totalPages
      }
    }
  }
`;

export const GET_PROJECTS = gql`
  query GetProjects($limit: Int!) {
    getProjects(limit: $limit) {
      data {
        id
        project_category_id
        name
        description
        tech_stacks
        github_link
        live_link
        test_link
        created_at
        updated_at
      }
      pagination {
        totalItems
      }
    }
  }
`;

export const GET_PROJECT_CATEGORIES = gql`
  query GetProjectCategories($limit: Int!) {
    getProjectCategories(limit: $limit) {
      data {
        id
        name
        created_at
        updated_at
      }
      pagination {
        totalItems
      }
    }
  }
`;

export const GET_ADMIN_USER_ACCESS_REQUESTS = gql`
  query GetAdminUserAccessRequests($limit: Int!) {
    getAdminUserAccessRequests(limit: $limit) {
      data {
        created_at
        email
        id
      }
      pagination {
        totalItems
      }
    }
  }
`;
export const GET_CONTACT_MESSAGES = gql`
  query GetContactMessages($limit: Int, $page: Int) {
    getContactMessages(limit: $limit, page: $page) {
      data {
        id
        name
        email
        message
        created_at
      }
      pagination {
        totalItems
        totalPages
        currentPage
      }
    }
  }
`;
