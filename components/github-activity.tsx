"use client"

import { useEffect, useState } from "react"
import { GitCommit, GitPullRequest, Star, GitFork, FolderGit2, ExternalLink } from "lucide-react"

interface GitHubEvent {
  id: string
  type: string
  repo: {
    name: string
  }
  created_at: string
  payload: {
    action?: string
    ref_type?: string
  }
}

interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  language: string | null
  updated_at: string
}

export function GitHubActivity() {
  const [events, setEvents] = useState<GitHubEvent[]>([])
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"activity" | "projects">("activity")

  useEffect(() => {
    Promise.all([
      fetch("https://api.github.com/users/caoleduong/events/public").then((res) => res.json()),
      fetch("https://api.github.com/users/caoleduong/repos?sort=updated&per_page=5").then((res) => res.json()),
    ])
      .then(([eventsData, reposData]) => {
        setEvents(eventsData.slice(0, 5))
        setRepos(reposData)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const getEventIcon = (type: string) => {
    switch (type) {
      case "PushEvent":
        return <GitCommit className="w-4 h-4" />
      case "PullRequestEvent":
        return <GitPullRequest className="w-4 h-4" />
      case "WatchEvent":
        return <Star className="w-4 h-4" />
      case "ForkEvent":
        return <GitFork className="w-4 h-4" />
      default:
        return <GitCommit className="w-4 h-4" />
    }
  }

  const getEventText = (event: GitHubEvent) => {
    const repoName = event.repo.name.split("/")[1]
    switch (event.type) {
      case "PushEvent":
        return `Pushed to ${repoName}`
      case "PullRequestEvent":
        return `${event.payload.action} PR in ${repoName}`
      case "WatchEvent":
        return `Starred ${repoName}`
      case "ForkEvent":
        return `Forked ${repoName}`
      case "CreateEvent":
        return `Created ${event.payload.ref_type} in ${repoName}`
      default:
        return `Activity in ${repoName}`
    }
  }

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
    if (seconds < 60) return "just now"
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  const getLanguageColor = (language: string | null) => {
    const colors: Record<string, string> = {
      JavaScript: "#f7df1e",
      TypeScript: "#3178c6",
      Python: "#3572A5",
      Java: "#b07219",
      HTML: "#e34c26",
      CSS: "#563d7c",
      Go: "#00ADD8",
      Rust: "#dea584",
      Ruby: "#701516",
    }
    return colors[language || ""] || "#8b949e"
  }

  if (loading) {
    return (
      <div className="w-full rounded-lg border border-border bg-card/80 backdrop-blur-sm p-6">
        <h2 className="text-sm font-medium text-foreground mb-4">GitHub</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-secondary/50 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full rounded-lg border border-border bg-card/80 backdrop-blur-sm p-6">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => setActiveTab("activity")}
          className={`text-sm font-medium transition-colors ${
            activeTab === "activity" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Recent Activity
        </button>
        <button
          onClick={() => setActiveTab("projects")}
          className={`text-sm font-medium transition-colors ${
            activeTab === "projects" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Projects
        </button>
      </div>

      {activeTab === "activity" ? (
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="flex items-start gap-3 text-sm text-muted-foreground">
              <div className="mt-0.5 text-foreground">{getEventIcon(event.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="truncate">{getEventText(event)}</p>
                <p className="text-xs text-muted-foreground/70">{getTimeAgo(event.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {repos.map((repo) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <FolderGit2 className="w-4 h-4 mt-0.5 text-foreground" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium text-foreground">{repo.name}</p>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {repo.description && <p className="text-xs text-muted-foreground/70 truncate">{repo.description}</p>}
                <div className="flex items-center gap-3 mt-1 text-xs">
                  {repo.language && (
                    <span className="flex items-center gap-1">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getLanguageColor(repo.language) }}
                      />
                      {repo.language}
                    </span>
                  )}
                  {repo.stargazers_count > 0 && (
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {repo.stargazers_count}
                    </span>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
