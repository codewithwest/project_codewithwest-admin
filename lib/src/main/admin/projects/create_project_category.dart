import '/src/helper/colors.dart';

import '/src/helper/mutations/mutations.dart';

import '/src/components/auth_text_field.dart';
import '/src/helper/screen_breakpoints.dart';
import '/src/main/admin/projects/project_categories.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class CreateProjectCategory extends StatefulWidget {
  const CreateProjectCategory({super.key});

  static const title = 'Create Project Category';
  static const routeName = '/admin/project/create-project-category';
  static const icon = Icons.plus_one;

  @override
  State<CreateProjectCategory> createState() => _CreateProjectCategoryState();
}

class _CreateProjectCategoryState extends State<CreateProjectCategory> {
  final _formKey = GlobalKey<FormState>();

  String _name = '';

  late String errorMessage = '';

  void _updateName(String newValue) {
    setState(() {
      _name = newValue;
    });
  }

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Create Project Category',
          style: TextStyle(
            color: AppColors.primaryBackgroundColor,
          ),
        ),
        centerTitle: true,
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
              Text(
                errorMessage,
                style: TextStyle(
                    color: Colors.red,
                    fontSize: screenWidth > ScreenBreakpoints.medium ? 20 : 16),
              ),
              AuthTextField(
                onTextChanged: _updateName,
                hintText: "Project category name",
                icon: Icons.category,
                validationText: "Category name cannot be empty",
              ),
              Mutation(
                options: MutationOptions(
                  // The options are here!
                  document: gql(Mutations.createProjectCategory),
                  onCompleted: (data) {
                    if (data != null) {
                      Navigator.pushReplacementNamed(
                          context, ProjectCategories.routeName);
                    }
                  },
                  onError: (error) {
                    setState(() {
                      errorMessage = "${error?.graphqlErrors[0].message}";
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
                                'name': _name,
                              });
                            }
                          },
                          child: const Text('Create'),
                        ),
                      ),
                      if (result != null) // Check if result is not null
                        if (result.isLoading)
                          const CircularProgressIndicator()
                        else if (result.data != null)
                          Text('Project Creation successful'),
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
