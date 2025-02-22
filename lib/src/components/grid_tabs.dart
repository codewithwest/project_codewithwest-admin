import 'package:codewithwest_admin/src/helper/colors.dart';
import 'package:codewithwest_admin/src/helper/dashboard/tab_items.dart';
import 'package:codewithwest_admin/src/helper/screen_breakpoints.dart';
import 'package:flutter/material.dart';

class GridTabs extends StatefulWidget {
  const GridTabs({super.key});

  @override
  GridTabsState createState() => GridTabsState();
}

class GridTabsState extends State<GridTabs>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: tabs.length, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;
    return GridView.count(
        padding: EdgeInsets.all(10),
        mainAxisSpacing: 5,
        crossAxisSpacing: 8,
        crossAxisCount: screenWidth > ScreenBreakpoints.large
            ? 4
            : screenWidth > ScreenBreakpoints.medium
                ? 3
                : 2,
        children: tabs // List of TabItem
            .map((tab) {
          return SizedBox(
            height: 260,
            child: OutlinedButton(
              style: OutlinedButton.styleFrom(
                shape: RoundedRectangleBorder(
                  side: BorderSide(
                    color: AppColors.secondaryTextColor,
                    width: 2,
                  ),
                  borderRadius: BorderRadius.circular(25),
                ),
              ),
              onPressed: () => Navigator.pushNamed(context, tab.routeName),
              child: Text(tab.title),
            ),
          );
        }).toList());
  }
}
