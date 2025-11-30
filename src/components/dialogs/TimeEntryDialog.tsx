import { useState } from 'react';
import { useLegalStore } from '../../store/useLegalStore';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

interface TimeEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TimeEntryDialog({ open, onOpenChange }: TimeEntryDialogProps) {
  const { cases, teamMembers, addTimeEntry } = useLegalStore();
  const [formData, setFormData] = useState({
    caseId: '',
    userId: '',
    description: '',
    hours: '',
    date: new Date().toISOString().split('T')[0],
    billable: true,
    hourlyRate: '',
    status: 'draft' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.caseId || !formData.userId || !formData.description || !formData.hours) {
      toast.error('Please fill in all required fields');
      return;
    }

    addTimeEntry({
      caseId: formData.caseId,
      userId: formData.userId,
      description: formData.description,
      hours: parseFloat(formData.hours),
      date: new Date(formData.date),
      billable: formData.billable,
      hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : undefined,
      status: formData.status,
    });

    toast.success('Time entry added successfully');
    onOpenChange(false);
    setFormData({
      caseId: '',
      userId: '',
      description: '',
      hours: '',
      date: new Date().toISOString().split('T')[0],
      billable: true,
      hourlyRate: '',
      status: 'draft',
    });
  };

  const selectedUser = teamMembers.find(m => m.id === formData.userId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Time Entry</DialogTitle>
          <DialogDescription>Record billable hours for a case</DialogDescription>
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
            <Label htmlFor="user">Team Member *</Label>
            <select
              id="user"
              value={formData.userId}
              onChange={(e) => {
                const user = teamMembers.find(m => m.id === e.target.value);
                setFormData({
                  ...formData,
                  userId: e.target.value,
                  hourlyRate: user?.hourlyRate?.toString() || ''
                });
              }}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            >
              <option value="">Select a team member</option>
              {teamMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Describe the work performed"
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
              <Label htmlFor="hours">Hours *</Label>
              <Input
                id="hours"
                type="number"
                step="0.25"
                value={formData.hours}
                onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
              <Input
                id="hourlyRate"
                type="number"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                placeholder={selectedUser?.hourlyRate?.toString() || "0"}
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="approved">Approved</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="billable"
              checked={formData.billable}
              onChange={(e) => setFormData({ ...formData, billable: e.target.checked })}
              className="h-4 w-4 rounded border-input"
            />
            <Label htmlFor="billable" className="cursor-pointer">
              Billable
            </Label>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Time Entry</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
