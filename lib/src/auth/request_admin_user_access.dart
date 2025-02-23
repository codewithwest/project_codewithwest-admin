import 'package:codewithwest_admin/src/auth/login_admin_user.dart';
import 'package:codewithwest_admin/src/components/auth_text_field.dart';
import 'package:codewithwest_admin/src/helper/mutations/mutations.dart';
import 'package:codewithwest_admin/src/helper/screen_breakpoints.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class RequestAdminUserAccess extends StatefulWidget {
  const RequestAdminUserAccess({super.key});

  static const routeName = '/auth/request-admin-user-access';

  @override
  State<RequestAdminUserAccess> createState() => _RequestAdminUserAccessState();
}

class _RequestAdminUserAccessState extends State<RequestAdminUserAccess> {
  final _formKey = GlobalKey<FormState>();
  String _email = '';
  late String errorText = '';

  void updateEmail(String newValue) {
    setState(() {
      _email = newValue;
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
              'Request Access',
              style: TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.bold,
                color: Colors.redAccent,
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
                onTextChanged: updateEmail,
                hintText: "amdin@mail.com",
                icon: Icons.email,
                validationText: "Email cannot be empty",
              ),
              Text(
                "Please be advised! By submitting this form, you are requesting access to the admin panel. \n You will be notified via email once your request has been approved. \n Note! This is a private application and only authorized personnel are allowed to access the admin panel. \n Unauthorized access will be reported to the authorities.",
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  textBaseline: TextBaseline.alphabetic,
                  color: Colors.redAccent,
                ),
              ),
              Mutation(
                options: MutationOptions(
                  document: gql(Mutations.createAdminUserAccessRequest),
                  onCompleted: (data) {
                    Navigator.pushReplacementNamed(
                        context, LoginAdminUser.routeName);
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
                    children: [
                      Container(
                        width: 200,
                        height: 75,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(30),
                          gradient: const LinearGradient(
                            colors: [
                              Color.fromARGB(255, 0, 178, 209),
                              Color.fromARGB(255, 125, 10, 255),
                            ],
                          ),
                        ),
                        child: ElevatedButton(
                          onPressed: () {
                            print(_formKey.currentState);
                            if (_formKey.currentState!.validate()) {
                              runMutation({
                                'email': _email,
                              });
                            }
                          },
                          child: const Text('Request Access'),
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
                        if (result.isLoading) const CircularProgressIndicator()
                      // else if (result.hasException)
                      //   Text(result.exception.toString())
                      // else if (result.data != null)
                      //   Text('User created: ${result.data}'),
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
