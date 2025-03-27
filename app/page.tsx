"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Filter, ArrowUpDown, Check, X, Frame } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaskManager } from "@/lib/task-manager"

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

export default function Home() {
  // Initialize task manager with DSA implementations
  const [taskManager] = useState(() => new TaskManager())
  const [tasks, setTasks] = useState<Task[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"priority" | "dueDate">("priority")
  const [filterStatus, setFilterStatus] = useState<"all" | "todo" | "in-progress" | "completed">("all")
  const [newTask, setNewTask] = useState<Omit<Task, "id">>({
    title: "",
    description: "",
    priority: 1,
    status: "todo",
    dueDate: new Date(),
    dependencies: [],
    tags: [],
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [availableTags, setAvailableTags] = useState<string[]>(["work", "personal", "urgent", "study"])
  const [newTag, setNewTag] = useState("")
  const [mounted, setMounted] = useState(false)

  // Handle theme mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load initial demo tasks
  useEffect(() => {
    const demoTasks: Task[] = [
      {
        id: "1",
        title: "Complete DSA Project",
        description: "Finish implementing the task management system with efficient algorithms",
        priority: 3,
        status: "in-progress",
        dueDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
        dependencies: [],
        tags: ["urgent", "study"],
      },
      {
        id: "2",
        title: "Prepare Resume",
        description: "Update resume with new projects and skills",
        priority: 2,
        status: "todo",
        dueDate: new Date(Date.now() + 86400000 * 5), // 5 days from now
        dependencies: ["1"],
        tags: ["personal"],
      },
      {
        id: "3",
        title: "Research Job Opportunities",
        description: "Look for entry-level software engineering positions",
        priority: 1,
        status: "todo",
        dueDate: new Date(Date.now() + 86400000 * 7), // 7 days from now
        dependencies: ["2"],
        tags: ["personal", "work"],
      },
    ]

    // Add demo tasks to task manager
    demoTasks.forEach((task) => taskManager.addTask(task))
    updateTaskList()
  }, [])

  // Update the task list based on current filters and sorting
  const updateTaskList = () => {
    let filteredTasks = taskManager.getAllTasks()

    // Apply search filter (using binary search for prefix matching when possible)
    if (searchQuery) {
      filteredTasks = taskManager.searchTasks(searchQuery)
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filteredTasks = filteredTasks.filter((task) => task.status === filterStatus)
    }

    // Apply sorting (using efficient sorting algorithms in the task manager)
    filteredTasks = taskManager.sortTasks(filteredTasks, sortBy)

    setTasks(filteredTasks)
  }

  // Effect to update task list when filters or sorting changes
  useEffect(() => {
    updateTaskList()
  }, [searchQuery, sortBy, filterStatus])

  // Handle adding a new task
  const handleAddTask = () => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      dueDate: new Date(newTask.dueDate),
    }

    taskManager.addTask(task)
    updateTaskList()

    // Reset form
    setNewTask({
      title: "",
      description: "",
      priority: 1,
      status: "todo",
      dueDate: new Date(),
      dependencies: [],
      tags: [],
    })

    setIsDialogOpen(false)
  }

  // Handle updating task status
  const handleStatusChange = (taskId: string, newStatus: "todo" | "in-progress" | "completed") => {
    taskManager.updateTaskStatus(taskId, newStatus)
    updateTaskList()
  }

  // Handle adding a new tag
  const handleAddTag = () => {
    if (newTag && !availableTags.includes(newTag)) {
      setAvailableTags([...availableTags, newTag])
      setNewTag("")
    }
  }

  // Handle adding a tag to the new task
  const handleAddTagToTask = (tag: string) => {
    if (!newTask.tags.includes(tag)) {
      setNewTask({
        ...newTask,
        tags: [...newTask.tags, tag],
      })
    }
  }

  // Handle removing a tag from the new task
  const handleRemoveTagFromTask = (tag: string) => {
    setNewTask({
      ...newTask,
      tags: newTask.tags.filter((t) => t !== tag),
    })
  }

  // Get tasks that can be dependencies (to avoid circular dependencies)
  const getPossibleDependencies = () => {
    return tasks.filter((task) => !task.dependencies.includes(newTask.id))
  }

  // Handle adding a dependency to the new task
  const handleAddDependency = (dependencyId: string) => {
    if (!newTask.dependencies.includes(dependencyId)) {
      setNewTask({
        ...newTask,
        dependencies: [...newTask.dependencies, dependencyId],
      })
    }
  }

  if (!mounted) return null

  return (
    <main className="container mx-auto py-8 px-4 min-h-screen">
      <header className="flex items-center h-16 px-4 border-b shrink-0 md:px-6 mb-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold sm:text-base mr-4">
          <Frame className="w-6 h-6 text-blue-primary dark:text-blue-light" />
          <span className="font-bold text-blue-primary dark:text-blue-light">TaskFlow</span>
        </Link>
        <nav className="hidden font-medium sm:flex flex-row items-center gap-5 text-sm lg:gap-6">
          <Link href="/" className="font-bold text-blue-primary dark:text-blue-light">
            Dashboard
          </Link>
          <Link href="/projects" className="text-muted-foreground hover:text-blue-primary dark:hover:text-blue-light">
            Projects
          </Link>
          <Link href="/analytics" className="text-muted-foreground hover:text-blue-primary dark:hover:text-blue-light">
            Analytics
          </Link>
          <Link href="/settings" className="text-muted-foreground hover:text-blue-primary dark:hover:text-blue-light">
            Settings
          </Link>
        </nav>
        <div className="flex items-center w-full gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <Button variant="ghost" size="icon" className="rounded-full ml-auto">
            <Image
              src="/placeholder.svg?height=32&width=32"
              width="32"
              height="32"
              className="rounded-full border"
              alt="Avatar"
            />
            <span className="sr-only">User menu</span>
          </Button>
        </div>
      </header>
      <div className="flex flex-col space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold text-blue-primary dark:text-blue-light">Task Management System</h1>
            <p className="text-muted-foreground">
              A DSA-powered task management system with efficient search, sorting, and dependency tracking
            </p>
          </div>
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4">
          <div className="flex flex-1 items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tasks..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as any)}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
              <SelectTrigger className="w-[180px]">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="dueDate">Due Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-primary hover:bg-blue-primary/90 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogDescription>Create a new task with details, priority, and dependencies.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="priority" className="text-right">
                    Priority
                  </Label>
                  <Select
                    value={newTask.priority.toString()}
                    onValueChange={(value) => setNewTask({ ...newTask, priority: Number.parseInt(value) })}
                  >
                    <SelectTrigger id="priority" className="col-span-3">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Low</SelectItem>
                      <SelectItem value="2">Medium</SelectItem>
                      <SelectItem value="3">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dueDate" className="text-right">
                    Due Date
                  </Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={new Date(newTask.dueDate).toISOString().split("T")[0]}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: new Date(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">Tags</Label>
                  <div className="col-span-3 space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {newTask.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="flex items-center gap-1 bg-blue-light/20 text-blue-primary dark:bg-blue-primary/30 dark:text-blue-light"
                        >
                          {tag}
                          <button onClick={() => handleRemoveTagFromTask(tag)}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Select onValueChange={handleAddTagToTask}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Add tag" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTags
                            .filter((tag) => !newTask.tags.includes(tag))
                            .map((tag) => (
                              <SelectItem key={tag} value={tag}>
                                {tag}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2">
                        <Input placeholder="New tag" value={newTag} onChange={(e) => setNewTag(e.target.value)} />
                        <Button type="button" variant="outline" onClick={handleAddTag}>
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={handleAddTask}
                  disabled={!newTask.title}
                  className="bg-blue-primary hover:bg-blue-primary/90 text-white"
                >
                  Add Task
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-lavender dark:bg-blue-primary/30">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-blue-primary data-[state=active]:text-white dark:data-[state=active]:bg-blue-primary"
            >
              All Tasks
            </TabsTrigger>
            <TabsTrigger
              value="todo"
              className="data-[state=active]:bg-blue-primary data-[state=active]:text-white dark:data-[state=active]:bg-blue-primary"
            >
              To Do
            </TabsTrigger>
            <TabsTrigger
              value="in-progress"
              className="data-[state=active]:bg-blue-primary data-[state=active]:text-white dark:data-[state=active]:bg-blue-primary"
            >
              In Progress
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="data-[state=active]:bg-blue-primary data-[state=active]:text-white dark:data-[state=active]:bg-blue-primary"
            >
              Completed
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} allTasks={tasks} />
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-muted-foreground">No tasks found. Try adjusting your filters or add a new task.</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="todo" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tasks.filter((t) => t.status === "todo").length > 0 ? (
                tasks
                  .filter((t) => t.status === "todo")
                  .map((task) => (
                    <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} allTasks={tasks} />
                  ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-muted-foreground">No to-do tasks found.</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="in-progress" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tasks.filter((t) => t.status === "in-progress").length > 0 ? (
                tasks
                  .filter((t) => t.status === "in-progress")
                  .map((task) => (
                    <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} allTasks={tasks} />
                  ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-muted-foreground">No in-progress tasks found.</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="completed" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tasks.filter((t) => t.status === "completed").length > 0 ? (
                tasks
                  .filter((t) => t.status === "completed")
                  .map((task) => (
                    <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} allTasks={tasks} />
                  ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-muted-foreground">No completed tasks found.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

// Task Card Component
function TaskCard({
  task,
  onStatusChange,
  allTasks,
}: {
  task: Task
  onStatusChange: (id: string, status: "todo" | "in-progress" | "completed") => void
  allTasks: Task[]
}) {
  // Get dependency tasks
  const dependencyTasks = allTasks.filter((t) => task.dependencies.includes(t.id))

  // Check if all dependencies are completed
  const canProgress = dependencyTasks.every((t) => t.status === "completed") || dependencyTasks.length === 0

  // Format due date
  const formattedDueDate = new Date(task.dueDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  // Get priority label
  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 3:
        return {
          label: "High",
          color: "bg-blue-primary/20 text-blue-primary dark:bg-blue-primary/30 dark:text-blue-light",
        }
      case 2:
        return {
          label: "Medium",
          color: "bg-blue-medium/20 text-blue-medium dark:bg-blue-medium/30 dark:text-blue-light",
        }
      case 1:
      default:
        return { label: "Low", color: "bg-lavender/50 text-purple dark:bg-lavender/20 dark:text-lavender" }
    }
  }

  const priorityInfo = getPriorityLabel(task.priority)

  return (
    <Card className="border-lavender dark:border-blue-primary/30 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>{task.title}</CardTitle>
          <Badge className={priorityInfo.color}>{priorityInfo.label}</Badge>
        </div>
        <CardDescription>Due: {formattedDueDate}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm">{task.description}</p>

        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {task.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs border-blue-light dark:border-blue-medium">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {dependencyTasks.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-muted-foreground mb-1">Dependencies:</p>
            <div className="flex flex-wrap gap-1">
              {dependencyTasks.map((depTask) => (
                <Badge
                  key={depTask.id}
                  variant={depTask.status === "completed" ? "secondary" : "outline"}
                  className={`text-xs ${depTask.status === "completed" ? "bg-blue-light/20 text-blue-primary dark:bg-blue-primary/30 dark:text-blue-light" : "border-blue-light dark:border-blue-medium"}`}
                >
                  {depTask.status === "completed" && <Check className="mr-1 h-3 w-3" />}
                  {depTask.title}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Select
          value={task.status}
          onValueChange={(value) => onStatusChange(task.id, value as any)}
          disabled={task.status !== "completed" && !canProgress}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in-progress" disabled={!canProgress}>
              In Progress
            </SelectItem>
            <SelectItem value="completed" disabled={!canProgress}>
              Completed
            </SelectItem>
          </SelectContent>
        </Select>
      </CardFooter>
    </Card>
  )
}

