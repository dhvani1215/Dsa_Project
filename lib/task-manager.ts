// Implementation of various data structures and algorithms for task management

// Task interface
interface Task {
  id: string
  title: string
  description: string
  priority: number
  status: "todo" | "in-progress" | "completed"
  dueDate: Date
  dependencies: string[]
  tags: string[]
}

// Priority Queue implementation using binary heap
class PriorityQueue<T> {
  private heap: T[] = []
  private comparator: (a: T, b: T) => number

  constructor(comparator: (a: T, b: T) => number) {
    this.comparator = comparator
  }

  // Get parent index
  private parent(index: number): number {
    return Math.floor((index - 1) / 2)
  }

  // Get left child index
  private leftChild(index: number): number {
    return 2 * index + 1
  }

  // Get right child index
  private rightChild(index: number): number {
    return 2 * index + 2
  }

  // Swap elements
  private swap(i: number, j: number): void {
    ;[this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]]
  }

  // Heapify up (bubble up)
  private siftUp(index: number): void {
    let current = index
    let parentIndex = this.parent(current)

    while (current > 0 && this.comparator(this.heap[current], this.heap[parentIndex]) < 0) {
      this.swap(current, parentIndex)
      current = parentIndex
      parentIndex = this.parent(current)
    }
  }

  // Heapify down (bubble down)
  private siftDown(index: number): void {
    let current = index
    let leftChildIndex = this.leftChild(current)
    let rightChildIndex = this.rightChild(current)
    const size = this.heap.length

    while (leftChildIndex < size) {
      const smallestChildIndex =
        rightChildIndex < size && this.comparator(this.heap[rightChildIndex], this.heap[leftChildIndex]) < 0
          ? rightChildIndex
          : leftChildIndex

      if (this.comparator(this.heap[current], this.heap[smallestChildIndex]) <= 0) {
        break
      }

      this.swap(current, smallestChildIndex)
      current = smallestChildIndex
      leftChildIndex = this.leftChild(current)
      rightChildIndex = this.rightChild(current)
    }
  }

  // Add element to the queue
  enqueue(value: T): void {
    this.heap.push(value)
    this.siftUp(this.heap.length - 1)
  }

  // Remove and return the highest priority element
  dequeue(): T | undefined {
    if (this.isEmpty()) {
      return undefined
    }

    const result = this.heap[0]
    const last = this.heap.pop()!

    if (this.heap.length > 0) {
      this.heap[0] = last
      this.siftDown(0)
    }

    return result
  }

  // Peek at the highest priority element without removing
  peek(): T | undefined {
    return this.isEmpty() ? undefined : this.heap[0]
  }

  // Check if queue is empty
  isEmpty(): boolean {
    return this.heap.length === 0
  }

  // Get all elements as array (for debugging)
  toArray(): T[] {
    return [...this.heap]
  }

  // Get size of queue
  size(): number {
    return this.heap.length
  }
}

// Graph implementation for task dependencies
class DependencyGraph {
  private adjacencyList: Map<string, string[]> = new Map()

  // Add a vertex (task)
  addVertex(taskId: string): void {
    if (!this.adjacencyList.has(taskId)) {
      this.adjacencyList.set(taskId, [])
    }
  }

  // Add an edge (dependency)
  addEdge(taskId: string, dependencyId: string): void {
    // Ensure both vertices exist
    this.addVertex(taskId)
    this.addVertex(dependencyId)

    // Add the dependency (edge from dependency to task)
    const dependencies = this.adjacencyList.get(dependencyId) || []
    if (!dependencies.includes(taskId)) {
      dependencies.push(taskId)
      this.adjacencyList.set(dependencyId, dependencies)
    }
  }

  // Remove a vertex and all associated edges
  removeVertex(taskId: string): void {
    // Remove the vertex from all adjacency lists
    this.adjacencyList.forEach((dependencies, key) => {
      this.adjacencyList.set(
        key,
        dependencies.filter((dep) => dep !== taskId),
      )
    })

    // Remove the vertex itself
    this.adjacencyList.delete(taskId)
  }

  // Get all tasks that depend on a given task
  getDependents(taskId: string): string[] {
    return this.adjacencyList.get(taskId) || []
  }

  // Check if there's a cycle in the graph (to prevent circular dependencies)
  hasCycle(): boolean {
    const visited = new Set<string>()
    const recStack = new Set<string>()

    const dfs = (vertex: string): boolean => {
      if (!visited.has(vertex)) {
        visited.add(vertex)
        recStack.add(vertex)

        const neighbors = this.adjacencyList.get(vertex) || []
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor) && dfs(neighbor)) {
            return true
          } else if (recStack.has(neighbor)) {
            return true
          }
        }
      }

      recStack.delete(vertex)
      return false
    }

    for (const vertex of this.adjacencyList.keys()) {
      if (dfs(vertex)) {
        return true
      }
    }

    return false
  }

  // Topological sort to get tasks in dependency order
  topologicalSort(): string[] {
    const result: string[] = []
    const visited = new Set<string>()
    const temp = new Set<string>()

    const visit = (vertex: string): void => {
      if (temp.has(vertex)) {
        throw new Error("Cycle detected in dependency graph")
      }

      if (!visited.has(vertex)) {
        temp.add(vertex)

        const neighbors = this.adjacencyList.get(vertex) || []
        for (const neighbor of neighbors) {
          visit(neighbor)
        }

        temp.delete(vertex)
        visited.add(vertex)
        result.unshift(vertex)
      }
    }

    for (const vertex of this.adjacencyList.keys()) {
      if (!visited.has(vertex)) {
        visit(vertex)
      }
    }

    return result
  }
}

