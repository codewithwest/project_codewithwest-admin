class Queries {
  static const String loginAdminUser = r'''
      query loginAdminUser($input: AdminUserInput!) {
        loginAdminUser(input: $input) {
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
}
