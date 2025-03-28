import '/src/helper/colors.dart';

import '/src/helper/queries/queries.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class ProjectCategories extends StatefulWidget {
  const ProjectCategories({super.key});

  static const title = 'Project Categories';
  static const routeName = '/admin/projects/project-categories';
  static const icon = Icons.list_sharp;

  @override
  State<ProjectCategories> createState() => _ProjectCategoriesState();
}

class _ProjectCategoriesState extends State<ProjectCategories> {
  // String? _filter; // Store the filter value
  late List<dynamic> projectCategories = [];

  resolveProjectCategories(result) {
    return result?.data?["getProjectCategories"] ?? [];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Project Categories',
          style: TextStyle(color: AppColors.primaryBackgroundColor),
        ),
        centerTitle: true,
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: TextField(
              decoration: const InputDecoration(hintText: 'Filter by name'),
              onChanged: (value) {
                setState(() {
                  // _filter = value; // Update the filter value
                });
              },
            ),
          ),
          Container(
            alignment: Alignment.centerRight,
            margin: const EdgeInsets.only(
              right: 30,
            ),
            padding: EdgeInsets.all(10),
            child: Text(
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
              "Project Categories Found: ${projectCategories.length}",
              textAlign: TextAlign.right,
            ),
          ),
          Expanded(
            child: Query(
              options: QueryOptions(
                document: gql(Queries.getProjectCategories),
                variables: {
                  'limit': 10, // Pass the filter variable to the query
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
                projectCategories = resolveProjectCategories(result);

                return ListView.builder(
                  itemCount: projectCategories.length,
                  itemBuilder: (context, index) {
                    final projectCategory = projectCategories[index];
                    return Container(
                        // padding: const EdgeInsets.symmetric(horizontal: 5),
                        margin: const EdgeInsets.all(2),
                        child: ListTile(
                          onTap: () => Navigator.pushNamed(
                              context, "/admin/projects/project-categories",
                              arguments: projectCategory),
                          textColor: Colors.lightBlue,
                          iconColor: Colors.lightBlue,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                          visualDensity: VisualDensity.comfortable,
                          tileColor: const Color.fromARGB(255, 32, 32, 32),
                          contentPadding: const EdgeInsets.all(2),
                          enabled: true,
                          leading: Container(
                            padding: const EdgeInsets.all(10),
                            child: Text(
                              "${projectCategory['id']}",
                              style: const TextStyle(
                                  fontSize: 18, fontWeight: FontWeight.bold),
                            ),
                          ),
                          title: Text(projectCategory['name'] as String),
                          // subtitle: Text(user['username']),
                          trailing: IconButton(
                            onPressed: () =>
                                Navigator.popAndPushNamed(context, "/"),
                            icon: const Icon(Icons.edit),
                          ),
                          style: ListTileStyle.drawer,
                        ));
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
