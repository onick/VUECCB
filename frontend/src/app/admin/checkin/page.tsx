'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  RefreshCw, 
  AlertCircle 
} from 'lucide-react';
import CheckInSystem from '@/components/CheckInSystem';

interface CheckInStats {
  totalReservations: number;
  checkedIn: number;
  pending: number;
  checkInRate: number;
}

interface RecentCheckIn {
  id: string;
  userName: string;
  userEmail: string;
  eventTitle: string;
  code: string;
  time: string;
}

export default function CheckInPage() {
  const [stats, setStats] = useState<CheckInStats>({
    totalReservations: 0,
    checkedIn: 0,
    pending: 0,
    checkInRate: 0
  });
  const [recentCheckIns, setRecentCheckIns] = useState<RecentCheckIn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCheckInData();
  }, []);

  const loadCheckInData = async () => {
    try {
      setLoading(true);
      
      // Simular datos mientras no hay backend conectado
      const mockStats: CheckInStats = {
        totalReservations: 156,
        checkedIn: 132,
        pending: 24,
        checkInRate: 84.6
      };

      const mockRecentCheckIns: RecentCheckIn[] = [
        {
          id: '1',
          userName: 'María García',
          userEmail: 'maria.garcia@email.com',
          eventTitle: 'Concierto de Jazz Latino',
          code: 'ABC123XY',
          time: new Date(Date.now() - 5 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          userName: 'Carlos Rodríguez',
          userEmail: 'carlos.rodriguez@email.com',
          eventTitle: 'Exposición de Arte Moderno',
          code: 'DEF456ZW',
          time: new Date(Date.now() - 12 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          userName: 'Ana Martínez',
          userEmail: 'ana.martinez@email.com',
          eventTitle: 'Taller de Fotografía Digital',
          code: 'GHI789UV',
          time: new Date(Date.now() - 18 * 60 * 1000).toISOString()
        }
      ];

      setStats(mockStats);
      setRecentCheckIns(mockRecentCheckIns);
    } catch (error) {
      console.error('Error loading check-in data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckInSuccess = (newCheckIn: any) => {
    setRecentCheckIns(prev => [newCheckIn, ...prev.slice(0, 9)]);
    loadCheckInData();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Ahora mismo';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)} horas`;
    return date.toLocaleDateString('es-DO');
  };

  const getCheckInRateColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600 bg-green-50';
    if (rate >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  if (loading) {
    return (
      <div className="flex