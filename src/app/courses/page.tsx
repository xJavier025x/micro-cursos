import Link from 'next/link';
import { Clock, Book, BookOpen } from 'lucide-react';
import { getCoursesWithProgress } from '@/actions/courses';
import { getCurrentUser } from '@/actions/users';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function CoursesPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  const result = await getCoursesWithProgress(user.id);

  if ('error' in result) {
    return <div className="p-8 text-center text-destructive">Error al cargar los cursos</div>;
  }

  const { courses } = result;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <main className="max-w-7xl mx-auto space-y-8">
        <header>
          <h2 className="text-3xl font-bold tracking-tight">Catálogo de Cursos</h2>
          <p className="text-muted-foreground">Explora y aprende nuevas habilidades en minutos.</p>
        </header>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hay cursos disponibles en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="flex flex-col overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-40 bg-muted flex items-center justify-center text-muted-foreground">
                  <Book size={40} />
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <BookOpen size={14} />
                      <span>{course.totalLessons} Lecciones</span>
                    </div>
                    {course.progress > 0 && (
                       <Badge variant="secondary">{course.progress}% Completado</Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/courses/${course.id}`} className="w-full">
                    <Button className="w-full" variant={course.progress > 0 ? "secondary" : "default"}>
                        {course.progress > 0 ? 'Continuar' : 'Empezar Curso'}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
