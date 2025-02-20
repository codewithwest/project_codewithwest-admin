import 'package:flutter/material.dart';

class AuthTextField extends StatelessWidget {
  final Function(String) onTextChanged;
  final String hintText;
  final IconData icon;
  final String validationText;

  const AuthTextField({
    super.key,
    required this.onTextChanged,
    required this.hintText,
    required this.icon,
    required this.validationText,
  });

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;

    return Container(
      width: screenWidth * 0.8,
      // height: height * 0.07,
      padding: EdgeInsets.all(screenWidth * 0.03),
      decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(6),
          color: const Color.fromARGB(14, 24, 23, 23),
          border: Border.all(color: Colors.grey)),
      child: Center(
        child: Row(
          children: <Widget>[
            Icon(
              icon,
              color: Colors.grey,
            ),
            SizedBox(
              width: screenWidth * 0.04,
            ),
            Expanded(
              child: TextFormField(
                onChanged: (text) {
                  onTextChanged(text);
                },
                decoration: InputDecoration.collapsed(
                  hintText: hintText,
                  hintStyle: TextStyle(
                    color: const Color.fromARGB(255, 105, 104, 104),
                  ),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return validationText;
                  }
                  return null;
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
