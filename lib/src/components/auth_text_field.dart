import '/src/helper/colors.dart';
import 'package:flutter/material.dart';

class AuthTextField extends StatelessWidget {
  final Function(String) onTextChanged;
  final String hintText;
  final IconData icon;
  final String validationText;
  final bool? validate;
  const AuthTextField({
    super.key,
    required this.onTextChanged,
    required this.hintText,
    required this.icon,
    required this.validationText,
    this.validate,
  });

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;
    double screenHeight = MediaQuery.of(context).size.height;
    return Container(
      margin: EdgeInsets.only(bottom: 3),
      width: screenWidth * 0.8,
      height: screenHeight * 0.07,
      padding: EdgeInsets.all(screenWidth * 0.012),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(6),
        color: const Color.fromARGB(14, 24, 23, 23),
        border: Border.all(
          color: AppColors.primaryTextColor,
        ),
      ),
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
                    color: Colors.grey,
                  ),
                ),
                validator: (value) {
                  if (validate == false) {
                    return null;
                  }
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
