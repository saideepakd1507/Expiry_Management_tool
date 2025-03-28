import { promises as fs } from "fs"
import path from "path"

// Define the data directory
const DATA_DIR = path.join(process.cwd(), "data")
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json")

// Define settings type
export interface Settings {
  email: string
  notifyDays: number
  enableNotifications: boolean
  enableAutoDelete: boolean
}

// Default settings
const DEFAULT_SETTINGS: Settings = {
  email: "",
  notifyDays: 30,
  enableNotifications: true,
  enableAutoDelete: false,
}

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch (error) {
    console.error("Error creating data directory:", error)
  }
}

// Get settings
export async function getSettings(): Promise<Settings> {
  await ensureDataDir()

  try {
    const data = await fs.readFile(SETTINGS_FILE, "utf8")
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) }
  } catch (error) {
    // If file doesn't exist, return default settings
    return DEFAULT_SETTINGS
  }
}

// Save settings
export async function saveSettings(settings: Partial<Settings>): Promise<Settings> {
  await ensureDataDir()

  const currentSettings = await getSettings()
  const newSettings = { ...currentSettings, ...settings }

  await fs.writeFile(SETTINGS_FILE, JSON.stringify(newSettings, null, 2), "utf8")

  return newSettings
}

