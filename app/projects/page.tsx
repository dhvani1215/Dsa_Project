"use client"

import { useState, useEffect } from "react"
import { Plus, Folder, Users, Search } from "lucide-react"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

// Project interface
interface Project {
  id: string
  title: string
  description: string
  category: string
  progress: number
  members: number
  dueDate: Date
  tasks: number
  completedTasks: number
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newProject, setNewProject] = useState<Omit<Project, "id" | "progress" | "completedTasks">>({
    title: "",
    description: "",
    category: "development",
    members: 1,
    dueDate: new Date(Date.now() + 86400000 * 14), // 14 days from now
    tasks: 0,
  })
  const [mounted, setMounted] = useState(false)

  // Handle mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load initial demo projects
  useEffect(() => {
    const demoProjects: Project[] = [
      {
        id: "1",
        title: "Task Management System",
        description: "A DSA-powered task management system with efficient algorithms",
        category: "development",
        progress: 65,
        members: 3,
        dueDate: new Date(Date.now() + 86400000 * 7), // 7 days from now
        tasks: 12,
        completedTasks: 8,
      },
      {
        id: "2",
        title: "Portfolio Website",
        description: "Personal portfolio website to showcase projects and skills",
        category: "design",
        progress: 40,
        members: 1,
        dueDate: new Date(Date.now() + 86400000 * 10), // 10 days from now
        tasks: 10,
        completedTasks: 4,
      },
      {
        id: "3",
        title: "E-commerce Platform",
        description: "Online shopping platform with product catalog and payment integration",
        category: "development",
        progress: 25,
        members: 4,
        dueDate: new Date(Date.now() + 86400000 * 21), // 21 days from now
        tasks: 20,
        completedTasks: 5,
      },
      {
        id: "4",
        title: "Mobile App UI Design",
        description: "User interface design for a fitness tracking mobile application",
        category: "design",
        progress: 80,
        members: 2,
        dueDate: new Date(Date.now() + 86400000 * 3), // 3 days from now
        tasks: 8,
        completedTasks: 6,
      },
    ]

    setProjects(demoProjects)
  }, [])

  // Filter projects based on search query
  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle adding a new project
  const handleAddProject = () => {
    const project: Project = {
      ...newProject,
      id: Date.now().toString(),
      progress: 0,
      completedTasks: 0,
    }

    setProjects([...projects, project])

    // Reset form
    setNewProject({
      title: "",
      description: "",
      category: "development",
      members: 1,
      dueDate: new Date(Date.now() + 86400000 * 14),
      tasks: 0,
    })

    setIsDialogOpen(false)
  }

  if (!mounted) return null

  return (
    <main className="container mx-auto py-8 px-4 min-h-screen">
      <AppHeader activePage="projects" />

      <div className="flex flex-col space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold text-blue-primary dark:text-blue-light">Projects</h1>
            <p className="text-muted-foreground">Manage and track all your ongoing projects</p>
          </div>
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search projects..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-primary hover:bg-blue-primary/90 text-white">
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>Add a new project to your workspace</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Select
                    value={newProject.category}
                    onValueChange={(value) => setNewProject({ ...newProject, category: value })}
                  >
                    <SelectTrigger id="category" className="col-span-3">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="research">Research</SelectItem>
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
                    value={new Date(newProject.dueDate).toISOString().split("T")[0]}
                    onChange={(e) => setNewProject({ ...newProject, dueDate: new Date(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="members" className="text-right">
                    Team Members
                  </Label>
                  <Input
                    id="members"
                    type="number"
                    min="1"
                    max="10"
                    value={newProject.members}
                    onChange={(e) => setNewProject({ ...newProject, members: Number.parseInt(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={handleAddProject}
                  disabled={!newProject.title}
                  className="bg-blue-primary hover:bg-blue-primary/90 text-white"
                >
                  Create Project
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
              All Projects
            </TabsTrigger>
            <TabsTrigger
              value="development"
              className="data-[state=active]:bg-blue-primary data-[state=active]:text-white dark:data-[state=active]:bg-blue-primary"
            >
              Development
            </TabsTrigger>
            <TabsTrigger
              value="design"
              className="data-[state=active]:bg-blue-primary data-[state=active]:text-white dark:data-[state=active]:bg-blue-primary"
            >
              Design
            </TabsTrigger>
            <TabsTrigger
              value="other"
              className="data-[state=active]:bg-blue-primary data-[state=active]:text-white dark:data-[state=active]:bg-blue-primary"
            >
              Other
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => <ProjectCard key={project.id} project={project} />)
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-muted-foreground">
                    No projects found. Try adjusting your search or create a new project.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="development" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.filter((p) => p.category === "development").length > 0 ? (
                filteredProjects
                  .filter((p) => p.category === "development")
                  .map((project) => <ProjectCard key={project.id} project={project} />)
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-muted-foreground">No development projects found.</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="design" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.filter((p) => p.category === "design").length > 0 ? (
                filteredProjects
                  .filter((p) => p.category === "design")
                  .map((project) => <ProjectCard key={project.id} project={project} />)
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-muted-foreground">No design projects found.</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="other" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.filter((p) => p.category !== "development" && p.category !== "design").length > 0 ? (
                filteredProjects
                  .filter((p) => p.category !== "development" && p.category !== "design")
                  .map((project) => <ProjectCard key={project.id} project={project} />)
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-muted-foreground">No other projects found.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

// Project Card Component
function ProjectCard({ project }: { project: Project }) {
  // Format due date
  const formattedDueDate = new Date(project.dueDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  // Get category badge color
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "development":
        return "bg-blue-primary/20 text-blue-primary dark:bg-blue-primary/30 dark:text-blue-light"
      case "design":
        return "bg-purple/20 text-purple dark:bg-purple/30 dark:text-lavender"
      case "marketing":
        return "bg-blue-medium/20 text-blue-medium dark:bg-blue-medium/30 dark:text-blue-light"
      default:
        return "bg-lavender/50 text-purple dark:bg-lavender/20 dark:text-lavender"
    }
  }

  return (
    <Card className="border-lavender dark:border-blue-primary/30 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{project.title}</CardTitle>
          <Badge className={getCategoryBadge(project.category)}>
            {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
          </Badge>
        </div>
        <CardDescription>Due: {formattedDueDate}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm mb-4">{project.description}</p>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />

          <div className="flex justify-between items-center text-sm pt-2">
            <div className="flex items-center gap-2">
              <Folder className="h-4 w-4 text-blue-primary dark:text-blue-light" />
              <span>
                {project.completedTasks}/{project.tasks} tasks
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-primary dark:text-blue-light" />
              <span>{project.members} members</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}

