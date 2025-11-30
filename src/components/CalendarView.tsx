import { useState } from 'react';
import { useLegalStore } from '../store/useLegalStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Plus, Calendar as CalendarIcon, MapPin, Gavel } from 'lucide-react';
import { formatDate, formatDateTime } from '../lib/utils';
import CourtDateDialog from './dialogs/CourtDateDialog';

export default function CalendarView() {
  const { courtDates, cases } = useLegalStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const upcomingDates = courtDates
    .filter(cd => new Date(cd.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastDates = courtDates
    .filter(cd => new Date(cd.date) <= new Date())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const renderCourtDate = (courtDate: any) => {
    const caseItem = cases.find(c => c.id === courtDate.caseId);
    const isUpcoming = new Date(courtDate.date) > new Date();

    return (
      <Card key={courtDate.id} className={!isUpcoming ? 'opacity-60' : ''}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{courtDate.title}</CardTitle>
              <CardDescription>{caseItem?.title}</CardDescription>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              {formatDateTime(new Date(courtDate.date))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{courtDate.location}</span>
            </div>
            {courtDate.judge && (
              <div className="flex items-center gap-2 text-sm">
                <Gavel className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{courtDate.judge}</span>
              </div>
            )}
            {courtDate.notes && (
              <p className="text-sm text-muted-foreground border-l-2 border-primary pl-3">
                {courtDate.notes}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Calendar & Court Dates</h1>
            <p className="text-muted-foreground">Track important court appearances and deadlines</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Court Date
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {upcomingDates.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Upcoming Court Dates</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {upcomingDates.map(renderCourtDate)}
            </div>
          </div>
        )}

        {pastDates.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Past Court Dates</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {pastDates.map(renderCourtDate)}
            </div>
          </div>
        )}

        {courtDates.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No court dates scheduled</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setIsDialogOpen(true)}
              >
                Schedule Your First Court Date
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <CourtDateDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
