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
            Aprende más rápido con micro-cursos
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
            Plataforma de microlearning para el aprendizaje corporativo.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/auth/login">
              <Button size="lg" className="text-base">
                Comenzar Ahora
              </Button>
            </Link>
          </div>
        </div>
      </section>

      

      {/* CTA Section */}
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          <h2 className="text-3xl font-bold">Listo para comenzar tu aprendizaje</h2>
          <p className="mt-4 text-muted-foreground">
            Accede a la plataforma para tomar microcursos y mejorar tus habilidades.
          </p>
          <Link href="/auth/login">
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
