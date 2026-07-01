# Bug: Deleted Tag Reappears After Reload

## Summary

On the Export page, a tag can be created and then deleted from the Tags tab UI, but after a full page reload the deleted tag appears again in the list.

## Environment

- App URL: `http://localhost:4200/expenses/#/export`
- Date observed: 2026-07-01
- Screen: Export -> Tags

## Steps to Reproduce

1. Open `http://localhost:4200/expenses/#/export`.
2. Go to the `Tags` tab.
3. Create a new tag, for example `copilot-ui-delete-check-20260701`.
4. Verify the new tag appears in the list.
5. Delete that tag and confirm the browser dialog.
6. Verify the tag disappears from the current UI.
7. Reload the page.
8. Go back to the `Tags` tab.

## Expected Result

The deleted tag should remain deleted after reload.

## Actual Result

- The tag disappears immediately after deletion in the current UI state.
- After a full page reload, the page returns to the `Reminders` tab.
- After switching back to `Tags`, the deleted tag is present in the list again.

## Notes

- This looks like a persistence or synchronization bug rather than a pure rendering bug.
- The deletion is reflected optimistically in the current view but is not persisted across reload.