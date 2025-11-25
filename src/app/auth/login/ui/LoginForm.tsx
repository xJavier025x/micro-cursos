"use client";

import { useEffect } from 'react';
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";

import { authenticate } from "@/actions/auth";
import { IoInformationOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const LoginForm = () => {
  const [state, dispatch] = useFormState(authenticate, undefined);

  useEffect(() => {
    if ( state === 'Success' ) {
      window.location.replace('/dashboard');
    }
  },[state]);

  return (
    <Card className="w-full shadow-md">
        <CardHeader>
            <CardTitle className="text-2xl text-center font-bold">Iniciar Sesión</CardTitle>
        </CardHeader>
        <CardContent>
            <form action={dispatch} className="flex flex-col gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="m@example.com"
                        required
                    />
                </div>
                
                <div className="grid gap-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        required
                    />
                </div>

                <div
                    className="flex h-8 items-end space-x-1"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {state === "CredentialsSignin" && (
                    <div className="flex flex-row mb-2 items-center gap-2">
                        <IoInformationOutline className="h-5 w-5 text-destructive" />
                        <p className="text-sm text-destructive">
                        Credenciales incorrectas
                        </p>
                    </div>
                    )}
                </div>

                <LoginButton />
            </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
             <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                    O
                    </span>
                </div>
            </div>
            <Link href="/auth/new-account" className="w-full">
                <Button variant="outline" className="w-full">
                    Crear una nueva cuenta
                </Button>
            </Link>
        </CardFooter>
    </Card>
  );
};

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button 
      type="submit" 
      className="w-full"
      disabled={ pending }
    >
      { pending ? "Ingresando..." : "Ingresar" }
    </Button>
  );
}
