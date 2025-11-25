import Link from 'next/link';
import { BookOpen, Award, Clock } from 'lucide-react';
import { getUserDashboardData } from '@/actions/dashboards';
import { getCurrentUser } from '@/actions/users';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  const dashboardData = await getUserDashboardData(user.id);

  if ('error' in dashboardData) {
    return <div className="p-8 text-center text-destructive">Error al cargar el dashboard</div>;
  }

  const { courses, lastQuizResult, summary } = dashboardData;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <main className="max-w-7xl mx-auto space-y-8">
        <header>
          <h2 className="text-3xl font-bold tracking-tight">Hola, {user.name || 'Usuario'}</h2>
          <p className="text-muted-foreground">Aquí está tu resumen de aprendizaje.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lecciones Completadas</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.completedLessons}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Último Quiz</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lastQuizResult ? `${lastQuizResult.score}%` : '-'}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cursos Activos</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.activeCourses}</div>
            </CardContent>
          </Card>
        </div>

        <section className="space-y-4">
          <h3 className="text-xl font-bold tracking-tight">Mis Cursos</h3>
          {courses.length === 0 ? (
             <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                   <p className="text-muted-foreground mb-4">No estás inscrito en ningún curso aún.</p>
                   <Link href="/courses">
                     <Button>Explorar Catálogo</Button>
                   </Link>
                </CardContent>
             </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-32 bg-muted flex items-center justify-center text-muted-foreground">
                    <BookOpen size={32} />
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Progress value={course.progress} className="h-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{course.progress}% Completado</span>
                      <Link href={`/courses/${course.id}`}>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                            Continuar
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
