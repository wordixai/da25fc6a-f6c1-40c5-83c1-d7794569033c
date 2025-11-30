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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your firm's overview.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCases}</div>
            <p className="text-xs text-muted-foreground">
              {cases.length} total cases
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <p className="text-xs text-muted-foreground">
              Active relationships
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Billable Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{billableHours.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              This period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              From billable hours
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Court Dates</CardTitle>
            <CardDescription>Your next scheduled appearances</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingCourtDates.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming court dates</p>
            ) : (
              <div className="space-y-4">
                {upcomingCourtDates.map((courtDate) => {
                  const relatedCase = cases.find(c => c.id === courtDate.caseId);
                  return (
                    <div key={courtDate.id} className="flex items-start gap-3 border-l-2 border-primary pl-3">
                      <CalendarIcon className="h-5 w-5 text-primary mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{courtDate.title}</p>
                        <p className="text-sm text-muted-foreground">{relatedCase?.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(new Date(courtDate.date))} • {courtDate.location}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => onViewChange('calendar')}
                >
                  View All Court Dates
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Cases</CardTitle>
            <CardDescription>Recently updated case files</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCases.map((caseItem) => {
                const client = clients.find(c => c.id === caseItem.clientId);
                return (
                  <div key={caseItem.id} className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{caseItem.title}</p>
                      <p className="text-xs text-muted-foreground">{client?.name}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant={getStatusColor(caseItem.status) as any} className="text-xs">
                          {caseItem.status}
                        </Badge>
                        <Badge variant={getPriorityColor(caseItem.priority) as any} className="text-xs">
                          {caseItem.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
              <Button
                variant="outline"
                className="w-full"
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
