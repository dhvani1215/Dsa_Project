import Link from "next/link"
import Image from "next/image"
import { Frame } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AppHeader({ activePage }: { activePage: string }) {
  return (
    <header className="flex items-center h-16 px-4 border-b shrink-0 md:px-6 mb-8">
      <Link href="/" className="flex items-center gap-2 text-lg font-semibold sm:text-base mr-4">
        <Frame className="w-6 h-6 text-blue-primary dark:text-blue-light" />
        <span className="font-bold text-blue-primary dark:text-blue-light">TaskFlow</span>
      </Link>
      <nav className="hidden font-medium sm:flex flex-row items-center gap-5 text-sm lg:gap-6">
        <Link
          href="/"
          className={
            activePage === "dashboard"
              ? "font-bold text-blue-primary dark:text-blue-light"
              : "text-muted-foreground hover:text-blue-primary dark:hover:text-blue-light"
          }
        >
          Dashboard
        </Link>
        <Link
          href="/projects"
          className={
            activePage === "projects"
              ? "font-bold text-blue-primary dark:text-blue-light"
              : "text-muted-foreground hover:text-blue-primary dark:hover:text-blue-light"
          }
        >
          Projects
        </Link>
        <Link
          href="/analytics"
          className={
            activePage === "analytics"
              ? "font-bold text-blue-primary dark:text-blue-light"
              : "text-muted-foreground hover:text-blue-primary dark:hover:text-blue-light"
          }
        >
          Analytics
        </Link>
        <Link
          href="/settings"
          className={
            activePage === "settings"
              ? "font-bold text-blue-primary dark:text-blue-light"
              : "text-muted-foreground hover:text-blue-primary dark:hover:text-blue-light"
          }
        >
          Settings
        </Link>
      </nav>
      <div className="flex items-center w-full gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <Button variant="ghost" size="icon" className="rounded-full ml-auto">
          <Image
            src="/placeholder.svg?height=32&width=32"
            width="32"
            height="32"
            className="rounded-full border"
            alt="Avatar"
          />
          <span className="sr-only">User menu</span>
        </Button>
      </div>
    </header>
  )
}

