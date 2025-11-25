'use server';


import { signIn, signOut } from '@/auth';
import prisma from '@/lib/prisma';
import bcryptjs from 'bcryptjs'
 
// ...
 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {

    // await sleep(2);
    
    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirect: false,
    });

    return 'Success';


  } catch (error) {
    console.log(error);

    return 'CredentialsSignin'


  }
}


export const login = async(email:string, password: string) => {

  try {

    await signIn('credentials',{ email, password })

    return {ok: true};
    
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'No se pudo iniciar sesión'
    }
    
  }
}

// Logout
export const logout = async() => {

  await signOut({ redirectTo: '/' });


}

// Register
export const registerUser = async( name: string, email: string, password: string ) => {


  try {
    
    const user = await prisma.user.create({
      data: {
        name: name,
        email: email.toLowerCase(),
        password: bcryptjs.hashSync( password ),
      },
      select: {
        id: true,
        name: true,
        email: true,
      }
    })

    return {
      ok: true,
      user: user,
      message: 'Usuario creado'
    }

  } catch (error) {
    console.log(error);

    return {
      ok: false,
      message: 'No se pudo crear el usuario'
    }
  }

  

}