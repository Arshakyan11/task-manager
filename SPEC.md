# Todo List Application - Functional Specification

## Overview
A simple todo list application built with React, TypeScript, and Vite for a junior developer recruitment task. Tasks persist in localStorage.

## Technology Stack
- **Frontend:** React 19 with functional components and hooks
- **Language:** TypeScript 6 with strong typing
- **Build Tool:** Vite
- **Testing:** Vitest + React Testing Library

## Functional Requirements

### F1: Display Task List
Display all tasks with title, completion status, and action buttons.

**Acceptance Criteria:**
- Each task shows its title text
- Completed tasks are visually distinguished (strikethrough styling)
- Empty state message shown when no tasks match current filter
- Tasks maintain creation order

### F2: Add New Task
User can create a new task via text input and submission.

**Acceptance Criteria:**
- Input field for task title with submit button
- Submit on Enter key or button click
- New task appears immediately in the list
- Input clears after successful addition
- Empty or whitespace-only titles rejected with error message

### F3: Edit Existing Task
User can modify task title after creation.

**Acceptance Criteria:**
- Task enters inline edit mode on Edit button click
- Current title pre-filled in edit field
- Save button commits changes
- Cancel button reverts to original title
- Same validation as F2 (no empty titles)

### F4: Toggle Task Completion
User can mark tasks complete/incomplete.

**Acceptance Criteria:**
- Checkbox toggles completion status
- Visual state updates immediately
- Completion status persists across page reloads

### F5: Delete Task
User can remove tasks permanently.

**Acceptance Criteria:**
- Delete button per task
- Task removed immediately from UI and storage
- No confirmation modal (simple delete)

### F6: Filter Tasks
Three filter views: All, Active, Completed.

**Acceptance Criteria:**
- Three filter buttons clearly labeled
- Active filter visually indicated
- "All" shows all tasks
- "Active" shows only incomplete tasks
- "Completed" shows only completed tasks
- Context-aware empty state per filter
- Filter state resets to "All" on page load

### F7: Persist Data
Tasks survive page refresh via localStorage.

**Acceptance Criteria:**
- All task data (id, title, completed, createdAt) saved to localStorage
- Data loaded on app mount
- Malformed localStorage data handled gracefully (cleared, app starts fresh)
- Storage key: `'taskManagerTasks'`

## Edge Cases

### Critical Edge Cases (Must Handle)
1. **Empty task title:** Reject submission, show error feedback
2. **Whitespace-only title:** Treated as empty
3. **Malformed localStorage data:** Catch parse errors, clear storage, start fresh
4. **Missing localStorage:** App works without persistence (e.g., private browsing)
5. **Invalid task structure:** Validate required properties, reject if malformed
6. **Nonexistent task IDs:** Operations on missing IDs do nothing (no crash)

### Design Assumptions
- Duplicate titles allowed (each task has unique ID)
- Very long titles handled via CSS (truncation/wrapping)
- Task ordering: natural creation order (no sorting)
- No pagination needed
- No confirmation modals
- No undo functionality

## Architecture

### Type Definitions (`src/types/task.ts`)
```typescript
export interface Task {
  id: string;           // Generated via crypto.randomUUID()
  title: string;
  completed: boolean;
  createdAt: number;    // Timestamp
}

export type FilterType = 'all' | 'active' | 'completed';
```

### Storage Layer (`src/utils/storage.ts`)
**Responsibilities:**
- Safe read/write to localStorage
- JSON serialization/deserialization
- Data structure validation
- Error handling for malformed data

**API:**
- `getStoredTasks(): Task[] | null` - Returns null on error or empty
- `setStoredTasks(tasks: Task[]): void` - Writes to localStorage
- `STORAGE_KEY = 'taskManagerTasks'`

### State Management (`src/hooks/useTasks.ts`)
**Responsibilities:**
- Maintain tasks array in React state
- CRUD operations: add, update, delete, toggle
- Filter logic based on current filter
- Sync with localStorage on mutations
- Load from localStorage on mount

**API:**
```typescript
interface UseTasksReturn {
  tasks: Task[];              // All tasks
  filteredTasks: Task[];      // Based on current filter
  filter: FilterType;
  addTask: (title: string) => void;
  updateTask: (id: string, title: string) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  setFilter: (filter: FilterType) => void;
}
```

### Components

**App.tsx**
- Top-level composition
- No state (delegates to useTasks hook)
- Contains inline empty state rendering with context-aware messages
- Maps filteredTasks to TaskItem components

**TaskForm.tsx**
- Controlled input for adding tasks
- Client-side validation
- Error display

**TaskItem.tsx**
- Single task display
- Checkbox for completion toggle
- Inline edit mode with Save/Cancel
- Delete button

**FilterBar.tsx**
- Three filter buttons
- Highlights active filter

## Accessibility Requirements
- Semantic HTML (button, input, checkbox, ul/li)
- Keyboard navigation (Tab, Enter, Escape)
- ARIA labels where needed
- Visible focus indicators
- Screen reader friendly

## Testing Strategy

### Focus
- Test user behavior, not implementation details
- Integration tests over isolated unit tests
- Test through the UI using React Testing Library
- Critical edge cases covered

### Test Categories
1. **Storage utilities** - Boundary testing for localStorage interaction
2. **Integration tests** - Main user flows through App component
3. **Hook tests** - Key behaviors of useTasks (lightweight)
4. **Component tests** - Only for complex components (TaskItem edit mode)

### Coverage Goals
- All functional requirements (F1-F7)
- All critical edge cases
- Main user workflows
- Proportional to application complexity

## Implementation Notes

### ID Generation
Use `crypto.randomUUID()` (native, no dependencies)

### Styling Approach
Plain CSS or CSS Modules (no UI libraries)

### Validation
- Trim whitespace before validation
- Reject empty strings after trimming
- Show inline error messages

### LocalStorage
- Write on every mutation
- Read once on mount
- Clear and start fresh if validation fails

## Out of Scope
- Backend/API integration
- User authentication
- Task categories/tags
- Due dates
- Priority levels
- Drag-and-drop reordering
- Bulk operations
- Export/import
- Undo/redo
- Keyboard shortcuts beyond standard navigation
- Mobile-specific gestures
