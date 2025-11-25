import { Users, BookOpen, BarChart3 } from 'lucide-react';
import { getAdminDashboardMetrics } from '@/actions/dashboards';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboardPage() {
  const metrics = await getAdminDashboardMetrics();

  if ('error' in metrics) {
    return <div className="p-8 text-center text-destructive">Error al cargar el dashboard</div>;
  }

  return (
    <div className="space-y-8">
        <header>
          <h2 className="text-3xl font-bold tracking-tight">Resumen General</h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios Totales</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.usersCount}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.usersByRole?.EMPLOYEE || 0} Estudiantes | {metrics.usersByRole?.ADMIN || 0} Admins
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cursos Publicados</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.coursesCount}</div>
              <p className="text-xs text-muted-foreground">{metrics.lessonsCount} Lecciones en total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promedio General Quiz</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.averageScore}%</div>
              <p className="text-xs text-muted-foreground">Basado en {metrics.quizResultsCount} resultados</p>
            </CardContent>
          </Card>
        </div>
    </div>
  );
}
