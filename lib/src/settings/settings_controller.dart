import 'package:flutter/material.dart';

import 'settings_service.dart';

class SettingsController with ChangeNotifier {
  SettingsController(this._settingsService);

  // Make SettingsService a private variable so it is not used directly.
  final SettingsService _settingsService;

  // Make ThemeMode a private variable so it is not updated directly without
  // also persisting the changes with the SettingsService.
  late ThemeMode _themeMode;

  late bool _isLoggedIn;

  // Allow Widgets to read the user's preferred ThemeMode.
  ThemeMode get themeMode => _themeMode;
  bool get isLoggedIn => _isLoggedIn;

  /// Load the user's settings from the SettingsService. It may load from a
  /// local database or the internet. The controller only knows it can load the
  /// settings from the service.
  Future<void> loadSettings() async {
    _themeMode = await _settingsService.themeMode();
    _isLoggedIn = await _settingsService.isLoggedIn();
    notifyListeners();
  }

  Future<void> updateThemeMode(ThemeMode? newThemeMode) async {
    if (newThemeMode == null) return;
    if (newThemeMode == _themeMode) return;

    _themeMode = newThemeMode;

    notifyListeners();
    await _settingsService.updateThemeMode(newThemeMode);
  }

  Future<void> updateIsLoggedIn(loginData) async {
    if (loginData == null) _isLoggedIn = false;

    if (loginData["email"] != null && loginData["id"] != null) {
      _isLoggedIn = true;
    }
    notifyListeners();
    await _settingsService.updateLoggedInData(loginData);
  }

  Future<void> logoutAdminUser() async {
    await _settingsService.logoutAdminUser();

    _isLoggedIn = false;

    notifyListeners();
  }
}
