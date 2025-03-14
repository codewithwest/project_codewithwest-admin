import '/src/main/admin/projects/create_project.dart';
import '/src/main/admin/projects/create_project_category.dart';
import '/src/main/admin/projects/project_categories.dart';
import '/src/main/admin/projects/projects.dart';
import '/src/main/admin/user/admin_user_access_requests.dart';
import '/src/main/admin/user/admin_users.dart';
import '/src/main/admin/user/create_admin_user.dart';

import '/src/main/admin/dashboard.dart';
import 'package:flutter/material.dart';

class TabItem {
  final String title;
  final String routeName;
  final IconData icon;
  final Widget widget; //Optional widget to display directly

  TabItem(
      {required this.title,
      required this.routeName,
      required this.icon,
      required this.widget});
}

final List<TabItem> tabs = [
  TabItem(
    title: Dashboard.title,
    routeName: Dashboard.routeName,
    icon: Dashboard.icon,
    widget: Dashboard(),
  ),
  TabItem(
    title: AdminUsers.title,
    routeName: AdminUsers.routeName,
    icon: AdminUsers.icon,
    widget: AdminUsers(),
  ),
  TabItem(
    title: CreateAdminUser.title,
    routeName: CreateAdminUser.routeName,
    icon: CreateAdminUser.icon,
    widget: CreateAdminUser(),
  ),
  TabItem(
    title: Projects.title,
    routeName: Projects.routeName,
    icon: Projects.icon,
    widget: Projects(),
  ),
  TabItem(
    title: CreateProject.title,
    routeName: CreateProject.routeName,
    icon: CreateProject.icon,
    widget: CreateProject(),
  ),
  TabItem(
    title: ProjectCategories.title,
    routeName: ProjectCategories.routeName,
    icon: ProjectCategories.icon,
    widget: ProjectCategories(),
  ),
  TabItem(
    title: CreateProjectCategory.title,
    routeName: CreateProjectCategory.routeName,
    icon: CreateProjectCategory.icon,
    widget: CreateProjectCategory(),
  ),
  TabItem(
    title: AdminUserAccessRequests.title,
    routeName: AdminUserAccessRequests.routeName,
    icon: Icons.add_moderator_outlined,
    widget: AdminUserAccessRequests(),
  ),
];
