import '/src/config/graphql_config.dart';

import '/src/helper/colors.dart';

import '/src/helper/queries/queries.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class AdminUserAccessRequests extends StatefulWidget {
  const AdminUserAccessRequests({super.key});

  static const title = 'Admin User Requests';
  static const routeName = '/admin/user/admin-user-access-requests';
  static const icon = Icons.add_moderator_outlined;

  @override
  State<AdminUserAccessRequests> createState() =>
      _AdminUserAccessRequestsState();
}

class _AdminUserAccessRequestsState extends State<AdminUserAccessRequests> {
  // String? _filter; // Store the filter value
  late List<dynamic> adminUserRequests = [];

  resolverAdminUserRequests(result) {
    return result?.data?["getAdminUserAccessRequests"] ?? [];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Admin User Requests',
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
              "adminUserRequests Found: ${adminUserRequests.length}",
              textAlign: TextAlign.right,
            ),
          ),
          Expanded(
            child: FutureBuilder(
              future: GraphQLConfig().getQueryContext(),
              builder: (context, AsyncSnapshot<Context> snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }

                if (snapshot.hasError) {
                  return Center(
                    child: Text(
                      'Error: ${snapshot.error}',
                    ),
                  );
                }

                return Query(
                  options: QueryOptions(
                    document: gql(Queries.getAdminUserAccessRequests),
                    context: snapshot.data,
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
                      return Column(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: result.exception!.graphqlErrors
                            .map((error) => Text(
                                  "${error.message[0].toUpperCase()}${error.message.substring(1).toLowerCase()}",
                                  style: TextStyle(
                                    fontSize: 22,
                                    color: Colors.red,
                                  ),
                                ))
                            .toList(),
                      );
                    }
                    adminUserRequests = resolverAdminUserRequests(result);
                    return ListView.builder(
                      itemCount: adminUserRequests.length,
                      itemBuilder: (context, index) {
                        final adminUserRequest = adminUserRequests[index];
                        return Container(
                            // padding: const EdgeInsets.symmetric(horizontal: 5),
                            margin: const EdgeInsets.all(2),
                            child: ListTile(
                              onTap: () => Navigator.pushNamed(context,
                                  '/admin/user/admin-user-access-request',
                                  arguments: adminUserRequest),
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
                                  adminUserRequest['id'] as String,
                                  style: const TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold),
                                ),
                              ),
                              title: Text(adminUserRequest['email'] as String),
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
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
