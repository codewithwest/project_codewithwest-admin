import '/src/helper/colors.dart';
import '/src/helper/dashboard/tab_items.dart';
import 'package:flutter/material.dart';
import '/src/components/admin_app_bar.dart'; // Assuming this is your custom app bar
import '/src/settings/settings_controller.dart'; // Assuming these are your settings
import '/src/settings/settings_service.dart';

class AdminDashboard extends StatefulWidget {
  const AdminDashboard({super.key});

  static const routeName = '/admin';

  @override
  State<AdminDashboard> createState() => _AdminDashboardState();
}

class _AdminDashboardState extends State<AdminDashboard> {
  int _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AdminAppBar(
        settingsController: SettingsController(SettingsService()),
      ), // Use your custom app bar here
      body: Row(
        children: [
          _buildSideMenu(),
          _buildContent(),
        ],
      ),
    );
  }

  Widget _buildSideMenu() {
    return Expanded(
      child: Container(
        decoration: BoxDecoration(
          border: Border(
            right: BorderSide(
              width: 1,
              color: AppColors.primaryBackgroundColor,
            ),
          ),
        ),
        child: ListView.builder(
          itemCount: tabs.length,
          itemBuilder: (BuildContext context, int index) {
            return Container(
              decoration: BoxDecoration(
                border: Border(
                  bottom: BorderSide(
                      width: 1,
                      color: _selectedIndex == index
                          ? AppColors.primaryBackgroundColor
                          : Colors.transparent),
                ),
              ),
              child: ListTile(
                visualDensity: VisualDensity(
                  horizontal: 1,
                ),
                style: ListTileStyle.drawer,
                selectedColor: Colors.amber,
                leading: Icon(
                  tabs[index].icon,
                  color: _selectedIndex == index
                      ? AppColors.primaryBackgroundColor
                      : AppColors.primaryBackgroundColor,
                ),
                title: Text(
                  tabs[index].title,
                  style: TextStyle(
                    color: _selectedIndex == index
                        ? AppColors.primaryBackgroundColor
                        : Colors.grey,
                  ),
                ),
                selected: _selectedIndex == index,
                onTap: () {
                  setState(() {
                    _selectedIndex = index;
                  });
                },
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildContent() {
    return Expanded(
      flex: 3,
      child: Center(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Expanded(
              child: tabs[_selectedIndex].widget,
            ),
            // You can also directly display the content of the selected tab here if needed.
            // Example:
            // if (tabs[_selectedIndex].widget != null) {
            //   tabs[_selectedIndex].widget,
            // }
          ],
        ),
      ),
    );
  }
}
