import '/src/helper/queries/queries.dart';
import '/src/helper/text_field_state_handler.dart';
import '/src/main/admin/projects/create_project_category.dart';
import '/src/main/admin/projects/projects.dart';

import '/src/components/auth_text_field.dart';
import '/src/helper/mutations/mutations.dart';
import '/src/helper/screen_breakpoints.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class CreateProject extends StatefulWidget {
  const CreateProject({super.key});

  static const routeName = '/admin/project/create-project';

  @override
  State<CreateProject> createState() => _CreateProjectState();
}

class _CreateProjectState extends State<CreateProject> {
  final _formKey = GlobalKey<FormState>();
  String _name = '';
  int? _projectCategoryId;
  String _description = '';
  String _techStacksTextField = '';
  List<String> _techStacks = [];
  String _githubLink = '';
  String _testLink = '';
  String _liveLink = '';
  late var projectCategories = [];

  resolveProjectCategories(result) {
    return result?.data?["getProjectCategories"] ?? {};
  }

  Helper helper = Helper();
  late String errorText = '';
  updateProjectCategoryId(int? newValue) {
    setState(() {
      _projectCategoryId = newValue;
    });
  }

  updateName(String newValue) {
    setState(() {
      _name = newValue;
    });
  }

  updateDescription(String newValue) {
    setState(() {
      _description = newValue;
    });
  }

  void addTechStack() {
    setState(() {
      String trimmedText = _techStacksTextField.trim();

      if (trimmedText.isNotEmpty && !_techStacks.contains(trimmedText)) {
        _techStacks.add(trimmedText);
      }

      // Clear the text field.
      _techStacksTextField = '';
    });
  }

  void removeTechStack(int index) {
    setState(() {
      _techStacks.removeAt(index);
    });
  }

  updateTechStackValue(String newValue) {
    setState(() {
      _techStacksTextField = newValue;
    });
  }

  updateGithubLink(String newValue) {
    setState(() {
      _githubLink = newValue;
    });
  }

  updateTestLink(String newValue) {
    setState(() {
      _testLink = newValue;
    });
  }

