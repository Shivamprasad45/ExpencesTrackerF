"use client"

import type { Experience } from "@/lib/experiencesApi"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Star, Calendar, Edit, Trash2, Heart } from "lucide-react"
import { format } from "date-fns"

interface ExperienceCardProps {
  experience: Experience
  onEdit?: (experience: Experience) => void
  onDelete?: (id: string) => void
  compact?: boolean
}

const moodColors = {
  Energized: "bg-green-100 text-green-800",
  Focused: "bg-blue-100 text-blue-800",
  Creative: "bg-purple-100 text-purple-800",
  Confident: "bg-orange-100 text-orange-800",
  Neutral: "bg-gray-100 text-gray-800",
  Relaxed: "bg-teal-100 text-teal-800",
  Excited: "bg-yellow-100 text-yellow-800",
}

export function ExperienceCard({ experience, onEdit, onDelete, compact = false }: ExperienceCardProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg leading-tight">{experience.title}</h3>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(new Date(experience.date), "MMM d, yyyy")}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatDuration(experience.duration)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onEdit && (
              <Button variant="ghost" size="sm" onClick={() => onEdit(experience)}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(experience.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {!compact && <p className="text-sm text-muted-foreground line-clamp-2">{experience.description}</p>}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{experience.category}</Badge>
            <Badge className={moodColors[experience.mood as keyof typeof moodColors] || moodColors.Neutral}>
              <Heart className="h-3 w-3 mr-1" />
              {experience.mood}
            </Badge>
          </div>

          <div className="flex items-center gap-1">{renderStars(experience.rating)}</div>
        </div>

        {experience.location && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {experience.location}
          </div>
        )}

        {experience.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {experience.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
