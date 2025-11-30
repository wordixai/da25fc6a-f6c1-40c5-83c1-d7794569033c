import { useState } from 'react';
import { useLegalStore } from '../store/useLegalStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, Search, Mail, Phone, Building } from 'lucide-react';
import { formatDate } from '../lib/utils';
import ClientDialog from './dialogs/ClientDialog';
import ClientDetailsDialog from './dialogs/ClientDetailsDialog';

export default function ClientsView() {
  const { clients, cases } = useLegalStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getClientCaseCount = (clientId: string) => {
    return cases.filter(c => c.clientId === clientId).length;
  };

  const getClientActiveCaseCount = (clientId: string) => {
    return cases.filter(c => c.clientId === clientId && c.status !== 'closed').length;
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Clients</h1>
            <p className="text-muted-foreground">Manage your client relationships</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Client
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map((client) => {
          const totalCases = getClientCaseCount(client.id);
          const activeCases = getClientActiveCaseCount(client.id);

          return (
            <Card
              key={client.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedClientId(client.id)}
            >
              <CardHeader>
                <CardTitle className="text-lg">{client.name}</CardTitle>
                <CardDescription>
                  Member since {formatDate(client.createdAt)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {client.company && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{client.company}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{client.phone}</span>
                  </div>
                  <div className="pt-3 border-t flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Cases</p>
                      <p className="text-lg font-semibold">{totalCases}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Active Cases</p>
                      <p className="text-lg font-semibold">{activeCases}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredClients.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No clients found</p>
            </CardContent>
          </Card>
        )}
      </div>

      <ClientDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      {selectedClientId && (
        <ClientDetailsDialog
          clientId={selectedClientId}
          open={!!selectedClientId}
          onOpenChange={(open) => !open && setSelectedClientId(null)}
        />
      )}
    </div>
  );
}
