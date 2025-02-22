import 'dart:math';

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
  String? _filter; // Store the filter value
  late List<dynamic> users = [];

  updateUsersData(result) {
    // setState(() {
    users = result.data?["getProjects"] ?? [];
    // });
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
                  _filter = value; // Update the filter value
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
              "Users Found: ${users.length}" ?? "No users found",
              textAlign: TextAlign.right,
            ),
          ),
          Expanded(
            child: Query(
              options: QueryOptions(
                document: gql(Queries.getAdminUser),
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
                updateUsersData(result);
                return ListView.builder(
                  itemCount: users.length,
                  itemBuilder: (context, index) {
                    final user = users[index] as Map<String, dynamic>;
                    return Container(
                        // padding: const EdgeInsets.symmetric(horizontal: 5),
                        margin: const EdgeInsets.all(2),
                        child: ListTile(
                          onTap: () => Navigator.pushNamed(
                              context, '/admin/user/admin-user',
                              arguments: user),
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
                              user['id'] as String,
                              style: const TextStyle(
                                  fontSize: 18, fontWeight: FontWeight.bold),
                            ),
                          ),
                          title: Text(user['email'] as String),
                          subtitle: Text(user['username']),
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
