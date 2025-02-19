import 'package:codewithwest_admin/src/auth/login_admin_user.dart';
import 'package:codewithwest_admin/src/helper/screen_breakpoints.dart';
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
    double screenWidth = MediaQuery.of(context).size.width;
    return Scaffold(
      appBar: AppBar(title: const Text('Create User')),
      body: Container(
        margin: EdgeInsets.symmetric(
            horizontal: screenWidth > ScreenBreakpoints.large
                ? 300
                : screenWidth > ScreenBreakpoints.medium
                    ? 150
                    : 30),
        alignment: Alignment.center,
        // padding: const EdgeInsets.all(16.0),
        key: _formKey,
        child: Column(
          spacing: 20,
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
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
            SizedBox(height: 30),
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
                  spacing: 20,

                  // Wrap in a Column to avoid layout issues
                  children: [
                    Container(
                      width: 200,
                      height: 75,
                      decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(30),
                          gradient: const LinearGradient(colors: [
                            Color.fromARGB(255, 0, 178, 209),
                            Color.fromARGB(255, 125, 10, 255),
                          ])),
                      child: ElevatedButton(
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
                    ),
                    Container(
                      width: 200,
                      height: 75,
                      decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(30),
                          gradient: const LinearGradient(colors: [
                            Color.fromARGB(255, 125, 10, 255),
                            Color.fromARGB(255, 0, 178, 209),
                          ])),
                      child: ElevatedButton(
                        onPressed: () => Navigator.pushReplacementNamed(
                            context, LoginAdminUser.routeName),
                        child: const Text('Login'),
                      ),
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
    );
  }

  // ... (dispose method)
}
