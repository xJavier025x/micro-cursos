import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Clock, Award, TrendingUp } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="text-center">
          <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-6xl">
            Aprende en minutos, no en horas
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
            Plataforma de microlearning diseñada para el aprendizaje corporativo.
            Toma lecciones cortas de 5-10 minutos y mejora tus habilidades profesionales.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="text-base">
                Comenzar Ahora
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <Clock className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Lecciones Cortas</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Microcursos de 5-10 minutos que se adaptan a tu horario laboral
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Award className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Evaluaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Cuestionarios automáticos para medir tu progreso y retención
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Seguimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Dashboard personalizado para visualizar tu avance y logros
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <GraduationCap className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Contenido Variado</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Aprende con texto, videos interactivos y ejercicios prácticos
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          <h2 className="text-3xl font-bold">Listo para comenzar tu aprendizaje</h2>
          <p className="mt-4 text-muted-foreground">
            Accede a cientos de microcursos y mejora tus habilidades hoy
          </p>
          <Link href="/login">
            <Button size="lg" className="mt-8">
              Acceder a la Plataforma
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-muted-foreground">
          © 2025 MicroLearn. Plataforma de aprendizaje corporativo.
        </div>
      </footer>
    </div>
  )
}
