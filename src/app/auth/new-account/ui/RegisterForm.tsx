"use client";

import clsx from 'clsx';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';
import { login, registerUser } from '@/actions/auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type FormInputs = {
  name: string;
  email: string;
  password: string;  
}

export const RegisterForm = () => {

  const [errorMessage, setErrorMessage] = useState('')
  const { register, handleSubmit, formState: {errors} } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async(data) => {
    setErrorMessage('');
    const { name, email, password } = data;
    
    // Server action
    const resp = await registerUser( name, email, password );

    if ( !resp.ok ) {
      setErrorMessage( resp.message );
      return;
    }

    await login( email.toLowerCase(), password );
    window.location.replace('/');
  }

  return (
    <Card className="w-full shadow-md">
        <CardHeader>
            <CardTitle className="text-2xl text-center font-bold">Nueva cuenta</CardTitle>
        </CardHeader>
        <CardContent>
            <form onSubmit={ handleSubmit( onSubmit ) } className="flex flex-col gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input
                        id="name"
                        type="text"
                        autoFocus
                        className={clsx({'border-destructive': errors.name})}
                        { ...register('name', { required: true }) }
                    />
                    {errors.name && <span className="text-xs text-destructive">El nombre es obligatorio</span>}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                        id="email"
                        type="email"
                        className={clsx({'border-destructive': errors.email})}
                        { ...register('email', { required: true, pattern: /^\S+@\S+$/i }) }
                    />
                     {errors.email && <span className="text-xs text-destructive">Correo inválido</span>}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                        id="password"
                        type="password"
                        className={clsx({'border-destructive': errors.password})}
                        { ...register('password', { required: true, minLength: 6 }) }
                    />
                    {errors.password && <span className="text-xs text-destructive">Mínimo 6 caracteres</span>}
                </div>
                
                {errorMessage && (
                    <div className="text-sm text-destructive font-medium text-center">
                        { errorMessage }
                    </div>
                )}

                <Button type="submit" className="w-full">
                    Crear cuenta
                </Button>
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
            <Link href="/auth/login" className="w-full">
                <Button variant="outline" className="w-full">
                    Ingresar
                </Button>
            </Link>
        </CardFooter>
    </Card>
  );
};
