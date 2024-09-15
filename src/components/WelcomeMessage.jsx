import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

function WelcomeMessage() {
  return (
    <Card className="w-full max-w-2xl text-center">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Welcome to My Personal Website</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg">
          Hi, I'm [Your Name]. I'm a [Your Profession] based in [Your Location].
        </p>
      </CardContent>
    </Card>
  )
}

export default WelcomeMessage