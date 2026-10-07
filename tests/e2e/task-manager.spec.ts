import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173');
  // Clear localStorage before each test
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test.describe('Task Manager', () => {
  test('should add a new task', async ({ page }) => {
    await page.fill('input[type="text"]', 'Buy groceries');
    await page.click('button:has-text("Add Task")');

    await expect(page.locator('.task-list li')).toHaveCount(1);
    await expect(page.locator('.task-list li')).toContainText('Buy groceries');
  });

  test('should add task with Enter key', async ({ page }) => {
    await page.fill('input[type="text"]', 'Write documentation');
    await page.press('input[type="text"]', 'Enter');

    await expect(page.locator('.task-list li')).toHaveCount(1);
    await expect(page.locator('.task-list li')).toContainText('Write documentation');
  });

  test('should toggle task completion', async ({ page }) => {
    // Add a task
    await page.fill('input[type="text"]', 'Buy groceries');
    await page.press('input[type="text"]', 'Enter');

    // Toggle completion
    const checkbox = page.locator('.task-list li').first().locator('input[type="checkbox"]');
    await checkbox.check();
    await expect(checkbox).toBeChecked();

    // Toggle back
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });

  test('should filter tasks by status', async ({ page }) => {
    // Add multiple tasks
    await page.fill('input[type="text"]', 'Task 1');
    await page.press('input[type="text"]', 'Enter');
    await page.fill('input[type="text"]', 'Task 2');
    await page.press('input[type="text"]', 'Enter');
    await page.fill('input[type="text"]', 'Task 3');
    await page.press('input[type="text"]', 'Enter');

    // Mark one as completed
    await page.locator('.task-list li').first().locator('input[type="checkbox"]').check();

    // Filter to Active
    await page.click('button:has-text("Active")');
    await expect(page.locator('.task-list li')).toHaveCount(2);

    // Filter to Completed
    await page.click('button:has-text("Completed")');
    await expect(page.locator('.task-list li')).toHaveCount(1);

    // Filter to All
    await page.click('button:has-text("All")');
    await expect(page.locator('.task-list li')).toHaveCount(3);
  });

  test('should edit a task', async ({ page }) => {
    // Add a task
    await page.fill('input[type="text"]', 'Original task');
    await page.press('input[type="text"]', 'Enter');

    // Click edit
    await page.locator('.task-list li').locator('button:has-text("Edit")').click();

    // Edit the task
    await page.fill('.task-list li input[type="text"]', 'Updated task');
    await page.locator('.task-list li button:has-text("Save")').click();

    // Verify updated
    await expect(page.locator('.task-list li')).toContainText('Updated task');
    await expect(page.locator('.task-list li')).not.toContainText('Original task');
  });

  test('should save edited task when pressing Enter', async ({ page }) => {
    // Add a task
    await page.fill('input[type="text"]', 'Original task');
    await page.press('input[type="text"]', 'Enter');

    // Click edit
    await page.locator('.task-list li').locator('button:has-text("Edit")').click();

    // Edit the task and press Enter
    const editInput = page.locator('.task-list li input[type="text"]');
    await editInput.fill('Updated with Enter');
    await editInput.press('Enter');

    // Verify updated
    await expect(page.locator('.task-list li')).toContainText('Updated with Enter');
    await expect(page.locator('.task-list li')).not.toContainText('Original task');
  });

  test('should cancel edit when pressing Escape', async ({ page }) => {
    // Add a task
    await page.fill('input[type="text"]', 'Original task');
    await page.press('input[type="text"]', 'Enter');

    // Click edit
    await page.locator('.task-list li').locator('button:has-text("Edit")').click();

    // Start editing and press Escape
    const editInput = page.locator('.task-list li input[type="text"]');
    await editInput.fill('Changed text');
    await editInput.press('Escape');

    // Verify not updated
    await expect(page.locator('.task-list li')).toContainText('Original task');
    await expect(page.locator('.task-list li')).not.toContainText('Changed text');
  });

  test('should show validation error for empty edited task', async ({ page }) => {
    // Add a task
    await page.fill('input[type="text"]', 'Original task');
    await page.press('input[type="text"]', 'Enter');

    // Click edit
    await page.locator('.task-list li').locator('button:has-text("Edit")').click();

    // Clear the input and try to save
    const editInput = page.locator('.task-list li input[type="text"]');
    await editInput.fill('');
    await page.locator('.task-list li button:has-text("Save")').click();

    // Verify error is shown and edit mode stays open
    await expect(page.locator('.task-list li .error')).toBeVisible();
    await expect(page.locator('.task-list li .error')).toContainText('Task title cannot be empty');
    await expect(editInput).toBeVisible();

    // Type valid text and verify error disappears
    await editInput.fill('Valid task');
    await expect(page.locator('.task-list li .error')).not.toBeVisible();
  });

  test('should delete a task', async ({ page }) => {
    // Add tasks
    await page.fill('input[type="text"]', 'Task to keep');
    await page.press('input[type="text"]', 'Enter');
    await page.fill('input[type="text"]', 'Task to delete');
    await page.press('input[type="text"]', 'Enter');

    await expect(page.locator('.task-list li')).toHaveCount(2);

    // Delete the second task
    await page.locator('.task-list li').last().locator('button:has-text("Delete")').click();

    await expect(page.locator('.task-list li')).toHaveCount(1);
    await expect(page.locator('.task-list li')).toContainText('Task to keep');
    await expect(page.locator('.task-list li')).not.toContainText('Task to delete');
  });

  test('should persist tasks after page reload', async ({ page }) => {
    // Add tasks
    await page.fill('input[type="text"]', 'Persistent task 1');
    await page.press('input[type="text"]', 'Enter');
    await page.fill('input[type="text"]', 'Persistent task 2');
    await page.press('input[type="text"]', 'Enter');

    // Mark one as completed
    await page.locator('.task-list li').first().locator('input[type="checkbox"]').check();

    // Reload the page
    await page.reload();

    // Verify tasks persisted
    await expect(page.locator('.task-list li')).toHaveCount(2);
    await expect(page.locator('.task-list li').first().locator('input[type="checkbox"]')).toBeChecked();
    await expect(page.locator('.task-list li').last().locator('input[type="checkbox"]')).not.toBeChecked();
  });

  test('should validate empty task submission', async ({ page }) => {
    // Try to add empty task
    await page.click('button:has-text("Add Task")');

    // Should show error
    await expect(page.locator('.error')).toBeVisible();
    await expect(page.locator('.task-list li')).toHaveCount(0);
  });
});
