import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface TestimonialProps {
  quote: string
  name: string
  title: string
  avatar: string
}

export function Testimonial({ quote, name, title, avatar }: TestimonialProps) {
  // Ensure we have a valid image source or use a placeholder
  const imageSrc = avatar && avatar.trim() !== "" ? avatar : "/diverse-group.png"

  return (
    <Card className="border-none shadow-lg bg-zinc-900 text-white h-full flex flex-col">
      <CardContent className="pt-6 pb-2 flex-grow">
        <div className="relative">
          <span className="absolute -top-6 -left-2 text-6xl text-spotify-green opacity-30">"</span>
          <p className="relative z-10 italic text-zinc-300">{quote}</p>
        </div>
      </CardContent>
      <CardFooter className="flex items-center gap-4 pt-2 mt-auto">
        <Avatar>
          <AvatarImage src={imageSrc || "/placeholder.svg"} alt={name} />
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
