import "/src/settings/settings_service.dart";
import "package:flutter_dotenv/flutter_dotenv.dart";
import "package:graphql_flutter/graphql_flutter.dart";

class GraphQLConfig {
  GraphQLConfig();

  Future<Context> getQueryContext() async {
    String? authorization = await SettingsService().loadData('token');
    String? userId = await SettingsService().loadData('id');

    return Context().withEntry(
      HttpLinkHeaders(
        headers: {
          'Authentication': 'Bearer $authorization',
          'user_id': userId ?? '',
        },
      ),
    );
  }

  final HttpLink httpLink = HttpLink(
    dotenv.get("API_URL"),
    defaultHeaders: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${dotenv.get("AUTHORIZATION_TOKEN")}',
    },
  );

  GraphQLClient clientToQuery() {
    final Link link = httpLink;
    return GraphQLClient(cache: GraphQLCache(store: HiveStore()), link: link);
  }
}
