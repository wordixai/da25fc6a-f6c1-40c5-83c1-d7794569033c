import { useState } from 'react';
import { useLegalStore } from '../../store/useLegalStore';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

interface CourtDateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CourtDateDialog({ open, onOpenChange }: CourtDateDialogProps) {
  const { cases, addCourtDate } = useLegalStore();
  const [formData, setFormData] = useState({
    caseId: '',
    title: '',
    date: '',
    time: '',
    location: '',
    judge: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.caseId || !formData.title || !formData.date || !formData.time || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    const dateTime = new Date(`${formData.date}T${formData.time}`);

    addCourtDate({
      caseId: formData.caseId,
      title: formData.title,
      date: dateTime,
      location: formData.location,
      judge: formData.judge || undefined,
      notes: formData.notes || undefined,
    });

    toast.success('Court date added successfully');
    onOpenChange(false);
    setFormData({
      caseId: '',
      title: '',
      date: '',
      time: '',
      location: '',
      judge: '',
      notes: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Court Date</DialogTitle>
          <DialogDescription>Schedule a new court appearance</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="case">Case *</Label>
            <select
              id="case"
              value={formData.caseId}
              onChange={(e) => setFormData({ ...formData, caseId: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            >
              <option value="">Select a case</option>
              {cases.map((caseItem) => (
                <option key={caseItem.id} value={caseItem.id}>
                  {caseItem.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Preliminary Hearing"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Superior Court, Room 304"
              required
            />
          </div>

          <div>
            <Label htmlFor="judge">Judge</Label>
            <Input
              id="judge"
              value={formData.judge}
              onChange={(e) => setFormData({ ...formData, judge: e.target.value })}
              placeholder="e.g., Hon. Michael Rodriguez"
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Additional notes or reminders"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Court Date</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
