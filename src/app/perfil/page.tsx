"use client";
import { useUser } from "@/context/user-context";
// import { Card, CardContent } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card } from "@radix-ui/themes";
import { logout } from "./handler";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PerfilPage() {
  const bgImage = PlaceHolderImages.find((p) => p.id === "profile-bg");

  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user && !loading) {
      router.push("/iniciar-sesion");
    }
  }, [user, loading, router]);

  return (
    <Card>
      <div className="pt-6 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-primary mb-8 text-center">
          Mi Perfil
        </h1>
        <div className="flex flex-col items-center">
          <div className="h-24 w-24 mb-4 border-2 border-primary rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
            {user?.foto ? (
              <img
                src={user.foto}
                alt={`${user.nombre} ${user.apellido}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-3xl text-gray-500">
                {user ? user.nombre.charAt(0).toUpperCase() : "U"}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold">
            {user ? `${user.nombre} ${user.apellido}` : "Usuario"}
          </h2>
          <p className="text-muted-foreground">
            {user ? user.email : " usuario@ejemplo.com"}
          </p>
        </div>

        <button
          onClick={logout}
          className="mt-4 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/80 transition-colors"
        >
          Cerrar Sesi&oacute;n
        </button>
      </div>
    </Card>
  );

  // return (
  //   <div className="relative min-h-[calc(100vh-128px)] -mx-4 -my-8 flex flex-col justify-center">
  //     {bgImage && (
  //       <Image
  //         src={bgImage.imageUrl}
  //         alt={bgImage.description}
  //         layout="fill"
  //         objectFit="cover"
  //         unoptimized
  //         className="absolute z-0 opacity-30"
  //         data-ai-hint={bgImage.imageHint}
  //       />
  //     )}
  //     <div className="relative z-10 p-4">
  //       <h1 className="text-4xl font-bold text-primary mb-8 text-center">
  //         Mi Perfil
  //       </h1>
  //       <Card className="bg-card/80">
  //         <CardContent className="pt-6 flex flex-col items-center">
  //           <Avatar className="h-24 w-24 mb-4 border-2 border-primary">
  //             <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
  //             <AvatarFallback>U</AvatarFallback>
  //           </Avatar>
  //           <h2 className="text-2xl font-bold">Usuario</h2>
  //           <p className="text-muted-foreground">usuario@ejemplo.com</p>
  //           <Button variant="outline" className="mt-6">
  //             Editar Perfil
  //           </Button>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   </div>
  // );
}
