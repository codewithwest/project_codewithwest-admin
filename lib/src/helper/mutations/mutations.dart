class Mutations {
  static const String createAdminUser = r'''
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

  static const String createProject = r'''
      mutation createProject($input: ProjectInput!) {
        createProject(input: $input) {
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
      }
''';
}
