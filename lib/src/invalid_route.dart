import 'package:codewithwest_admin/src/auth/login_admin_user.dart';
import 'package:flutter/material.dart';

class InvalidRoute extends StatelessWidget {
  const InvalidRoute({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('GraphQL with Parameters')),
      body: Container(
        alignment: Alignment.center,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              'Oops! Looks like you took a wrong turn there.',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
              },
              child: const Text('Go Back'),
            ),
            ElevatedButton(
              onPressed: () => Navigator.pushReplacementNamed(
                  context, LoginAdminUser.routeName),
              child: Text('Go Home'),
            ),
          ],
        ),
      ),
    );
  }
}
