"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, TrendingUp, Clock } from "lucide-react";

export function StatsSection() {
  const stats = [
    {
      title: "Eventos este mes",
      value: "24",
      change: "+12%",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Total visitantes",
      value: "2,847",
      change: "+8%",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Eventos populares",
      value: "16",
      change: "+23%",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      title: "Promedio duración",
      value: "2.5h",
      change: "0%",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
  ];

  return (
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Estadísticas del Centro
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Nuestro impacto en la comunidad cultural
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </div>
                    <Badge
                      variant={
                        stat.change.startsWith("+") ? "success" : 
                        stat.change.startsWith("-") ? "destructive" : 
                        "secondary"
                      }
                      className="text-xs"
                    >
                      {stat.change}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="gradient-bg text-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Próximos Destacados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">Concierto de Jazz Latino</div>
                    <div className="text-sm opacity-90">15 de Julio, 8:00 PM</div>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    🎵 Música
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">Exposición Arte Digital</div>
                    <div className="text-sm opacity-90">20 de Julio, Todo el día</div>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    🖼️ Arte
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">Taller de Fotografía</div>
                    <div className="text-sm opacity-90">25 de Julio, 2:00 PM</div>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    🎨 Taller
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-ccb-blue" />
                Categorías Más Populares
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { category: "Conciertos", percentage: 35, icon: "🎵" },
                  { category: "Exposiciones de Arte", percentage: 28, icon: "🖼️" },
                  { category: "Talleres", percentage: 22, icon: "🎨" },
                  { category: "Cinema Dominicano", percentage: 15, icon: "🎬" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{item.icon}</span>
                      <span className="font-medium">{item.category}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mr-2">
                        <div
                          className="h-full bg-ccb-blue rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