  updateLiveLink(String newValue) {
    setState(() {
      _liveLink = newValue;
    });
  }

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;
    double screenHeight = MediaQuery.of(context).size.height;
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
              'Create Project',
              style: TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
      ),
      body: Container(
        height: screenHeight,
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
            spacing: 10,
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Text(
                errorText,
                style: TextStyle(color: Colors.red, fontSize: 20),
              ),
              Container(
                width: screenWidth * 0.8,
                height: screenHeight * 0.08,
                padding: EdgeInsets.all(screenWidth * 0.012),
                margin: EdgeInsets.all(2),
                child: Row(spacing: 20, children: [
                  Text(
                    "Select Project category: ",
                    style: TextStyle(
                      fontSize: 16,
                    ),
                  ),
                  Query(
                    options: QueryOptions(
                      document: gql(Queries.getProjectCategories),
                      variables: {
                        'limit': 10,
                      },
                    ),
                    builder: (QueryResult result,
                        {VoidCallback? refetch, FetchMore? fetchMore}) {
                      if (result.isLoading) {
                        return const Center(child: CircularProgressIndicator());
                      }

                      if (result.hasException) {
                        return Text(result.exception.toString());
                      }

                      // Update projectCategories using setState
                      List<dynamic> fetchedCategories =
                          resolveProjectCategories(result);
                      WidgetsBinding.instance.addPostFrameCallback((_) {
                        setState(() {
                          projectCategories = fetchedCategories;
                        });
                      });
                      //add a default value if needed.
                      if (_projectCategoryId == null &&
                          fetchedCategories.isNotEmpty) {
                        _projectCategoryId = fetchedCategories[0]['id'];
                      }

                      return DropdownButton<dynamic>(
                        borderRadius: BorderRadius.circular(22.0),
                        padding: EdgeInsets.all(15),
                        value: _projectCategoryId,
                        isDense: true,
                        icon: Icon(Icons.category),
                        menuWidth: 200,
                        items: fetchedCategories
                            .map<DropdownMenuItem<dynamic>>((dynamic value) {
                          return DropdownMenuItem<dynamic>(
                            value: value['id'],
                            child: Text(value['name']),
                          );
                        }).toList(),
                        onChanged: (value) => updateProjectCategoryId(value),
                      );
                    },
                  ),
                ]),
              ),
              projectCategories.isNotEmpty
                  ? Column(
                      children: [
                        AuthTextField(
                          onTextChanged: updateName,
                          hintText: "knight trainer",
                          icon: Icons.text_fields,
                          validationText: "Project name cannot be empty",
                        ),
                        AuthTextField(
                          onTextChanged: updateDescription,
                          hintText: "This is the purpose of the project",
                          icon: Icons.description,
                          validationText: "Project description cannot be empty",
                        ),
                        Container(
                          width: screenWidth * 0.8,
                          height: screenHeight * 0.07,
                          padding: EdgeInsets.all(screenWidth * 0.012),
                          margin: EdgeInsets.all(2),
                          child: ListView.builder(
                            scrollDirection: Axis.horizontal,
                            itemCount: _techStacks.length,
                            itemBuilder: (context, index) {
                              return ElevatedButton(
                                style: ButtonStyle(),
                                onPressed: () => removeTechStack(index),
                                child: Row(
                                  children: [
                                    Icon(Icons.cancel),
                                    SizedBox(
                                      width: 3,
                                    ),
                                    Text(_techStacks[index])
                                  ],
                                ),
                              );
                            },
                          ),
                        ),
                        Container(
                          width: screenWidth * 0.8,
                          height: screenHeight * 0.07,
                          padding: EdgeInsets.all(screenWidth * 0.012),
                          decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(6),
                              color: const Color.fromARGB(14, 24, 23, 23),
                              border: Border.all(color: Colors.grey)),
                          child: Center(
                            child: Row(
                              children: <Widget>[
                                Icon(
                                  Icons.stacked_bar_chart,
                                  color: Colors.grey,
                                ),
                                SizedBox(
                                  width: screenWidth * 0.04,
                                ),
                                Expanded(
                                  child: TextFormField(
                                    onChanged: updateTechStackValue,
                                    decoration: InputDecoration.collapsed(
                                      hintText: "Next, React, Node",
                                      hintStyle: TextStyle(
                                        color: const Color.fromARGB(
                                            255, 105, 104, 104),
                                      ),
                                    ),
                                  ),
                                ),
                                SizedBox(
                                  width: screenWidth * 0.04,
                                ),
                                IconButton(
                                    onPressed: addTechStack,
                                    icon: Icon(Icons.add))
                              ],
                            ),
                          ),
                        ),
                        AuthTextField(
                          onTextChanged: updateGithubLink,
                          hintText: "https://github.com/",
                          icon: Icons.insert_link_outlined,
                          validationText: "Project github link cannot be empty",
                        ),
                        AuthTextField(
                          onTextChanged: updateTestLink,
                          hintText: "https://project-testlink.test/",
                          icon: Icons.insert_link_outlined,
                          validationText: "Project test link cannot be empty",
                          validate: false,
                        ),
                        AuthTextField(
                          onTextChanged: updateLiveLink,
                          hintText: "https://project-live.com/",
                          icon: Icons.insert_link_outlined,
                          validationText: "Project live link cannot be empty",
                          validate: false,
                        ),
                        Mutation(
                          options: MutationOptions(
                            // The options are here!
                            document: gql(Mutations.createProject),
                            onCompleted: (data) {
                              if (data != null) {
                                Navigator.pushReplacementNamed(
                                    context, Projects.routeName);
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
                              spacing: 10,
                              // Wrap in a Column to avoid layout issues
                              children: [
                                Container(
                                  // width: 200,
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
                                            'project_category_id':
                                                _projectCategoryId,
                                            'name': _name,
                                            'description': _description,
                                            'tech_stacks': _techStacks,
                                            'github_link': _githubLink,
                                            'test_link': _testLink,
                                            'live_link': _liveLink,
                                          }
                                        });
                                      }
                                    },
                                    child: const Text('Create'),
                                  ),
                                ),
                                if (result !=
                                    null) // Check if result is not null
                                  if (result.isLoading)
                                    const CircularProgressIndicator()
                                  else if (result.data != null)
                                    Text('User created Successfully'),
                              ],
                            );
                          },
                        ),
                      ],
                    )
                  : Column(
                      children: [
                        const Text('Project Categories not found'),
                        SizedBox(
                          height: 20,
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
                                context, CreateProjectCategory.routeName),
                            child: const Text(
                              textAlign: TextAlign.center,
                              'Create Project Category',
                              style: TextStyle(
                                color: Color.fromARGB(255, 255, 255, 255),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
            ],
          ),
        ),
      ),
    );
  }

  // ... (dispose method)
}
