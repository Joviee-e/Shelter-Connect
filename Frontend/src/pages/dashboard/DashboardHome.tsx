import { useState, useEffect } from 'react';
import { Building2, Users, Bell, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { fetchMyShelters } from '@/lib/api';

interface Stats {
  totalShelters: number;
  activeShelters: number;
  pendingRequests: number;
  totalBeds: number;
}

const DashboardHome = () => {
  const { profile } = useAuth();

  const [stats, setStats] = useState<Stats>({
    totalShelters: 0,
    activeShelters: 0,
    pendingRequests: 0,
    totalBeds: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch shelters and calculate stats
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const shelters = await fetchMyShelters();

        // Calculate stats from fetched data
        const calculatedStats = {
          totalShelters: shelters.length,
          activeShelters: shelters.filter((s: any) => s.is_active !== false).length,
          totalBeds: shelters.reduce((sum: number, s: any) => sum + (s.total_beds || 0), 0),
          pendingRequests: 0, // TODO: Fetch from requests API when available
        };

        setStats(calculatedStats);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const statCards = [
    {
      title: 'Total Shelters',
      value: stats.totalShelters,
      icon: Building2,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Active Shelters',
      value: stats.activeShelters,
      icon: TrendingUp,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      title: 'Pending Requests',
      value: stats.pendingRequests,
      icon: Bell,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Total Capacity',
      value: stats.totalBeds,
      icon: Users,
      color: 'text-secondary-foreground',
      bgColor: 'bg-secondary',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div>
        <h2 className="text-2xl font-bold">
          Welcome, {profile?.ngo_name || 'NGO'}!
        </h2>
        <p className="text-muted-foreground mt-1">
          Here's an overview of your shelter operations
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              ) : (
                <div className="text-3xl font-bold">{stat.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <a
            href="/dashboard/add-shelter"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Building2 className="w-4 h-4" />
            Add New Shelter
          </a>
          <a
            href="/dashboard/requests"
            className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
          >
            <Bell className="w-4 h-4" />
            View Requests
          </a>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;
