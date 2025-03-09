import '/src/helper/queries/queries.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class Projects extends StatefulWidget {
  const Projects({super.key});
  static const routeName = '/admin/projects/projects';

  @override
  State<Projects> createState() => _ProjectsState();
}

class _ProjectsState extends State<Projects> {
  // String? _filter; // Store the filter value
  late List<dynamic> projects = [];

  resolveProjects(result) {
    return result?.data?["getProjects"] ?? [];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Projects')),
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
              "projects Found: ${projects.length}",
              textAlign: TextAlign.right,
            ),
          ),
          Expanded(
            child: Query(
              options: QueryOptions(
                document: gql(Queries.getProjects),
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
                projects = resolveProjects(result);
                return ListView.builder(
                  itemCount: projects.length,
                  itemBuilder: (context, index) {
                    final project = projects[index] as Map<String, dynamic>;
                    return Container(
                        // padding: const EdgeInsets.symmetric(horizontal: 5),
                        margin: const EdgeInsets.all(2),
                        child: ListTile(
                          onTap: () => Navigator.pushNamed(
                              context, '/admin/projects/projects',
                              arguments: project),
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
                              "${project['id']}",
                              style: const TextStyle(
                                  fontSize: 18, fontWeight: FontWeight.bold),
                            ),
                          ),
                          title: Text(project['name']),
                          subtitle: Text(project['description']),
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
