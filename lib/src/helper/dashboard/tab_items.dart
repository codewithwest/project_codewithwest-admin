import '/src/main/admin/projects/project_categories.dart';
import '/src/main/admin/projects/projects.dart';
import '/src/main/admin/user/admin_user_access_requests.dart';
import '/src/main/admin/user/create_admin_user.dart';
import '/src/main/admin/user/admin_users.dart';

class TabItem {
  final String title;
  final String routeName;

  TabItem({required this.title, required this.routeName});
}

final List<TabItem> tabs = [
  TabItem(
    title: 'Admin Users',
    routeName: AdminUsers.routeName,
  ),
  TabItem(
    title: 'Create Admin User',
    routeName: CreateAdminUser.routeName,
  ),
  TabItem(
      title: "Admin User Requests",
      routeName: AdminUserAccessRequests.routeName),

  TabItem(
    title: 'Projects',
    routeName: Projects.routeName,
  ),
  TabItem(
    title: 'Create Project',
    routeName: '/create-project',
  ),
  TabItem(
    title: "Project Categories",
    routeName: ProjectCategories.routeName,
  ),
  TabItem(
    title: "Create Project Category",
    routeName: "/create-project-category",
  ),

  // Add more tabs as needed
];
