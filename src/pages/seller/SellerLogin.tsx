import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SellerLogin() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-5xl items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Seller sign in</CardTitle>
          <CardDescription>Role-specific fallback page for seller routes.</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button asChild type="button">
            <Link to="/login">Go to login</Link>
          </Button>
          <Button asChild variant="outline" type="button">
            <Link to="/">Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

