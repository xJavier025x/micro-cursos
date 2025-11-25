import Link from 'next/link';
import { ChevronLeft, PlayCircle, CheckCircle, Lock } from 'lucide-react';
import { getUserCourseDetail } from '@/actions/dashboards';
import { getCurrentUser } from '@/actions/users';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  const course = await getUserCourseDetail(user.id, courseId);

  if (!course) {
    return <div className="p-8 text-center text-destructive">Curso no encontrado</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <main className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-4">
            <Link href="/courses">
                <Button variant="ghost" size="icon">
                    <ChevronLeft className="h-4 w-4" />
                </Button>
            </Link>
            <h1 className="text-xl font-bold">Detalles del Curso</h1>
        </div>

        <Card className="overflow-hidden">
          <div className="h-48 bg-primary p-8 flex flex-col justify-end text-primary-foreground">
            <h2 className="text-3xl font-bold mb-2">{course.title}</h2>
            <p className="opacity-90">{course.description}</p>
          </div>
          
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Contenido del Curso</h3>
              <span className="text-sm text-muted-foreground">{course.lessons.length} Lecciones</span>
            </div>

            <div className="space-y-3">
              {course.lessons.map((lesson, index) => (
                <Link 
                  key={lesson.id}
                  href={`/courses/${courseId}/lessons/${lesson.id}`}
                  className="block"
                >
                    <div className="flex items-center p-4 rounded-lg border hover:bg-muted/50 transition-colors group">
                        <div className="mr-4 text-muted-foreground group-hover:text-primary">
                            {lesson.isCompleted ? (
                            <CheckCircle size={24} className="text-green-500" />
                            ) : (
                            <PlayCircle size={24} />
                            )}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-medium group-hover:text-primary transition-colors">
                            Lección {index + 1}: {lesson.title}
                            </h4>
                            {lesson.hasQuiz && (
                            <Badge variant="secondary" className="mt-1">
                                Quiz
                            </Badge>
                            )}
                        </div>
                        <div className="text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            {lesson.isCompleted ? 'Repasar' : 'Iniciar'}
                        </div>
                    </div>
                </Link>
              ))}
              {course.lessons.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No hay lecciones disponibles aún.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
