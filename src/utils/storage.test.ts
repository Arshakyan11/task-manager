import { describe, it, expect, beforeEach } from 'vitest'
import { getStoredTasks, setStoredTasks, STORAGE_KEY } from './storage'
import type { Task } from '../types/task'

describe('storage utilities', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('getStoredTasks', () => {
    it('returns null when localStorage is empty', () => {
      const result = getStoredTasks()
      expect(result).toBeNull()
    })

    it('returns parsed tasks when valid data exists', () => {
      const tasks: Task[] = [
        { id: '1', title: 'Test task', completed: false, createdAt: Date.now() }
      ]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))

      const result = getStoredTasks()
      expect(result).toEqual(tasks)
    })

    it('returns null when JSON is invalid', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid json{')

      const result = getStoredTasks()
      expect(result).toBeNull()
    })

    it('returns null when data structure is invalid (not an array)', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ not: 'an array' }))

      const result = getStoredTasks()
      expect(result).toBeNull()
    })

    it('returns null when task objects are missing required properties', () => {
      const invalidTasks = [{ id: '1', title: 'Missing completed field' }]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(invalidTasks))

      const result = getStoredTasks()
      expect(result).toBeNull()
    })
  })

  describe('setStoredTasks', () => {
    it('writes tasks to localStorage as JSON', () => {
      const tasks: Task[] = [
        { id: '1', title: 'Test task', completed: false, createdAt: 12345 }
      ]

      setStoredTasks(tasks)

      const stored = localStorage.getItem(STORAGE_KEY)
      expect(stored).toBe(JSON.stringify(tasks))
    })

    it('overwrites existing data', () => {
      const oldTasks: Task[] = [
        { id: '1', title: 'Old task', completed: true, createdAt: 11111 }
      ]
      const newTasks: Task[] = [
        { id: '2', title: 'New task', completed: false, createdAt: 22222 }
      ]

      setStoredTasks(oldTasks)
      setStoredTasks(newTasks)

      const result = getStoredTasks()
      expect(result).toEqual(newTasks)
    })

    it('can store empty array', () => {
      setStoredTasks([])

      const result = getStoredTasks()
      expect(result).toEqual([])
    })
  })
})
