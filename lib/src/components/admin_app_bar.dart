import '/src/main/admin/user/profile.dart';
import '/src/settings/settings_view.dart';
import 'package:flutter/material.dart';

class AdminAppBar extends StatelessWidget implements PreferredSizeWidget {
  const AdminAppBar({super.key});

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
            // Add more options as needed
          ],
        ),
      ],
    );
  }
}
