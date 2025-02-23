import 'package:codewithwest_admin/src/main/admin/user/admin_users.dart';

import '/src/components/auth_text_field.dart';
import '/src/helper/mutations/mutations.dart';
import '/src/helper/screen_breakpoints.dart';
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
  String _userName = '';
  String _email = '';
  String _password = '';
  late String errorText = '';
  void updateUserName(String newValue) {
    setState(() {
      _userName = newValue;
    });
  }

  void updateEmail(String newValue) {
    setState(() {
      _email = newValue;
    });
  }

  void updatePassword(String newValue) {
    setState(() {
      _password = newValue;
    });
  }

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text('Codewithwest Admin',
            style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
        shadowColor: Color.fromARGB(3, 31, 91, 151),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(
            bottom: Radius.circular(30),
          ),
        ),
        bottom: PreferredSize(
          preferredSize: Size.fromHeight(150),
          child: Container(
            alignment: Alignment.center,
            padding: const EdgeInsets.all(16.0),
            child: Text(
              'Create Admin User',
              style: TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
      ),
      body: Container(
        margin: EdgeInsets.symmetric(
            horizontal: screenWidth > ScreenBreakpoints.large
                ? 300
                : screenWidth > ScreenBreakpoints.medium
                    ? 150
                    : 30),
        alignment: Alignment.center,
        child: Form(
          key: _formKey,
          child: Column(
            spacing: 20,
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Text(
                errorText,
                style: TextStyle(color: Colors.red, fontSize: 20),
              ),
              AuthTextField(
                onTextChanged: updateUserName,
                hintText: "tabloitTinker",
                icon: Icons.person,
                validationText: "Username cannot be empty",
              ),
              AuthTextField(
                onTextChanged: updateEmail,
                hintText: "amdin@mail.com",
                icon: Icons.email,
                validationText: "Email cannot be empty",
              ),
              AuthTextField(
                onTextChanged: updatePassword,
                hintText: "**********",
                icon: Icons.password,
                validationText: "Password cannot be empty",
              ),
              Mutation(
                options: MutationOptions(
                  // The options are here!
                  document: gql(Mutations.createAdminUser),
                  onCompleted: (data) {
                    if (data != null) {
                      Navigator.pushReplacementNamed(
                          context, AdminUsers.routeName);
                    }
                  },
                  onError: (error) {
                    setState(() {
                      errorText = error!.graphqlErrors[0].message;
                    });
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
                                  'username': _userName,
                                  'email': _email,
                                  'password': _password,
                                }
                              });
                            }
                          },
                          child: const Text('Create'),
                        ),
                      ),
                      if (result != null) // Check if result is not null
                        if (result.isLoading) const CircularProgressIndicator()
                      // else if (result.data != null)
                      //   Text('User created Successfully'),
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
