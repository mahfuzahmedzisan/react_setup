import { Link } from 'react-router-dom'
import { ArrowRight, ShoppingBag } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useFeaturedProducts } from '@/features/products/useFeaturedProducts'

export default function Home() {
  const { data: products = [] } = useFeaturedProducts()

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShoppingBag className="h-4 w-4" />
            </span>
            <span>React + Vite + Laravel</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm md:flex">
            <a className="text-muted-foreground hover:text-foreground" href="#categories">
              Categories
            </a>
            <a className="text-muted-foreground hover:text-foreground" href="#featured">
              Featured
            </a>
            <Link className="text-muted-foreground hover:text-foreground" to="/account">
              Account
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild type="button">
              <Link to="/cart">Cart</Link>
            </Button>
            <Button asChild type="button">
              <Link to="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,hsla(var(--primary)/0.18),transparent_55%)]" />
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2 md:items-center md:py-20">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">New season</Badge>
                <span className="text-sm text-muted-foreground">
                  Fast delivery • Easy returns • Secure checkout
                </span>
              </div>
              <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
                Everything you need for a modern lifestyle.
              </h1>
              <p className="max-w-prose text-pretty text-muted-foreground">
                Discover curated essentials, trending picks, and deals that feel too good to be true.
                Built for speed, designed for trust.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="button" className="gap-2">
                  Shop featured <ArrowRight className="h-4 w-4" />
                </Button>
                <Button type="button" variant="outline">
                  Browse categories
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-2 text-sm">
                <div className="rounded-lg border bg-card p-3">
                  <div className="text-lg font-semibold">24h</div>
                  <div className="text-muted-foreground">Dispatch</div>
                </div>
                <div className="rounded-lg border bg-card p-3">
                  <div className="text-lg font-semibold">7d</div>
                  <div className="text-muted-foreground">Returns</div>
                </div>
                <div className="rounded-lg border bg-card p-3">
                  <div className="text-lg font-semibold">100%</div>
                  <div className="text-muted-foreground">Secure</div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {products.slice(0, 4).map((p) => (
                <Card key={p.id} className="overflow-hidden">
                  <CardHeader className="space-y-2">
                    <CardTitle className="text-base">{p.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{p.subtitle ?? 'Limited stock available'}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="h-24 rounded-md bg-[linear-gradient(135deg,hsla(var(--primary)/0.15),transparent_60%)]" />
                  </CardContent>
                  <CardFooter className="justify-between">
                    <span className="text-sm font-semibold">${p.price.amount}</span>
                    <Button size="sm" variant="secondary" type="button">
                      Add
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="categories" className="mx-auto max-w-6xl px-4 py-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Shop by category</h2>
              <p className="text-sm text-muted-foreground">Find what you love, faster.</p>
            </div>
            <Button variant="ghost" type="button">
              View all
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {['Men', 'Women', 'Accessories', 'Home'].map((c) => (
              <a
                key={c}
                href="#featured"
                className="group rounded-xl border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-sm"
              >
                <div className="mb-4 h-10 w-10 rounded-lg bg-[hsla(var(--primary)/0.12)]" />
                <div className="font-semibold">{c}</div>
                <div className="text-sm text-muted-foreground group-hover:text-foreground/80">
                  Explore →
                </div>
              </a>
            ))}
          </div>
        </section>

        <section id="featured" className="mx-auto max-w-6xl px-4 pb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">Featured products</h2>
            <p className="text-sm text-muted-foreground">
              Popular right now. Updated daily.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 6).map((p, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="mb-4 h-36 rounded-lg bg-[linear-gradient(135deg,hsla(var(--primary)/0.18),transparent_65%)]" />
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-sm text-muted-foreground">{p.subtitle ?? 'Best seller'}</div>
                    </div>
                    {p.badge ? <Badge>{p.badge}</Badge> : null}
                  </div>
                </CardContent>
                <CardFooter className="justify-between">
                  <span className="text-sm font-semibold">${p.price.amount}</span>
                  <Button size="sm" type="button">
                    Add to cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-10 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} React + Vite + Laravel. All rights reserved.</div>
          <div className="flex gap-4">
            <a className="hover:text-foreground" href="#">
              Privacy
            </a>
            <a className="hover:text-foreground" href="#">
              Terms
            </a>
            <a className="hover:text-foreground" href="#">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

