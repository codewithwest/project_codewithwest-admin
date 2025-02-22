class Mutations {
  static const String createAdminUserMutation = r'''
      mutation createAdminUser($input: AdminUserInput!) {
        createAdminUser(input: $input) {
          id
          username
          email
          password
          role
          type
          created_at
          updated_at
          last_login
      }
    }
    ''';

  static const String createProjectCategory = r'''
      mutation createProjectCategory($name: String!) {
        createProjectCategory(name: $name) {
          id
          name
          created_at
          updated_at
        }
      }
    ''';
}
