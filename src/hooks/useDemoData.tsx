import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { freeTrialLeads as freeTrialLeadSeed, type FreeTrialLead } from '../data/freeTrials';
import {
  trialBookings as trialBookingSeed,
  type TrialBooking,
} from '../data/trialScheduling';
import {
  internshipPlacements as internshipSeed,
  type InternshipPlacement,
} from '../data/internships';

type DemoDataContextValue = {
  freeTrialLeads: FreeTrialLead[];
  setFreeTrialLeads: Dispatch<SetStateAction<FreeTrialLead[]>>;
  trialBookings: TrialBooking[];
  setTrialBookings: Dispatch<SetStateAction<TrialBooking[]>>;
  internshipPlacements: InternshipPlacement[];
  setInternshipPlacements: Dispatch<SetStateAction<InternshipPlacement[]>>;
};

const DemoDataContext = createContext<DemoDataContextValue | null>(null);

type DemoDataProviderProps = {
  children: ReactNode;
};

function DemoDataProvider({ children }: DemoDataProviderProps) {
  const [freeTrialLeads, setFreeTrialLeads] = useState<FreeTrialLead[]>(freeTrialLeadSeed);
  const [trialBookings, setTrialBookings] = useState<TrialBooking[]>(trialBookingSeed);
  const [internshipPlacements, setInternshipPlacements] =
    useState<InternshipPlacement[]>(internshipSeed);

  const value = useMemo(
    () => ({
      freeTrialLeads,
      setFreeTrialLeads,
      trialBookings,
      setTrialBookings,
      internshipPlacements,
      setInternshipPlacements,
    }),
    [freeTrialLeads, trialBookings, internshipPlacements]
  );

  return <DemoDataContext.Provider value={value}>{children}</DemoDataContext.Provider>;
}

function useDemoData() {
  const context = useContext(DemoDataContext);
  if (!context) {
    throw new Error('useDemoData must be used within a DemoDataProvider');
  }
  return context;
}

export { DemoDataProvider, useDemoData };


