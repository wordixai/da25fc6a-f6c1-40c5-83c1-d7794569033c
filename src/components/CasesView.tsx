import { useState } from 'react';
import { useLegalStore } from '../store/useLegalStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, Search, Filter } from 'lucide-react';
import { formatDate, formatCurrency } from '../lib/utils';
import CaseDialog from './dialogs/CaseDialog';
import CaseDetailsDialog from './dialogs/CaseDetailsDialog';

export default function CasesView() {
  const { cases, clients } = useLegalStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.caseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || caseItem.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Cases</h1>
            <p className="text-muted-foreground">Manage and track all case files</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Case
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cases..."
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
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="pending">Pending</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredCases.map((caseItem) => {
          const client = clients.find(c => c.id === caseItem.clientId);
          return (
            <Card
              key={caseItem.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedCaseId(caseItem.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{caseItem.title}</CardTitle>
                      <Badge variant={getStatusColor(caseItem.status) as any}>
                        {caseItem.status}
                      </Badge>
                      <Badge variant={getPriorityColor(caseItem.priority) as any}>
                        {caseItem.priority}
                      </Badge>
                    </div>
                    <CardDescription>
                      Case #{caseItem.caseNumber} • {client?.name}
                    </CardDescription>
                  </div>
                  {caseItem.estimatedValue && (
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Estimated Value</p>
                      <p className="text-lg font-semibold">{formatCurrency(caseItem.estimatedValue)}</p>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {caseItem.description}
                  </p>
                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <span className="text-muted-foreground">Practice Area: </span>
                      <span className="font-medium">{caseItem.practiceArea}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Updated: </span>
                      <span className="font-medium">{formatDate(caseItem.updatedAt)}</span>
                    </div>
                    {caseItem.courtDate && (
                      <div>
                        <span className="text-muted-foreground">Court Date: </span>
                        <span className="font-medium">{formatDate(caseItem.courtDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredCases.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No cases found</p>
            </CardContent>
          </Card>
        )}
      </div>

      <CaseDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      {selectedCaseId && (
        <CaseDetailsDialog
          caseId={selectedCaseId}
          open={!!selectedCaseId}
          onOpenChange={(open) => !open && setSelectedCaseId(null)}
        />
      )}
    </div>
  );
}
