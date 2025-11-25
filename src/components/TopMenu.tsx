import Link from "next/link";
import { titleFont } from "@/config/fonts";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { logout } from "@/actions/auth";

export const TopMenu = async () => {
  const session = await auth();
  const isAuthenticated = !!session?.user;

  return (
    <nav className="flex justify-between items-center w-full px-5 py-4 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
      <div>
        <Link href="/dashboard">
          <span className={`${titleFont.className} antialiased font-bold text-xl text-primary`}>Micro-Cursos</span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <form action={logout}>
             <Button variant="ghost" size="sm">Salir</Button>
          </form>
        ) : (
          <>
            <Link href="/auth/login">
                <Button variant="ghost" size="sm">Ingresar</Button>
            </Link>
            <Link href="/auth/new-account">
                <Button size="sm">Registrarse</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};
