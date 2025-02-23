import 'package:codewithwest_admin/src/settings/settings_controller.dart';
import 'package:codewithwest_admin/src/settings/settings_service.dart';

import '/src/components/admin_app_bar.dart';
import '/src/components/grid_tabs.dart';
import 'package:flutter/material.dart';

class AdminDashboard extends StatefulWidget {
  const AdminDashboard({super.key});

  static const routeName = '/admin/dashboard';

  @override
  State<AdminDashboard> createState() => _AdminDashboardState();
}

class _AdminDashboardState extends State<AdminDashboard> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AdminAppBar(
        settingsController: SettingsController(SettingsService()),
      ),
      body: Container(
        alignment: Alignment.center,
        child: GridTabs(),
      ),
    );
  }
}
