# Expenses App Documentation

## Overview

The Expenses app is a modern Angular application for tracking, analyzing, and exporting personal expenses. It features a clean, mobile-friendly interface and powerful analysis tools, making it easy to manage your finances.

---

## Main Features

### 1. Expense Entry
- Add new expenses by entering an amount, selecting a category, and providing an optional description.
- Supports multiple currencies and balance tracking.
- Quick navigation to History, Statistics, and Export screens.

### 2. History
- View a chronological list of all expenses, grouped by date.
- Edit or delete individual expenses.
- Filter expenses by category and date.
- Swipe gestures for fast navigation between screens.

### 3. Statistics
- Visualize expenses by category using interactive pie and bar charts.
- Filter statistics by date and category.
- View total, regular, and irregular expenses.
- Tap on chart segments for detailed breakdowns.

### 4. Details
- See detailed breakdowns for selected categories or filters.
- Summarizes expenses for day, month, and year.
- Easy navigation back to previous screens.

### 5. Export
- Export all expenses to CSV format for use in spreadsheets.
- Google authentication for secure cloud sync.
- Migrate local data to Firebase for backup and multi-device access.

---

## User Flows

1. **Adding an Expense**: Enter amount → Select category → (Optional) Add description → Save.
2. **Viewing History**: Navigate to History → Browse or filter expenses → Edit/Delete as needed.
3. **Analyzing Statistics**: Go to Statistics → View charts → Filter by date/category → Tap for details.
4. **Exporting Data**: Go to Export → Sign in (optional) → Export to CSV or migrate to Firebase.

---

## Technical Architecture
- Built with Angular and Angular Material for UI.
- Uses Firebase for authentication and cloud storage.
- Modular structure with lazy-loaded routes for performance.
- Responsive design with mobile gesture support.
- Data visualization with ECharts and ng2-charts.

---

## Screenshots

(See attached images in the `screens/` folder for visual references to each feature and flow.)

---

## Conclusion

The Expenses app provides a comprehensive solution for personal finance management, combining ease of use with powerful analysis and export features. Its modular, scalable architecture ensures maintainability and future extensibility.
