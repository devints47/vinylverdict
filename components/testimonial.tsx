import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface TestimonialProps {
  quote: string
  name: string
  title: string
  avatar: string
}

export function Testimonial({ quote, name, title, avatar }: TestimonialProps) {
  return (
    <Card className="border-none shadow-lg bg-zinc-900 text-white">
      <CardContent className="pt-6">
        <div className="relative">
          <span className="absolute -top-6 -left-2 text-6xl text-spotify-green opacity-30">"</span>
          <p className="relative z-10 italic text-zinc-300">{quote}</p>
        </div>
      </CardContent>
      <CardFooter className="flex items-center gap-4 pt-4">
        <Avatar>
          <AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-zinc-400">{title}</p>
        </div>
      </CardFooter>
    </Card>
  )
}
