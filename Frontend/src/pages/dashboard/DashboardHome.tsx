import { useState } from 'react';
import { Building2, Users, Bell, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

interface Stats {
  totalShelters: number;
  activeShelters: number;
  pendingRequests: number;
  totalBeds: number;
}

const DashboardHome = () => {
  const { profile } = useAuth();
  
  // Using mock data for demo
  const [stats] = useState<Stats>({
    totalShelters: 3,
    activeShelters: 2,
    pendingRequests: 5,
    totalBeds: 150,
  });
  const [loading] = useState(false);

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
