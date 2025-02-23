import 'package:codewithwest_admin/src/settings/settings_controller.dart';

import '/src/main/admin/user/profile.dart';
import '/src/settings/settings_view.dart';
import 'package:flutter/material.dart';

class AdminAppBar extends StatelessWidget implements PreferredSizeWidget {
  const AdminAppBar({super.key, required this.settingsController});
  final SettingsController settingsController;

  @override
  Size get preferredSize => Size.fromHeight(kToolbarHeight);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      leading: Icon(Icons.emoji_nature_outlined),
      elevation: 10,
      bottomOpacity: .7,
      title: Text('My App'),
      actions: <Widget>[
        PopupMenuButton<String>(
          position: PopupMenuPosition.under,
          icon: Icon(Icons.menu),
          onSelected: (String result) {
            switch (result) {
              case 'settings':
                Navigator.pushNamed(context, SettingsView.routeName);
                break;
              case 'profile':
                Navigator.pushNamed(context, Profile.routeName);
              case 'logout':
                settingsController.logoutAdminUser();
                Navigator.pushReplacementNamed(context, "/");
                // Add logout logic here
                break;
              default:
            }
          },
          itemBuilder: (BuildContext context) => <PopupMenuEntry<String>>[
            const PopupMenuItem<String>(
              value: 'settings',
              child: Row(
                children: [
                  Icon(Icons.settings),
                  SizedBox(width: 10),
                  Text('Settings'),
                ],
              ),
            ),
            const PopupMenuItem<String>(
              value: 'profile',
              child: Row(
                children: [
                  Icon(
                    Icons.person,
                  ),
                  SizedBox(width: 10),
                  Text('Profile'),
                ],
              ),
            ),
            const PopupMenuItem<String>(
              value: 'logout',
              child: Row(
                children: [
                  Icon(
                    Icons.logout,
                  ),
                  SizedBox(width: 10),
                  Text('Logout'),
                ],
              ),
            ),
            // Add more options as needed
          ],
        ),
      ],
    );
  }
}
