class Helper {
  updateStateValue(
    setState,
    currentValue,
    String newValue,
  ) {
    setState(() {
      currentValue = newValue;
    });
  }
}
