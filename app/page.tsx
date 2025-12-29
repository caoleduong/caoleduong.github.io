import { Instagram, Github, Globe } from "lucide-react"
import { TikTokIcon } from "@/components/tiktok-icon"
import { GitHubActivity } from "@/components/github-activity"
import { CircuitBackground } from "@/components/circuit-background"

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/reagancao/",
    icon: Instagram,
  },
  {
    name: "GitHub",
    href: "https://github.com/caoleduong",
    icon: Github,
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@reagan.cao",
    icon: TikTokIcon,
  },
  {
    name: "Website",
    href: "https://caoleduong.github.io/",
    icon: Globe,
  },
]

export default function LinksPage() {
  return (
    <>
      <CircuitBackground />
      <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm flex flex-col items-center gap-8">
          <div className="text-center">
            <h1 className="text-2xl font-medium tracking-tight text-foreground">Reagan Cao</h1>
            <p className="mt-2 text-muted-foreground text-sm">San Diego, CA</p>
          </div>

          <nav className="w-full flex flex-col gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 w-full px-6 py-4 border border-border rounded-lg bg-card/80 backdrop-blur-sm text-card-foreground transition-all duration-200 hover:bg-secondary/80 hover:border-muted-foreground/30"
              >
                <link.icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="font-medium">{link.name}</span>
              </a>
            ))}
          </nav>

          <GitHubActivity />
        </div>
      </main>
    </>
  )
}
