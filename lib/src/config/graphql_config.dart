import "package:flutter/foundation.dart";
import "package:graphql_flutter/graphql_flutter.dart";

class GraphQLConfig {
  GraphQLConfig();

  final HttpLink httpLink = HttpLink(
    kDebugMode
        ? 'http://localhost:3071/graphql'
        //? "https://projectgingeronestopserver-git-dev-codewithwests-projects.vercel.app/graphql"
        : 'https://projectgingeronestopserver.vercel.app/graphql',
    defaultHeaders: {
      'Content-Type': 'application/json',
      // 'Access-Control-Allow-Origin': '*',
      // 'Accept-Charset': 'utf-8',
      // 'authKey': 'YOUR_AUTH_KEY',
      // 'apiAuthType': 'API_AUTH_TYPE',
      // 'token': 'DEVICE_TOKEN',
    },
  );

  // final AuthLink authLink = AuthLink(
  // 'Content-Type': 'application/json'
  //   // OR
  //   // getToken: () => 'Bearer <YOUR_PERSONAL_ACCESS_TOKEN>',
  // );
//
  // final Link link = authLink.concat(httpLink);

  // ValueNotifier<GraphQLClient> client = ValueNotifier(
  //   GraphQLClient(
  //     link: link,
  //     // The default store is the InMemoryStore, which does NOT persist to disk
  //     cache: GraphQLCache(store: HiveStore()),
  //   ),
  GraphQLClient clientToQuery() {
    return GraphQLClient(
      cache: GraphQLCache(store: HiveStore()),
      link: httpLink,
    );
  }
}
