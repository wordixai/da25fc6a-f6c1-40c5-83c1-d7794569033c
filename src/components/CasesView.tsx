import { useState } from 'react';
import { useLegalStore } from '../store/useLegalStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, Search, Filter, Briefcase } from 'lucide-react';
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
    <div className="p-8 space-y-6">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-foreground tracking-tight">Cases</h1>
            <p className="text-base text-muted-foreground">Manage and track all case files</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} size="lg" className="shadow-md hover:shadow-lg">
            <Plus className="h-5 w-5 mr-2" />
            New Case
          </Button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search cases by title or case number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-base shadow-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex h-12 min-w-[180px] rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-sm"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="pending">Pending</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Cases List */}
      <div className="grid gap-4">
        {filteredCases.map((caseItem) => {
          const client = clients.find(c => c.id === caseItem.clientId);
          return (
            <Card
              key={caseItem.id}
              className="cursor-pointer hover-lift group relative overflow-hidden border-l-4"
              style={{
                borderLeftColor: caseItem.priority === 'urgent' ? 'hsl(var(--destructive))' :
                                 caseItem.priority === 'high' ? 'hsl(var(--warning))' :
                                 'hsl(var(--primary))'
              }}
              onClick={() => setSelectedCaseId(caseItem.id)}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300" />

              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-3 flex-wrap">
                      <CardTitle className="text-xl flex-1 min-w-0">{caseItem.title}</CardTitle>
                      <div className="flex gap-2 shrink-0">
                        <Badge variant={getStatusColor(caseItem.status) as any} className="shadow-sm">
                          {caseItem.status}
                        </Badge>
                        <Badge variant={getPriorityColor(caseItem.priority) as any} className="shadow-sm">
                          {caseItem.priority}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <span className="font-mono text-xs px-2 py-0.5 bg-muted rounded">#{caseItem.caseNumber}</span>
                      <span>•</span>
                      <span>{client?.name}</span>
                    </CardDescription>
                  </div>
                  {caseItem.estimatedValue && (
                    <div className="text-right shrink-0 bg-success/10 px-4 py-2 rounded-lg">
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Value</p>
                      <p className="text-xl font-bold text-success">{formatCurrency(caseItem.estimatedValue)}</p>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {caseItem.description}
                </p>
                <div className="flex items-center gap-6 text-sm pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Practice Area:</span>
                    <span className="font-semibold px-2 py-1 bg-accent rounded">{caseItem.practiceArea}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Updated:</span>
                    <span className="font-medium">{formatDate(caseItem.updatedAt)}</span>
                  </div>
                  {caseItem.courtDate && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Court Date:</span>
                      <span className="font-medium text-primary">{formatDate(caseItem.courtDate)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredCases.length === 0 && (
          <Card>
            <CardContent className="py-16 text-center">
              <Briefcase className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-lg font-medium text-muted-foreground">No cases found</p>
              <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or filters</p>
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