// Trie implementation for efficient task search
class TrieNode {
  children: Map<string, TrieNode> = new Map()
  isEndOfWord = false
  taskIds: Set<string> = new Set()
}

class Trie {
  root: TrieNode = new TrieNode()

  // Insert a word into the trie
  insert(word: string, taskId: string): void {
    let current = this.root
    const lowerWord = word.toLowerCase()

    for (const char of lowerWord) {
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode())
      }
      current = current.children.get(char)!
      current.taskIds.add(taskId)
    }

    current.isEndOfWord = true
  }

  // Search for all task IDs that match the prefix
  searchPrefix(prefix: string): Set<string> {
    let current = this.root
    const lowerPrefix = prefix.toLowerCase()

    for (const char of lowerPrefix) {
      if (!current.children.has(char)) {
        return new Set()
      }
      current = current.children.get(char)!
    }

    return current.taskIds
  }

  // Remove a task ID from the trie
  removeTaskId(word: string, taskId: string): void {
    this._removeTaskId(this.root, word.toLowerCase(), 0, taskId)
  }

  private _removeTaskId(node: TrieNode, word: string, index: number, taskId: string): boolean {
    if (index === word.length) {
      node.taskIds.delete(taskId)
      return node.taskIds.size === 0 && node.children.size === 0
    }

    const char = word[index]
    if (!node.children.has(char)) {
      return false
    }

    const childNode = node.children.get(char)!
    const shouldDeleteChild = this._removeTaskId(childNode, word, index + 1, taskId)

    if (shouldDeleteChild) {
      node.children.delete(char)
      return node.taskIds.size === 0 && node.children.size === 0
    }

    return false
  }
}

// Main TaskManager class that uses the data structures
export class TaskManager {
  private tasks: Map<string, Task> = new Map()
  private titleTrie: Trie = new Trie()
  private descriptionTrie: Trie = new Trie()
  private tagTrie: Trie = new Trie()
  private dependencyGraph: DependencyGraph = new DependencyGraph()

  // Add a task to the system
  addTask(task: Task): void {
    // Add to tasks map
    this.tasks.set(task.id, task)

    // Add to tries for searching
    this.titleTrie.insert(task.title, task.id)
    this.descriptionTrie.insert(task.description, task.id)
    task.tags.forEach((tag) => this.tagTrie.insert(tag, task.id))

    // Add to dependency graph
    this.dependencyGraph.addVertex(task.id)
    task.dependencies.forEach((depId) => {
      this.dependencyGraph.addEdge(task.id, depId)
    })
  }

  // Remove a task from the system
  removeTask(taskId: string): void {
    const task = this.tasks.get(taskId)
    if (!task) return

    // Remove from tries
    this.titleTrie.removeTaskId(task.title, taskId)
    this.descriptionTrie.removeTaskId(task.description, taskId)
    task.tags.forEach((tag) => this.tagTrie.removeTaskId(tag, taskId))

    // Remove from dependency graph
    this.dependencyGraph.removeVertex(taskId)

    // Remove from tasks map
    this.tasks.delete(taskId)
  }

  // Update task status
  updateTaskStatus(taskId: string, newStatus: "todo" | "in-progress" | "completed"): void {
    const task = this.tasks.get(taskId)
    if (!task) return

    task.status = newStatus
    this.tasks.set(taskId, task)
  }

  // Get all tasks
  getAllTasks(): Task[] {
    return Array.from(this.tasks.values())
  }

  // Search tasks by query (using tries for efficient prefix search)
  searchTasks(query: string): Task[] {
    if (!query) return this.getAllTasks()

    const titleMatches = this.titleTrie.searchPrefix(query)
    const descriptionMatches = this.descriptionTrie.searchPrefix(query)
    const tagMatches = this.tagTrie.searchPrefix(query)

    // Combine all matches
    const matchedIds = new Set([...titleMatches, ...descriptionMatches, ...tagMatches])

    // Return tasks that match
    return Array.from(matchedIds)
      .map((id) => this.tasks.get(id))
      .filter((task): task is Task => task !== undefined)
  }

  // Sort tasks using efficient sorting algorithms
  sortTasks(tasks: Task[], sortBy: "priority" | "dueDate"): Task[] {
    // Create a priority queue with the appropriate comparator
    const comparator = (a: Task, b: Task): number => {
      if (sortBy === "priority") {
        // Higher priority (3) comes first
        return b.priority - a.priority
      } else {
        // Earlier date comes first
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      }
    }

    const pq = new PriorityQueue<Task>(comparator)

    // Add all tasks to the priority queue
    tasks.forEach((task) => pq.enqueue(task))

    // Extract tasks in sorted order
    const sortedTasks: Task[] = []
    while (!pq.isEmpty()) {
      const task = pq.dequeue()
      if (task) sortedTasks.push(task)
    }

    return sortedTasks
  }

  // Get tasks in dependency order (topological sort)
  getTasksInDependencyOrder(): Task[] {
    try {
      const orderedIds = this.dependencyGraph.topologicalSort()
      return orderedIds.map((id) => this.tasks.get(id)).filter((task): task is Task => task !== undefined)
    } catch (error) {
      console.error("Circular dependency detected:", error)
      return this.getAllTasks()
    }
  }

  // Check if a task can be started (all dependencies completed)
  canStartTask(taskId: string): boolean {
    const task = this.tasks.get(taskId)
    if (!task) return false

    // Check if all dependencies are completed
    return task.dependencies.every((depId) => {
      const depTask = this.tasks.get(depId)
      return depTask && depTask.status === "completed"
    })
  }
}

