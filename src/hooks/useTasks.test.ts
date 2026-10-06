import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTasks } from './useTasks'
import { setStoredTasks, STORAGE_KEY } from '../utils/storage'
import type { Task } from '../types/task'

describe('useTasks', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('loads tasks from localStorage on mount', () => {
    const tasks: Task[] = [
      { id: '1', title: 'Task 1', completed: false, createdAt: 1000 },
      { id: '2', title: 'Task 2', completed: true, createdAt: 2000 }
    ]
    setStoredTasks(tasks)

    const { result } = renderHook(() => useTasks())

    expect(result.current.tasks).toEqual(tasks)
  })

  it('handles malformed localStorage data gracefully', () => {
    localStorage.setItem(STORAGE_KEY, 'invalid json{')

    const { result } = renderHook(() => useTasks())

    expect(result.current.tasks).toEqual([])
  })

  it('creates task with unique ID and saves to localStorage', () => {
    const { result } = renderHook(() => useTasks())

    act(() => {
      result.current.addTask('New task')
    })

    expect(result.current.tasks).toHaveLength(1)
    expect(result.current.tasks[0]).toMatchObject({
      title: 'New task',
      completed: false
    })
    expect(result.current.tasks[0].id).toBeTruthy()

    const stored = localStorage.getItem(STORAGE_KEY)
    expect(JSON.parse(stored!)[0].title).toBe('New task')
  })

  it('filters tasks correctly based on completion status', () => {
    const { result } = renderHook(() => useTasks())

    act(() => {
      result.current.addTask('Active task')
      result.current.addTask('Completed task')
      result.current.toggleTask(result.current.tasks[1].id)
    })

    act(() => result.current.setFilter('active'))
    expect(result.current.filteredTasks).toHaveLength(1)
    expect(result.current.filteredTasks[0].title).toBe('Active task')

    act(() => result.current.setFilter('completed'))
    expect(result.current.filteredTasks).toHaveLength(1)
    expect(result.current.filteredTasks[0].title).toBe('Completed task')

    act(() => result.current.setFilter('all'))
    expect(result.current.filteredTasks).toHaveLength(2)
  })
})
