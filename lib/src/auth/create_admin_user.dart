import 'package:codewithwest_admin/src/auth/login_admin_user.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class CreateAdminUser extends StatefulWidget {
  const CreateAdminUser({super.key});

  static const routeName = '/auth/admin-user-create';

  @override
  State<CreateAdminUser> createState() => _CreateAdminUserState();
}

class _CreateAdminUserState extends State<CreateAdminUser> {
  final _formKey = GlobalKey<FormState>();
  final _usernameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    const String createUserMutation = r'''
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

    return Scaffold(
      appBar: AppBar(title: const Text('Create User')),
      body: Align(
        alignment: Alignment.center,
        // padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                controller: _usernameController,
                decoration: const InputDecoration(
                  labelText: 'Username',
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Username';
                  }
                  return null;
                },
              ),
              TextFormField(
                controller: _emailController,
                decoration: const InputDecoration(
                  labelText: 'Email',
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Email';
                  }
                  return null;
                },
              ),
              TextFormField(
                controller: _passwordController,
                decoration: const InputDecoration(
                  labelText: 'Password',
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Password';
                  }
                  return null;
                },
              ),
              Mutation(
                options: MutationOptions(
                  // The options are here!
                  document: gql(createUserMutation),
                  onCompleted: (data) {
                    // ... (handle successful creation)
                  },
                  onError: (error) {
                    // ... (handle errors)
                  },
                ),
                builder: (
                  RunMutation runMutation,
                  QueryResult? result,
                ) {
                  return Column(
                    // Wrap in a Column to avoid layout issues
                    children: [
                      ElevatedButton(
                        onPressed: () {
                          if (_formKey.currentState!.validate()) {
                            runMutation({
                              "input": {
                                'username': _usernameController.text,
                                'email': _emailController.text,
                                'password': _passwordController.text,
                              }
                            });
                          }
                        },
                        child: const Text('Create'),
                      ),
                      ElevatedButton(
                        onPressed: () => Navigator.pushReplacementNamed(
                            context, LoginAdminUser.routeName),
                        child: const Text('Login'),
                      ),
                      if (result != null) // Check if result is not null
                        if (result.isLoading)
                          const CircularProgressIndicator()
                        else if (result.hasException)
                          Text(result.exception.toString())
                        else if (result.data != null)
                          Text('User created: ${result.data}'),
                    ],
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ... (dispose method)
}
