'use client';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { auth } from "@/lib/firebase";
import { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";


const formSchema = z.object({
  email: z.string().email({
    message: 'Por favor, introduce un correo electrónico válido.',
  }),
  // debe tener al menos un numero, una letra mayuscula y una minuscula, y un caracter especial
  password: z.string().min(8, {
    message: 'La contraseña debe tener al menos 8 caracteres.',
  }).regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
    {
      message:
        'La contraseña debe tener al menos un numero, una letra mayuscula y una minuscula, y un caracter especial',
    }
  ),
  nombre: z.string().min(3, {
    message: 'El nombre debe tener al menos 3 caracteres.',
  }),
  apellido: z.string().min(3, {
    message: 'El apellido debe tener al menos 3 caracteres.',
  }),
});

export default function LoginPage() {
  const introGif = PlaceHolderImages.find(p => p.id === 'intro-gif');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      nombre: '',
      apellido: '',
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Valores del formulario: ", values);
  
    try {
      const res = await createUserWithEmailAndPassword (
        values.email,
        values.password
      );
  
      if (res) {
        console.log("Usuario creado:", res.user);
      } else {
        console.log("No se pudo crear el usuario");
      }

    } catch (error) {
      console.error("Error creando usuario:", error);
    }
  }
  

  function handleGoogleSignIn() {
    // Aquí puedes implementar la lógica de inicio de sesión con Google.
    // Esto podría implicar redirigir al usuario a la página de autenticación de Google
    // o usar una librería como `next-auth` o `@react-oauth/google`.
    console.log('Iniciando sesión con Google...');
  }

  return (
    <div className="relative flex flex-col items-center justify-center h-screen w-screen -m-8 -mb-24 overflow-hidden">
      {introGif && (
        <Image
          src={introGif.imageUrl}
          alt="Introducción Venga Mor"
          unoptimized
          className="absolute z-0 h-[calc(100%-250px)] object-cover object-top w-full"
          data-ai-hint={introGif.imageHint}
          width={1920}
          height={1080}
        />
      )}
      <div className="absolute inset-0 bg-black/70 z-10"></div>

      <main className="relative z-20 flex flex-col items-center justify-center text-center text-white p-4 w-full max-w-md">
        <h1 className="text-8xl md:text-9xl font-headline text-primary" style={{ fontFamily: "'Playball', cursive" }}>
            Venga Mor
        </h1>

        <h2 className="text-4xl md:text-6xl font-bold mt-4" style={{ fontFamily: "'Playball', cursive" }}>
            Bienvenido a Venga Mor
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full mt-8 bg-white/60 p-6 rounded-lg shadow-md text-white">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-left block text-sm font-medium">Nombre</FormLabel>
            
                  <FormControl>
                    <Input placeholder="Javier" {...field} />
                  </FormControl>
            
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="apellido"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-left block text-sm font-medium">Apellido</FormLabel>
            
                  <FormControl>
                    <Input placeholder="Gonzalez" {...field} />
                  </FormControl>
            
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-left block text-sm font-medium">Email</FormLabel>
            
                  <FormControl>
                    <Input placeholder="tuemail@ejemplo.com" {...field} />
                  </FormControl>
            
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-left block text-sm font-medium">Contraseña</FormLabel>
            
                  <FormControl>
                    <Input type={showPassword ? "text" : "password"} placeholder="********" {...field} />    
                  </FormControl>
            
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Registrase
            </Button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
            
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">O continuar con</span>
              </div>
            </div>
            
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
            >
              <img src="/google-icon.png" alt="Google Icon" className="w-6 h-6" />
              Iniciar Sesión con Google
            </Button>

            <p className="text-sm text-gray-500">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/iniciar-sesion" className="text-primary hover:underline">
                Iniciar Sesión
              </Link>
            </p>
          </form>
        </Form>
      </main>
    </div>
  );
}
