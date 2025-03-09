class Queries {
  static const String loginAdminUser = r'''
      query loginAdminUser($input: AdminUserInput!) {
        loginAdminUser(input: $input) {
          id
          email
          token
      }
    }
    ''';

  static const String getAdminUser = r'''
      query getAdminUsers($limit: Int!) { # $filter is the parameter
       getAdminUsers(limit: $limit) {
          created_at
          email
          id
          last_login
          password
          role
          type
          updated_at
          username
        }
      }
    ''';

  static const String getAdminUserAccessRequests = r'''
      query getAdminUserAccessRequests($limit: Int!) {
        getAdminUserAccessRequests(limit: $limit) {
          created_at
          email
          id
        }
      }
    ''';

  static const String getProjects = r'''
      query getProjects($limit: Int!) {
        getProjects(limit: $limit) {
          created_at
          description
          github_link
          id
          live_link
          name
          project_category_id
          tech_stacks
          test_link
          updated_at
        }
      }
    ''';

  static const String getProjectCategories = r'''
      query getProjectCategories($limit: Int!) {
        getProjectCategories(limit: $limit) {
          id
          name
          updated_at
          created_at
        }
      }
    ''';
}
