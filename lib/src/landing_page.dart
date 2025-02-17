import '/src/auth/create_admin_user.dart';
import '/src/auth/login_admin_user.dart';
import 'package:flutter/material.dart';

class LandingPage extends StatefulWidget {
  const LandingPage({super.key});

  static const routeName = '/';

  @override
  State<LandingPage> createState() => _LandingPageState();
}

class _LandingPageState extends State<LandingPage> {
  final _formKey = GlobalKey<FormState>();
  final _usernameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Create User')),
      body: Align(
        alignment: Alignment.center,
        // padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            ElevatedButton(
              onPressed: () => Navigator.pushReplacementNamed(
                  context, CreateAdminUser.routeName),
              child: const Text('Register'),
            ),
            ElevatedButton(
              onPressed: () => Navigator.pushReplacementNamed(
                  context, LoginAdminUser.routeName),
              child: const Text('Login'),
            ),
          ],
        ),
      ),
    );
  }

  // ... (dispose method)
}
