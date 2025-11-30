import { useLegalStore } from '../store/useLegalStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Briefcase, Users, DollarSign, AlertCircle, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { formatCurrency, formatDate } from '../lib/utils';

interface DashboardProps {
  onViewChange: (view: string) => void;
}

export default function Dashboard({ onViewChange }: DashboardProps) {
  const { cases, clients, timeEntries, courtDates } = useLegalStore();

  const activeCases = cases.filter(c => c.status !== 'closed').length;
  const totalClients = clients.length;

  const billableHours = timeEntries
    .filter(e => e.billable && e.status === 'approved')
    .reduce((sum, e) => sum + e.hours, 0);

  const totalRevenue = timeEntries
    .filter(e => e.billable && e.status === 'approved')
    .reduce((sum, e) => sum + (e.hours * (e.hourlyRate || 0)), 0);

  const upcomingCourtDates = courtDates
    .filter(cd => new Date(cd.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const recentCases = cases
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'info';
      case 'in-progress': return 'warning';
      case 'closed': return 'default';
      case 'pending': return 'secondary';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header Section with Enhanced Typography */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground tracking-tight">Dashboard</h1>
        <p className="text-base text-muted-foreground">Welcome back! Here's your firm's overview.</p>
      </div>

      {/* Stats Cards with Enhanced Design */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden hover-lift border-l-4 border-l-primary">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              Active Cases
            </CardTitle>
            <div className="rounded-lg bg-primary/10 p-2.5">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-bold tracking-tight">{activeCases}</div>
            <p className="text-sm text-muted-foreground font-medium">
              {cases.length} total cases
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden hover-lift border-l-4 border-l-info">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[hsl(var(--info))]/5 rounded-full -mr-12 -mt-12" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              Total Clients
            </CardTitle>
            <div className="rounded-lg bg-[hsl(var(--info))]/10 p-2.5">
              <Users className="h-5 w-5 text-[hsl(var(--info))]" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-bold tracking-tight">{totalClients}</div>
            <p className="text-sm text-muted-foreground font-medium">
              Active relationships
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden hover-lift border-l-4 border-l-warning">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[hsl(var(--warning))]/5 rounded-full -mr-12 -mt-12" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              Billable Hours
            </CardTitle>
            <div className="rounded-lg bg-[hsl(var(--warning))]/10 p-2.5">
              <Clock className="h-5 w-5 text-[hsl(var(--warning))]" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-bold tracking-tight">{billableHours.toFixed(1)}</div>
            <p className="text-sm text-muted-foreground font-medium">
              This period
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden hover-lift border-l-4 border-l-success">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[hsl(var(--success))]/5 rounded-full -mr-12 -mt-12" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              Total Revenue
            </CardTitle>
            <div className="rounded-lg bg-[hsl(var(--success))]/10 p-2.5">
              <DollarSign className="h-5 w-5 text-[hsl(var(--success))]" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-bold tracking-tight">{formatCurrency(totalRevenue)}</div>
            <p className="text-sm text-muted-foreground font-medium">
              From billable hours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Cards with Enhanced Design */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover-lift">
          <CardHeader className="border-b bg-gradient-to-br from-primary/5 to-transparent">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Upcoming Court Dates</CardTitle>
                <CardDescription>Your next scheduled appearances</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {upcomingCourtDates.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No upcoming court dates</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingCourtDates.map((courtDate) => {
                  const relatedCase = cases.find(c => c.id === courtDate.caseId);
                  return (
                    <div
                      key={courtDate.id}
                      className="group relative flex items-start gap-4 rounded-lg border border-border/50 p-4 transition-all hover:border-primary/50 hover:bg-accent/50"
                    >
                      <div className="rounded-lg bg-primary/10 p-2.5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <CalendarIcon className="h-5 w-5 text-primary group-hover:text-primary-foreground" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-semibold text-sm">{courtDate.title}</p>
                        <p className="text-sm text-muted-foreground">{relatedCase?.title}</p>
                        <p className="text-xs text-muted-foreground font-medium">
                          {formatDate(new Date(courtDate.date))} • {courtDate.location}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <Button
                  variant="outline"
                  className="w-full mt-4 hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => onViewChange('calendar')}
                >
                  View All Court Dates
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="border-b bg-gradient-to-br from-info/5 to-transparent">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-[hsl(var(--info))]/10 p-2">
                <Briefcase className="h-5 w-5 text-[hsl(var(--info))]" />
              </div>
              <div>
                <CardTitle className="text-lg">Recent Cases</CardTitle>
                <CardDescription>Recently updated case files</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {recentCases.map((caseItem) => {
                const client = clients.find(c => c.id === caseItem.clientId);
                return (
                  <div
                    key={caseItem.id}
                    className="group relative rounded-lg border border-border/50 p-4 transition-all hover:border-primary/50 hover:bg-accent/50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-2">
                        <p className="font-semibold text-sm">{caseItem.title}</p>
                        <p className="text-xs text-muted-foreground">{client?.name}</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant={getStatusColor(caseItem.status) as any} className="text-xs">
                            {caseItem.status}
                          </Badge>
                          <Badge variant={getPriorityColor(caseItem.priority) as any} className="text-xs">
                            {caseItem.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <Button
                variant="outline"
                className="w-full mt-4 hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => onViewChange('cases')}
              >
                View All Cases
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
