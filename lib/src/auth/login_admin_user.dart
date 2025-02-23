import 'package:codewithwest_admin/src/settings/settings_service.dart';
import '/src/auth/request_admin_user_access.dart';
import '/src/components/auth_text_field.dart';
import '/src/helper/queries/queries.dart';
import '/src/helper/screen_breakpoints.dart';
import '/src/settings/settings_controller.dart';
import '/src/main/admin/admin_dashboard.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class LoginAdminUser extends StatefulWidget {
  const LoginAdminUser({
    super.key,
    required this.controller,
  });
  static const routeName = '/auth/admin-user-login';
  final SettingsController controller;

  @override
  State<LoginAdminUser> createState() => _LoginAdminUserState();
}

class _LoginAdminUserState extends State<LoginAdminUser> {
  final SettingsController controller = SettingsController(SettingsService());
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
        title: const Text(
          'Codewithwest Admin',
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.bold,
            color: Color.fromARGB(244, 30, 131, 233),
          ),
        ),
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
              'Login',
              style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: Color.fromARGB(255, 2, 131, 236)),
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
        // padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            spacing: 20,
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              SizedBox(
                width: screenWidth / 1.3,
                child: Text(
                  textAlign: TextAlign.center,
                  errorText,
                  style: TextStyle(color: Colors.red, fontSize: 16),
                ),
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
                  document: gql(Queries.loginAdminUser),
                  onCompleted: (data) {
                    if (data != null && data["loginAdminUser"] != null) {
                      controller.updateIsLoggedIn(data["loginAdminUser"]);
                      Navigator.pushReplacementNamed(
                          context, AdminDashboard.routeName);
                    }
                  },
                  onError: (error) {
                    setState(() {
                      var err = error!.graphqlErrors;
                      errorText = err.isNotEmpty ? err[0].message : "";
                    });
                  },
                ),
                builder: (
                  RunMutation runMutation,
                  QueryResult? result,
                ) {
                  return Column(
                    spacing: 15,
                    // Wrap in a Column to avoid layout issues
                    children: [
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
                          child: const Text('Login'),
                        ),
                      ),
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
                          onPressed: () => Navigator.pushReplacementNamed(
                              context, RequestAdminUserAccess.routeName),
                          child: const Text('Request Access'),
                        ),
                      ),
                      if (result != null) // Check if result is not null
                        if (result.isLoading) const CircularProgressIndicator()
                      // else if (result.data != null)
                      //   Text('Login successful'),
                      // Navigator.restorablePushNamed(context, Profile.routeName),
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
