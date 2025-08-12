# Expenses App – Codebase Documentation

## 1. Project Structure Overview

```
expenses/
├── angular.json
├── firebase.json
├── package.json
├── README.md
├── src/
│   ├── app/
│   │   ├── app-routing.module.ts
│   │   ├── app.component.ts / .html / .scss
│   │   ├── app.module.ts
│   │   ├── common/
│   │   │   ├── component/
│   │   │   ├── model/
│   │   │   ├── pipe/
│   │   │   ├── service/
│   │   │   ├── app-initializer.ts
│   │   │   ├── custom-hammer.config.ts
│   │   │   ├── expression-evaluator.ts
│   │   │   └── swipe.directive.ts
│   │   ├── details/
│   │   ├── expense/
│   │   ├── export/
│   │   ├── history/
│   │   ├── statistics/
│   ├── environments/
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
├── docs/
│   └── expenses-app-documentation.md
├── screens/
│   └── (screenshots)
└── ...
```

---

## 2. Main Modules and Their Roles

### App Shell
- **`app.component.ts` / `app.component.html`**: Root component, contains the router outlet and notification system.
- **`app.module.ts`**: Main Angular module, imports Firebase, routing, charts, and notification components.
- **`app-routing.module.ts`**: Defines lazy-loaded routes for `history`, `statistics`, `export`, `details`, and the default `expense` screen.

### Feature Modules

#### Expense Entry (`expense/`)
- **`expense.component.ts`**: Handles adding new expenses, selecting categories, entering amounts/descriptions, and updating balances.
- **Header and Number Board**: Subcomponents for UI input and navigation.

#### History (`history/`)
- **`history.component.ts`**: Lists expenses by date, allows editing/deleting, and supports filtering and swipe navigation.
- **`history-expense.ts`**: Data model for history items.

#### Statistics (`statistics/`)
- **`statistics.component.ts`**: Visualizes expenses by category using pie/bar charts (ECharts/ng2-charts), supports filtering and interactive analysis.

#### Details (`details/`)
- **`details.component.ts`**: Shows detailed breakdowns for selected categories or filters, with summaries for day/month/year.

#### Export (`export/`)
- **`export.component.ts`**: Handles exporting expenses to CSV, Google authentication, and Firebase data migration.

### Common Utilities
- **`common/model/`**: Data models (Expense, Category, Currency, etc.).
- **`common/service/`**: Services for authentication, balance, expenses, etc.
- **`common/component/`**: Shared UI components (notifications, filters, charts).
- **`common/pipe/`**: Angular pipes for formatting and filtering.
- **`common/app-initializer.ts`**: App initialization logic.
- **`common/custom-hammer.config.ts`**: Gesture configuration for swipe support.
- **`common/expression-evaluator.ts`**: Utility for evaluating mathematical expressions in amount input.

---

## 3. Key Flows and Logic

### Adding an Expense
- User enters an amount (supports math expressions), selects a category, and optionally adds a description.
- Expense is saved via `ExpenseService`, and balance is updated if the category affects the balance.
- UI updates and a notification is shown.

### Viewing and Editing History
- Expenses are fetched and grouped by date.
- User can edit amount/description or delete expenses.
- Swipe gestures allow navigation between screens.

### Analyzing Statistics
- Expenses are aggregated by category and visualized in charts.
- User can filter by date/category and interact with charts for details.

### Exporting Data
- User can export all expenses to CSV.
- Google authentication enables cloud sync and migration to Firebase.

---

## 4. Screenshots Mapping

- The `screens/` folder contains PNGs showing the main UI screens:
  - Expense entry form
  - History list
  - Statistics charts
  - Details breakdown
  - Export options
- These images visually correspond to the modules and flows described above.

---

## 5. Technical Highlights

- **Angular Standalone Components**: Many components are standalone for modularity and lazy loading.
- **Firebase Integration**: Used for authentication and cloud storage.
- **Gesture Support**: Custom Hammer.js config enables swipe navigation on mobile.
- **Data Visualization**: ECharts and ng2-charts for interactive statistics.
- **Responsive Design**: UI adapts to mobile and desktop.

---

## 6. How to Extend or Maintain

- Add new features by creating new components/services in the appropriate module.
- Update data models in `common/model/`.
- Add new routes in `app-routing.module.ts`.
- Use Angular CLI for scaffolding and best practices.

---

## 7. References

- See `docs/expenses-app-documentation.md` for a user-focused feature overview.
- See `screens/` for UI references.

---

This documentation should help you quickly understand the structure, logic, and extensibility of the Expenses app codebase. If you need deeper technical details on any module or flow, let me know!
