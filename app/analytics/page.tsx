"use client"

import { useState, useEffect } from "react"
import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false)
  const [timeRange, setTimeRange] = useState("week")

  // Handle mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Sample data for analytics
  const taskCompletionData = [
    { name: "Mon", completed: 5, pending: 3 },
    { name: "Tue", completed: 7, pending: 4 },
    { name: "Wed", completed: 4, pending: 6 },
    { name: "Thu", completed: 8, pending: 2 },
    { name: "Fri", completed: 6, pending: 3 },
    { name: "Sat", completed: 3, pending: 1 },
    { name: "Sun", completed: 2, pending: 2 },
  ]

  const taskCategoryData = [
    { name: "Development", value: 40 },
    { name: "Design", value: 25 },
    { name: "Research", value: 15 },
    { name: "Marketing", value: 20 },
  ]

  const productivityData = [
    { name: "Week 1", productivity: 65 },
    { name: "Week 2", productivity: 72 },
    { name: "Week 3", productivity: 68 },
    { name: "Week 4", productivity: 80 },
  ]

  const COLORS = ["#5680E9", "#84CEEB", "#5AB9EA", "#C1C8E4", "#8860D0"]

  if (!mounted) return null

  return (
    <main className="container mx-auto py-8 px-4 min-h-screen">
      <AppHeader activePage="analytics" />

      <div className="flex flex-col space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold text-blue-primary dark:text-blue-light">Analytics</h1>
            <p className="text-muted-foreground">Track your productivity and task completion metrics</p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <CardDescription>All tasks in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
              <CardDescription>Tasks marked as done</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <CardDescription>Currently ongoing projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Productivity Score</CardTitle>
              <CardDescription>Overall efficiency rating</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">76%</div>
              <p className="text-xs text-muted-foreground">+5% from last month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="bg-lavender dark:bg-blue-primary/30">
            <TabsTrigger
              value="tasks"
              className="data-[state=active]:bg-blue-primary data-[state=active]:text-white dark:data-[state=active]:bg-blue-primary"
            >
              Task Completion
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              className="data-[state=active]:bg-blue-primary data-[state=active]:text-white dark:data-[state=active]:bg-blue-primary"
            >
              Task Categories
            </TabsTrigger>
            <TabsTrigger
              value="productivity"
              className="data-[state=active]:bg-blue-primary data-[state=active]:text-white dark:data-[state=active]:bg-blue-primary"
            >
              Productivity Trends
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tasks" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Completion Rate</CardTitle>
                <CardDescription>Number of completed vs pending tasks over time</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={taskCompletionData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="completed" stackId="a" fill="#5680E9" name="Completed" />
                      <Bar dataKey="pending" stackId="a" fill="#C1C8E4" name="Pending" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="categories" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Distribution by Category</CardTitle>
                <CardDescription>Breakdown of tasks by their categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={taskCategoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {taskCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="productivity" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Productivity Trends</CardTitle>
                <CardDescription>Weekly productivity score over time</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={productivityData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="productivity" stroke="#5680E9" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

