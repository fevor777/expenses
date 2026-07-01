# Expenses

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.0.

## Development server
### Android WebView wrapper Google Sign-In

Set your Firebase Web OAuth client ID in `android-webview/local.properties`:

```
WEB_CLIENT_ID=YOUR_WEB_CLIENT_ID.apps.googleusercontent.com
```

Then build & install:

```
npm run android:apk
```

The web app running inside the WebView will call the native bridge via `window.NativeAuth.requestGoogleSignIn()`; on success the native layer forwards the ID token to the web app (`window.onNativeGoogleIdToken`).

## MCP

The repository includes project-level MCP client configs for the standalone server in `mcp-server/`:

- Claude Code: `.mcp.json`
- VS Code: `.vscode/mcp.json`
- Cursor: `.cursor/mcp.json`

Local usage:

```bash
export EXPENSES_OWNER_UID="your-firebase-uid"
export MCP_BEARER_TOKEN="replace-with-long-random-token"
export FIREBASE_PROJECT_ID="your-gcp-project"
npm run mcp:dev
```

Notes:

- Claude Code reads `MCP_BEARER_TOKEN` from your shell and uses `EXPENSES_MCP_URL` if you want to override `http://localhost:8080/mcp`.
- VS Code prompts for the MCP URL and bearer token from `.vscode/mcp.json`.
- Cursor reads `MCP_BEARER_TOKEN` from your environment and targets `http://localhost:8080/mcp` by default.
- The MCP server exposes tag management tools (`list_tags`, `create_tag`, `update_tag`, `delete_tag`) and expense tools accept `tagIds`.


Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
