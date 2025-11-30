import { useState } from 'react';
import { useLegalStore } from '../../store/useLegalStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { FileText, Clock, CheckSquare, Calendar, MessageSquare, Plus } from 'lucide-react';
import { formatDate, formatCurrency, formatDateTime } from '../../lib/utils';
import { toast } from 'sonner';

interface CaseDetailsDialogProps {
  caseId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CaseDetailsDialog({ caseId, open, onOpenChange }: CaseDetailsDialogProps) {
  const {
    getCaseById,
    getClientById,
    getTimeEntriesByCase,
    getTasksByCase,
    getCourtDatesByCase,
    getDocumentsByCase,
    getNotesByCase,
    addNote,
    updateTask,
  } = useLegalStore();

  const [newNote, setNewNote] = useState('');

  const caseItem = getCaseById(caseId);
  const client = caseItem ? getClientById(caseItem.clientId) : undefined;
  const timeEntries = getTimeEntriesByCase(caseId);
  const tasks = getTasksByCase(caseId);
  const courtDates = getCourtDatesByCase(caseId);
  const documents = getDocumentsByCase(caseId);
  const notes = getNotesByCase(caseId);

  if (!caseItem) return null;

  const totalBillableHours = timeEntries
    .filter(e => e.billable)
    .reduce((sum, e) => sum + e.hours, 0);

  const totalRevenue = timeEntries
    .filter(e => e.billable && e.hourlyRate)
    .reduce((sum, e) => sum + e.hours * (e.hourlyRate || 0), 0);

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    addNote({
      caseId,
      content: newNote,
      createdBy: 'Current User',
    });

    setNewNote('');
    toast.success('Note added');
  };

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">{caseItem.title}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Case #{caseItem.caseNumber} • {client?.name}
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant={getStatusColor(caseItem.status) as any}>
                {caseItem.status}
              </Badge>
              <Badge variant={getPriorityColor(caseItem.priority) as any}>
                {caseItem.priority}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 my-4">
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
              <CardTitle className="text-sm">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {tasks.filter(t => t.status === 'completed').length}/{tasks.length}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="time">Time Entries</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="court">Court Dates</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Case Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Description</p>
                  <p className="text-sm text-muted-foreground">{caseItem.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Practice Area</p>
                    <p className="text-sm text-muted-foreground">{caseItem.practiceArea}</p>
                  </div>
                  {caseItem.estimatedValue && (
                    <div>
                      <p className="text-sm font-medium">Estimated Value</p>
                      <p className="text-sm text-muted-foreground">{formatCurrency(caseItem.estimatedValue)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-sm text-muted-foreground">{formatDate(caseItem.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-sm text-muted-foreground">{formatDate(caseItem.updatedAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-sm text-muted-foreground">{client?.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{client?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{client?.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="time" className="space-y-3">
            {timeEntries.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No time entries recorded</p>
            ) : (
              timeEntries.map((entry) => (
                <Card key={entry.id}>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{entry.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(entry.date)} • {entry.hours}h • {entry.billable ? 'Billable' : 'Non-billable'}
                        </p>
                      </div>
                      {entry.billable && entry.hourlyRate && (
                        <p className="font-semibold">{formatCurrency(entry.hours * entry.hourlyRate)}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="tasks" className="space-y-3">
            {tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No tasks assigned</p>
            ) : (
              tasks.map((task) => (
                <Card key={task.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={task.status === 'completed'}
                        onChange={(e) => {
                          updateTask(task.id, {
                            status: e.target.checked ? 'completed' : 'in-progress'
                          });
                        }}
                        className="mt-1 h-4 w-4"
                      />
                      <div className="flex-1">
                        <p className={`font-medium text-sm ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                        {task.dueDate && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Due: {formatDate(task.dueDate)}
                          </p>
                        )}
                      </div>
                      <Badge variant={task.priority === 'high' ? 'destructive' : 'default'} className="text-xs">
                        {task.priority}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="court" className="space-y-3">
            {courtDates.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No court dates scheduled</p>
            ) : (
              courtDates.map((courtDate) => (
                <Card key={courtDate.id}>
                  <CardContent className="pt-4">
                    <h4 className="font-semibold">{courtDate.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDateTime(new Date(courtDate.date))}
                    </p>
                    <p className="text-sm text-muted-foreground">{courtDate.location}</p>
                    {courtDate.judge && (
                      <p className="text-sm text-muted-foreground">{courtDate.judge}</p>
                    )}
                    {courtDate.notes && (
                      <p className="text-sm mt-2 border-l-2 border-primary pl-3">{courtDate.notes}</p>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <div className="flex gap-2">
              <Textarea
                placeholder="Add a note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
              />
              <Button onClick={handleAddNote} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {notes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No notes added</p>
              ) : (
                notes.map((note) => (
                  <Card key={note.id}>
                    <CardContent className="pt-4">
                      <p className="text-sm">{note.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {note.createdBy} • {formatDateTime(note.createdAt)}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
