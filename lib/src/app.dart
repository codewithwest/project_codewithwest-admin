import 'package:codewithwest_admin/src/main/admin/projects/create_project_category.dart';
import 'package:codewithwest_admin/src/main/admin/user/admin_user_access_requests.dart';

import '/src/main/admin/projects/project_categories.dart';
import '/src/main/admin/projects/projects.dart' show Projects;
import '/src/main/admin/user/create_admin_user.dart';

import '/src/config/graphql_config.dart';
import '/src/main/admin/user/admin_users.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import '/src/auth/request_admin_user_access.dart';
import '/src/helper/auth/check_auth.dart';
import '/src/invalid_route.dart';

import '/src/landing_page.dart';

import '/src/main/admin/admin_dashboard.dart';
import '/src/auth/login_admin_user.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

import 'main/admin/user/profile.dart';
import 'sample_feature/sample_item_details_view.dart';
import 'settings/settings_controller.dart';
import 'settings/settings_view.dart';

/// The Widget that configures your application.
class MyApp extends StatelessWidget {
  const MyApp({
    super.key,
    required this.settingsController,
  });

  final SettingsController settingsController;

  @override
  Widget build(BuildContext context) {
    final AuthLink authLink = AuthLink(
      getToken: () async => 'Bearer whatebverthetokenis',
    );

    final Link link = authLink.concat(GraphQLConfig().httpLink);

    ValueNotifier<GraphQLClient> client = ValueNotifier(
      GraphQLClient(
        link: link,
        // The default store is the InMemoryStore, which does NOT persist to disk
        cache: GraphQLCache(store: HiveStore()),
      ),
    );
    // Glue the SettingsController to the MaterialApp.
    //
    // The ListenableBuilder Widget listens to the SettingsController for changes.
    // Whenever the user updates their settings, the MaterialApp is rebuilt.
    return ListenableBuilder(
      listenable: settingsController,
      builder: (BuildContext context, Widget? child) {
        return GraphQLProvider(
          client: client,
          child: MaterialApp(
            debugShowCheckedModeBanner: false,
            // Providing a restorationScopeId allows the Navigator built by the
            // MaterialApp to restore the navigation stack when a user leaves and
            // returns to the app after it has been killed while running in the
            // background.
            restorationScopeId: 'app',

            // Provide the generated AppLocalizations to the MaterialApp. This
            // allows descendant Widgets to display the correct translations
            // depending on the user's locale.
            localizationsDelegates: const [
              AppLocalizations.delegate,
              GlobalMaterialLocalizations.delegate,
              GlobalWidgetsLocalizations.delegate,
              GlobalCupertinoLocalizations.delegate,
            ],
            supportedLocales: const [
              Locale('en', ''), // English, no country code
            ],

            // Use AppLocalizations to configure the correct application title
            // depending on the user's locale.
            //
            // The appTitle is defined in .arb files found in the localization
            // directory.
            onGenerateTitle: (BuildContext context) =>
                AppLocalizations.of(context)!.appTitle,

            // Define a light and dark color theme. Then, read the user's
            // preferred ThemeMode (light, dark, or system default) from the
            // SettingsController to display the correct theme.
            theme: ThemeData(),
            darkTheme: ThemeData.dark(),
            themeMode: settingsController.themeMode,

            // Define a function to handle named routes in order to support
            // Flutter web url navigation and deep linking.
            onGenerateRoute: (RouteSettings routeSettings) {
              return MaterialPageRoute<void>(
                settings: routeSettings,
                builder: (BuildContext context) {
                  switch (routeSettings.name) {
                    case LandingPage.routeName:
                      return LandingPage();
                    case RequestAdminUserAccess.routeName:
                      return RequestAdminUserAccess();

                    case LoginAdminUser.routeName:
                      return checkAuth(
                          context, AdminDashboard(), settingsController);
                    case AdminDashboard.routeName:
                      return checkAuth(
                          context, AdminDashboard(), settingsController);
                    case SettingsView.routeName:
                      return checkAuth(
                          context,
                          SettingsView(controller: settingsController),
                          settingsController);
                    case SampleItemDetailsView.routeName:
                      return checkAuth(
                          context, SampleItemDetailsView(), settingsController);
                    case Profile.routeName:
                      return checkAuth(context, Profile(), settingsController);
                    case CreateAdminUser.routeName:
                      return checkAuth(
                          context, CreateAdminUser(), settingsController);
                    case AdminUsers.routeName:
                      return checkAuth(
                          context, AdminUsers(), settingsController);
                    case ProjectCategories.routeName:
                      return checkAuth(
                          context, ProjectCategories(), settingsController);
                    case Projects.routeName:
                      return checkAuth(context, Projects(), settingsController);
                    case AdminUserAccessRequests.routeName:
                      return checkAuth(context, AdminUserAccessRequests(),
                          settingsController);
                    case CreateProjectCategory.routeName:
                      return checkAuth(
                          context, CreateProjectCategory(), settingsController);
                    default:
                      return const InvalidRoute();
                  }
                },
              );
            },
          ),
        );
      },
    );
  }
}
