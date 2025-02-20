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
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text('Codewithwest Admin',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
      ),
      body: Center(
        child: Column(
          spacing: 20,
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 200,
              height: 75,
              decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(30),
                  gradient: const LinearGradient(colors: [
                    Color.fromARGB(255, 85, 1, 124),
                    Color.fromARGB(255, 0, 178, 209),
                  ])),
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.transparent),
                onPressed: () => Navigator.pushReplacementNamed(
                    context, CreateAdminUser.routeName),
                child: const Text(
                  'Register',
                  style: TextStyle(color: Colors.white),
                ),
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
                style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.transparent),
                onPressed: () => Navigator.pushReplacementNamed(
                    context, LoginAdminUser.routeName),
                child: const Text(
                  'Login',
                  style: TextStyle(color: Colors.white),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ... (dispose method)
}
