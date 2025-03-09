import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// A service that stores and retrieves user settings.
///
/// By default, this class does not persist user settings. If you'd like to
/// persist the user settings locally, use the shared_preferences package. If
/// you'd like to store settings on a web server, use the http package.
class SettingsService {
  /// Loads the User's preferred ThemeMode from local or remote storage.
  Future<ThemeMode> themeMode() async => ThemeMode.system;

  Future<bool> isLoggedIn() async => adminUserIsLoggedIn();

  /// Persists the user's preferred ThemeMode to local or remote storage.
  Future<void> updateThemeMode(ThemeMode theme) async {
    // Use the shared_preferences package to persist settings locally
    saveData("theme", theme.toString());
    // http package to persist settings over the network.
  }

  Future<void> saveData(String key, var value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(key, value);
  }

  Future<String?> loadData(String key) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(key);
  }

  Future<void> logoutAdminUser() async {
    final prefs = await SharedPreferences.getInstance();
    prefs.clear();
  }

  Future<void> updateLoggedInData(loginData) async {
    if (loginData["email"] != null &&
        loginData["id"] != null &&
        loginData["token"] != null) {
      saveData("email", loginData["email"]);
      saveData("id", "${loginData["id"]}");
      saveData("token", loginData["token"]);
    }
  }

  Future<bool> adminUserIsLoggedIn() async {
    String? email = await loadData("email");
    String? id = await loadData("id");
    String? token = await loadData("token");

    if (token != null && id != null && email != null) return true;
    return false;
  }
}
