"use client"

import { useState, useEffect } from "react"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "next-themes"

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  const [userSettings, setUserSettings] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "Software developer with expertise in DSA and web development.",
    notifications: {
      email: true,
      push: true,
      taskReminders: true,
      updates: false,
    },
    appearance: {
      theme: "system",
      fontSize: "medium",
      reducedMotion: false,
    },
  })

  // Handle mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle theme change
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    setUserSettings({
      ...userSettings,
      appearance: {
        ...userSettings.appearance,
        theme: newTheme,
      },
    })
  }

  // Handle notification toggle
  const handleNotificationToggle = (key: keyof typeof userSettings.notifications) => {
    setUserSettings({
      ...userSettings,
      notifications: {
        ...userSettings.notifications,
        [key]: !userSettings.notifications[key],
      },
    })
  }

  // Handle profile update
  const handleProfileUpdate = () => {
    // In a real app, this would save to a database
    alert("Profile updated successfully!")
  }

  if (!mounted) return null

  return (
    <main className="container mx-auto py-8 px-4 min-h-screen">
      <AppHeader activePage="settings" />

      <div className="flex flex-col space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold text-blue-primary dark:text-blue-light">Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences and application settings</p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="bg-lavender dark:bg-blue-primary/30">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-blue-primary data-[state=active]:text-white dark:data-[state=active]:bg-blue-primary"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-blue-primary data-[state=active]:text-white dark:data-[state=active]:bg-blue-primary"
            >
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value="appearance"
              className="data-[state=active]:bg-blue-primary data-[state=active]:text-white dark:data-[state=active]:bg-blue-primary"
            >
              Appearance
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-blue-primary data-[state=active]:text-white dark:data-[state=active]:bg-blue-primary"
            >
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and public profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={userSettings.name}
                      onChange={(e) => setUserSettings({ ...userSettings, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userSettings.email}
                      onChange={(e) => setUserSettings({ ...userSettings, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={userSettings.bio}
                    onChange={(e) => setUserSettings({ ...userSettings, bio: e.target.value })}
                    className="min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Brief description for your profile. URLs are hyperlinked.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleProfileUpdate} className="bg-blue-primary hover:bg-blue-primary/90 text-white">
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Configure how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={userSettings.notifications.email}
                    onCheckedChange={() => handleNotificationToggle("email")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                  </div>
                  <Switch
                    checked={userSettings.notifications.push}
                    onCheckedChange={() => handleNotificationToggle("push")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Task Reminders</Label>
                    <p className="text-sm text-muted-foreground">Get reminders about upcoming and overdue tasks</p>
                  </div>
                  <Switch
                    checked={userSettings.notifications.taskReminders}
                    onCheckedChange={() => handleNotificationToggle("taskReminders")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Product Updates</Label>
                    <p className="text-sm text-muted-foreground">Receive updates about new features and improvements</p>
                  </div>
                  <Switch
                    checked={userSettings.notifications.updates}
                    onCheckedChange={() => handleNotificationToggle("updates")}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-blue-primary hover:bg-blue-primary/90 text-white">Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize how the application looks and feels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select value={userSettings.appearance.theme} onValueChange={handleThemeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Choose between light, dark, or system default theme</p>
                </div>
                <div className="space-y-2">
                  <Label>Font Size</Label>
                  <Select
                    value={userSettings.appearance.fontSize}
                    onValueChange={(value) =>
                      setUserSettings({
                        ...userSettings,
                        appearance: { ...userSettings.appearance, fontSize: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select font size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Reduced Motion</Label>
                    <p className="text-sm text-muted-foreground">Minimize animations for accessibility</p>
                  </div>
                  <Switch
                    checked={userSettings.appearance.reducedMotion}
                    onCheckedChange={(checked) =>
                      setUserSettings({
                        ...userSettings,
                        appearance: { ...userSettings.appearance, reducedMotion: checked },
                      })
                    }
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-blue-primary hover:bg-blue-primary/90 text-white">Save Appearance</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your password and account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  <div className="grid gap-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable 2FA</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-medium">Sessions</h3>
                  <Button variant="outline" className="w-full">
                    Log out from all devices
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-blue-primary hover:bg-blue-primary/90 text-white">
                  Update Security Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

