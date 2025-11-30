import { useLegalStore } from '../../store/useLegalStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Mail, Phone, Building, MapPin, Briefcase } from 'lucide-react';
import { formatDate, formatCurrency } from '../../lib/utils';

interface ClientDetailsDialogProps {
  clientId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ClientDetailsDialog({ clientId, open, onOpenChange }: ClientDetailsDialogProps) {
  const { getClientById, getCasesByClient, timeEntries } = useLegalStore();

  const client = getClientById(clientId);
  const cases = getCasesByClient(clientId);

  if (!client) return null;

  const activeCases = cases.filter(c => c.status !== 'closed');
  const totalCases = cases.length;

  const clientTimeEntries = timeEntries.filter(entry =>
    cases.some(c => c.id === entry.caseId)
  );

  const totalBillableHours = clientTimeEntries
    .filter(e => e.billable)
    .reduce((sum, e) => sum + e.hours, 0);

  const totalRevenue = clientTimeEntries
    .filter(e => e.billable && e.hourlyRate)
    .reduce((sum, e) => sum + e.hours * (e.hourlyRate || 0), 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'info';
      case 'in-progress': return 'warning';
      case 'closed': return 'default';
      case 'pending': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{client.name}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Client since {formatDate(client.createdAt)}
          </p>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{client.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{client.phone}</span>
              </div>
              {client.company && (
                <div className="flex items-center gap-3">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{client.company}</span>
                </div>
              )}
              {client.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{client.address}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{totalCases}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Billable Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{totalBillableHours.toFixed(1)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Case History</CardTitle>
              <CardDescription>{activeCases.length} active cases</CardDescription>
            </CardHeader>
            <CardContent>
              {cases.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No cases yet</p>
              ) : (
                <div className="space-y-3">
                  {cases.map((caseItem) => (
                    <div key={caseItem.id} className="flex items-start justify-between border-b pb-3 last:border-0">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">{caseItem.title}</p>
                          <Badge variant={getStatusColor(caseItem.status) as any} className="text-xs">
                            {caseItem.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {caseItem.practiceArea} • {formatDate(caseItem.createdAt)}
                        </p>
                      </div>
                      {caseItem.estimatedValue && (
                        <p className="text-sm font-semibold">{formatCurrency(caseItem.estimatedValue)}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
