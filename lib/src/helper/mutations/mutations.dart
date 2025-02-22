class Mutations {
  static const String createUserMutation = r'''
      mutation createAdminUser($input: AdminUserInput!) {
        createAdminUser(input: $input) {
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
