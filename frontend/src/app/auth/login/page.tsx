"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, LogIn } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      const result = await login(data.email, data.password);
      
      toast({
        title: "Bienvenido",
        description: "Has iniciado sesión correctamente",
      });
      
      // Verificar si el usuario es admin y redirigir apropiadamente
      if (result?.user?.is_admin || result?.user?.role === 'admin') {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Error al iniciar sesión",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-ccb-blue rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-xl">CCB</span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Accede a tu cuenta del Centro Cultural
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LogIn className="w-5 h-5 mr-2" />
                Acceso al Sistema
              </CardTitle>
              <CardDescription>
                Ingresa tus credenciales para continuar
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  {...register("email")}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className={errors.password ? "border-red-500" : ""}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-ccb-blue focus:ring-ccb-blue border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    Recordarme
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    href="/auth/forgot-password"
                    className="font-medium text-ccb-blue hover:text-ccb-lightblue"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>

              <div className="text-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">¿No tienes cuenta?</span>{" "}
                <Link
                  href="/auth/register"
                  className="font-medium text-ccb-blue hover:text-ccb-lightblue"
                >
                  Regístrate aquí
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-ccb-blue"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
