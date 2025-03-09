import "package:flutter_dotenv/flutter_dotenv.dart";
import "package:graphql_flutter/graphql_flutter.dart";

class GraphQLConfig {
  GraphQLConfig();

  final HttpLink httpLink = HttpLink(
    dotenv.get("API_URL"),
    defaultHeaders: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${dotenv.get("AUTHORIZATION_TOKEN")}',
    },
  );

  // final AuthLink authLink = AuthLink(
  //   getToken: () async => 'Bearer ${dotenv.get("AUTHORIZATION_TOKEN")}',
  // );

  GraphQLClient clientToQuery() {
    final Link link = httpLink;
    return GraphQLClient(cache: GraphQLCache(store: HiveStore()), link: link);
  }
}
