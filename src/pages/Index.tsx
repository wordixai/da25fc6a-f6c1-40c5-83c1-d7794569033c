import { useState } from 'react';
import { useLegalStore } from '../store/useLegalStore';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import CasesView from '../components/CasesView';
import ClientsView from '../components/ClientsView';
import TimeTrackingView from '../components/TimeTrackingView';
import CalendarView from '../components/CalendarView';
import { Toaster } from '../components/ui/sonner';

type View = 'dashboard' | 'cases' | 'clients' | 'time-tracking' | 'calendar';

export default function Index() {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 overflow-auto">
        {currentView === 'dashboard' && <Dashboard onViewChange={setCurrentView} />}
        {currentView === 'cases' && <CasesView />}
        {currentView === 'clients' && <ClientsView />}
        {currentView === 'time-tracking' && <TimeTrackingView />}
        {currentView === 'calendar' && <CalendarView />}
      </main>
      <Toaster />
    </div>
  );
}
