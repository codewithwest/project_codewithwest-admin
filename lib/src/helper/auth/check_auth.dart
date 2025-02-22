import 'package:codewithwest_admin/src/auth/login_admin_user.dart';

import '/src/main/admin/admin_dashboard.dart';
import '/src/settings/settings_controller.dart' show SettingsController;
import 'package:flutter/material.dart';

Widget checkAuth(BuildContext context, Widget protectedRoute,
    SettingsController settingsController,
    {bool displayUnauthorized = false} // Optional parameter
    ) {
  if (settingsController.isLoggedIn) {
    return protectedRoute;
  } else {
    return displayUnauthorized ? AdminDashboard() : LoginAdminUser();
  }
}
