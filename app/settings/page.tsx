"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { saveSettings, getSettings } from "@/lib/products"

export default function SettingsPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [settings, setSettings] = useState({
    email: "",
    notifyDays: 30,
    enableNotifications: true,
    enableAutoDelete: false,
  })

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await getSettings()
        setSettings(savedSettings)
      } catch (error) {
        console.error("Error loading settings:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load settings. Using defaults.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setSettings((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "notifyDays"
            ? Number.parseInt(value) || 30 // Ensure it's a valid number or default to 30
            : value,
    }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await saveSettings(settings)
      toast({
        title: "Settings saved",
        description: "Your settings have been successfully saved",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save settings. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-pulse">Loading settings...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="notifications">
        <TabsList className="mb-4">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you want to be notified about expiring products</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={settings.email}
                  onChange={handleChange}
                />
                <p className="text-sm text-muted-foreground">
                  You will receive detailed product expiry notifications at this email address
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notifyDays">Notification Days</Label>
                <Input
                  id="notifyDays"
                  name="notifyDays"
                  type="number"
                  min="1"
                  max="90"
                  placeholder="Days before expiry to notify"
                  value={settings.notifyDays.toString()}
                  onChange={handleChange}
                />
                <p className="text-sm text-muted-foreground">
                  You will be notified when products are this many days from expiring
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableNotifications">Enable Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive email notifications about expiring products</p>
                </div>
                <Switch
                  id="enableNotifications"
                  checked={settings.enableNotifications}
                  onCheckedChange={(checked) => handleSwitchChange("enableNotifications", checked)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage general application settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableAutoDelete">Auto-Delete Expired Products</Label>
                  <p className="text-sm text-muted-foreground">Automatically delete products after they expire</p>
                </div>
                <Switch
                  id="enableAutoDelete"
                  checked={settings.enableAutoDelete}
                  onCheckedChange={(checked) => handleSwitchChange("enableAutoDelete", checked)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Configure advanced application settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No advanced settings available yet.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

