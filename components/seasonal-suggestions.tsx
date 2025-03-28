import Image from "next/image"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Get current season
function getCurrentSeason() {
  const now = new Date()
  const month = now.getMonth()

  if (month >= 2 && month <= 4) return "Spring"
  if (month >= 5 && month <= 7) return "Summer"
  if (month >= 8 && month <= 10) return "Fall"
  return "Winter"
}

// Simulated seasonal product suggestions
function getSeasonalSuggestions() {
  const season = getCurrentSeason()

  const suggestions = {
    Spring: [
      {
        name: "Fresh Produce",
        description: "Seasonal fruits and vegetables are in high demand",
        image: "/placeholder.svg?height=200&width=200&text=Produce",
        trend: "Rising",
      },
      {
        name: "Gardening Supplies",
        description: "Tools and seeds for spring planting",
        image: "/placeholder.svg?height=200&width=200&text=Garden",
        trend: "Rising",
      },
      {
        name: "Allergy Medications",
        description: "Antihistamines and decongestants for seasonal allergies",
        image: "/placeholder.svg?height=200&width=200&text=Allergy",
        trend: "Rising",
      },
    ],
    Summer: [
      {
        name: "Sunscreen",
        description: "High SPF protection for summer sun",
        image: "/placeholder.svg?height=200&width=200&text=Sunscreen",
        trend: "Rising",
      },
      {
        name: "Grilling Supplies",
        description: "Charcoal, propane, and grilling tools",
        image: "/placeholder.svg?height=200&width=200  description: 'Charcoal, propane, and grilling tools",
        image: "/placeholder.svg?height=200&width=200&text=Grill",
        trend: "Rising",
      },
      {
        name: "Insect Repellent",
        description: "Protection against mosquitoes and other summer pests",
        image: "/placeholder.svg?height=200&width=200&text=Repellent",
        trend: "Rising",
      },
    ],
    Fall: [
      {
        name: "School Supplies",
        description: "Notebooks, pens, and backpacks for back to school",
        image: "/placeholder.svg?height=200&width=200&text=School",
        trend: "Rising",
      },
      {
        name: "Cold Medications",
        description: "Remedies for fall cold and flu season",
        image: "/placeholder.svg?height=200&width=200&text=Cold",
        trend: "Rising",
      },
      {
        name: "Halloween Items",
        description: "Decorations, costumes, and candy",
        image: "/placeholder.svg?height=200&width=200&text=Halloween",
        trend: "Rising",
      },
    ],
    Winter: [
      {
        name: "Holiday Decorations",
        description: "Lights, ornaments, and festive decor",
        image: "/placeholder.svg?height=200&width=200&text=Holiday",
        trend: "Rising",
      },
      {
        name: "Winter Clothing",
        description: "Hats, gloves, and warm accessories",
        image: "/placeholder.svg?height=200&width=200&text=Winter",
        trend: "Rising",
      },
      {
        name: "Vitamins & Supplements",
        description: "Immune boosters for cold weather",
        image: "/placeholder.svg?height=200&width=200&text=Vitamins",
        trend: "Rising",
      },
    ],
  }

  return {
    season,
    suggestions: suggestions[season],
  }
}

export function SeasonalSuggestions() {
  const { season, suggestions } = getSeasonalSuggestions()

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Current Season: {season}</h2>
        <p className="text-muted-foreground">Products that typically sell well during this time of year</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {suggestions.map((suggestion, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="relative aspect-video">
              <Image src={suggestion.image || "/placeholder.svg"} alt={suggestion.name} fill className="object-cover" />
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{suggestion.name}</CardTitle>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                >
                  {suggestion.trend}
                </Badge>
              </div>
              <CardDescription>{suggestion.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Similar Products
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="bg-muted p-4 rounded-lg mt-8">
        <h3 className="font-medium mb-2">Recommendation Insights</h3>
        <p className="text-sm text-muted-foreground">
          These recommendations are based on seasonal trends and historical sales data. Consider stocking these items to
          meet customer demand during the {season.toLowerCase()} season.
        </p>
      </div>
    </div>
  )
}

