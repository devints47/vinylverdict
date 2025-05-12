import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface FeatureCardProps {
  title: string
  description: string
  icon: LucideIcon
}

export function FeatureCard({ title, description, icon: Icon }: FeatureCardProps) {
  return (
    <Card className="border border-zinc-800 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-zinc-900/80 to-black/80 backdrop-blur-sm text-white h-full">
      <CardHeader>
        <div className="bg-bright-purple/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-bright-purple" />
        </div>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-zinc-400 text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}
