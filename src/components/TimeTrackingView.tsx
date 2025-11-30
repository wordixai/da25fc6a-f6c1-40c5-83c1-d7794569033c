import { useState } from 'react';
import { useLegalStore } from '../store/useLegalStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, Search, Clock, DollarSign } from 'lucide-react';
import { formatDate, formatCurrency } from '../lib/utils';
import TimeEntryDialog from './dialogs/TimeEntryDialog';

export default function TimeTrackingView() {
  const { timeEntries, cases, teamMembers } = useLegalStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredEntries = timeEntries.filter(entry => {
    const caseItem = cases.find(c => c.id === entry.caseId);
    const matchesSearch = caseItem?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalHours = filteredEntries.reduce((sum, e) => sum + e.hours, 0);
  const billableHours = filteredEntries.filter(e => e.billable).reduce((sum, e) => sum + e.hours, 0);
  const totalRevenue = filteredEntries
    .filter(e => e.billable)
    .reduce((sum, e) => sum + (e.hours * (e.hourlyRate || 0)), 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'submitted': return 'info';
      case 'approved': return 'success';
      case 'invoiced': return 'default';
      default: return 'default';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Time Tracking</h1>
            <p className="text-muted-foreground">Track billable hours and manage time entries</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Time Entry
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalHours.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">
                All time entries
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
                {((billableHours / totalHours) * 100 || 0).toFixed(0)}% of total
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

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search time entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="approved">Approved</option>
            <option value="invoiced">Invoiced</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredEntries.map((entry) => {
          const caseItem = cases.find(c => c.id === entry.caseId);
          const user = teamMembers.find(m => m.id === entry.userId);
          const amount = entry.billable && entry.hourlyRate ? entry.hours * entry.hourlyRate : 0;

          return (
            <Card key={entry.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{caseItem?.title}</h3>
                      <Badge variant={getStatusColor(entry.status) as any}>
                        {entry.status}
                      </Badge>
                      {entry.billable && (
                        <Badge variant="success">Billable</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{entry.description}</p>
                    <div className="flex items-center gap-6 text-sm">
                      <div>
                        <span className="text-muted-foreground">Date: </span>
                        <span className="font-medium">{formatDate(entry.date)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">User: </span>
                        <span className="font-medium">{user?.name}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Hours: </span>
                        <span className="font-medium">{entry.hours}</span>
                      </div>
                      {entry.hourlyRate && (
                        <div>
                          <span className="text-muted-foreground">Rate: </span>
                          <span className="font-medium">{formatCurrency(entry.hourlyRate)}/hr</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {amount > 0 && (
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="text-xl font-bold">{formatCurrency(amount)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredEntries.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No time entries found</p>
            </CardContent>
          </Card>
        )}
      </div>

      <TimeEntryDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
