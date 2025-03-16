import 'package:codewithwest_admin/src/config/graphql_config.dart';
import 'package:codewithwest_admin/src/settings/settings_service.dart';

import '/src/helper/queries/queries.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class Profile extends StatefulWidget {
  const Profile({super.key});

  static const routeName = '/admin/user/profile';

  @override
  State<Profile> createState() => _ProfileState();
}

class _ProfileState extends State<Profile> {
  // String? _filter; // Store the filter value

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('GraphQL with Parameters')),
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
          Expanded(
            child: FutureBuilder<Context>(
              future: GraphQLConfig().getQueryContext(),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }

                if (snapshot.hasError) {
                  return Text(snapshot.error.toString());
                }

                return Query(
                  options: QueryOptions(
                    document: gql(Queries.getAdminUser),
                    context: snapshot.data,
                    variables: {
                      'id': 1, // Pass the filter variable to the query
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

                    final users = result.data as List<dynamic>;

                    return ListView.builder(
                      itemCount: users.length,
                      itemBuilder: (context, index) {
                        final user = users[index] as Map<String, dynamic>;
                        return ListTile(
                          title: Text(user['id'] as String),
                          subtitle: Text(user['password'] as String),
                        );
                      },
                    );
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
