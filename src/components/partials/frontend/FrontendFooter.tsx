export function FrontendFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-muted-foreground">
        © {new Date().getFullYear()} React + Vite + Laravel
      </div>
    </footer>
  )
}

