import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'src/app.dart';
import 'src/settings/settings_controller.dart';
import 'src/settings/settings_service.dart';

void main() async {
  // Set up the SettingsController, which will glue user settings to multiple
  // Flutter Widgets.
  WidgetsFlutterBinding.ensureInitialized();
  await initHiveForFlutter();
  final settingsController = SettingsController(SettingsService());

  // Load the user's preferred theme while the splash screen is displayed.
  // This prevents a sudden theme change when the app is first displayed.
  await settingsController.loadSettings();

  // Run the app and pass in the SettingsController. The app listens to the
  // SettingsController for changes, then passes it further down to the
  // SettingsView.
  final HttpLink link = HttpLink(
      'http://localhost:3071/graphql'); // Replace with your GraphQL server URL

  final ValueNotifier<GraphQLClient> client = ValueNotifier(
    GraphQLClient(
      link: link,
      cache: GraphQLCache(), // Optional: Use a cache for better performance
    ),
  );

  runApp(
    MyApp(
      settingsController: settingsController,
    ),
  );
}
