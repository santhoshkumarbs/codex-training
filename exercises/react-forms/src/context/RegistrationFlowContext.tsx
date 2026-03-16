import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type PropsWithChildren,
} from 'react';

import {
  DEFAULT_REGISTRATION_DATA,
  type PersistedRegistrationDraft,
} from '../types/registration';
import {
  clearRegistrationDraft,
  loadRegistrationDraft,
  saveRegistrationDraft,
} from '../utils/storage';

interface RegistrationFlowState {
  currentStep: number;
  draft: PersistedRegistrationDraft;
}

type RegistrationFlowAction =
  | { type: 'SET_STEP'; step: number }
  | { type: 'MERGE_DRAFT'; draft: PersistedRegistrationDraft }
  | { type: 'RESET' };

interface RegistrationFlowContextValue {
  state: RegistrationFlowState;
  setStep: (step: number) => void;
  mergeDraft: (draft: PersistedRegistrationDraft) => void;
  resetFlow: () => void;
}

const initialDraft: PersistedRegistrationDraft = {
  email: DEFAULT_REGISTRATION_DATA.email,
  username: DEFAULT_REGISTRATION_DATA.username,
  firstName: DEFAULT_REGISTRATION_DATA.firstName,
  lastName: DEFAULT_REGISTRATION_DATA.lastName,
  phoneNumber: DEFAULT_REGISTRATION_DATA.phoneNumber,
  dateOfBirth: DEFAULT_REGISTRATION_DATA.dateOfBirth,
  country: DEFAULT_REGISTRATION_DATA.country,
  newsletter: DEFAULT_REGISTRATION_DATA.newsletter,
  terms: DEFAULT_REGISTRATION_DATA.terms,
};

const RegistrationFlowContext =
  createContext<RegistrationFlowContextValue | null>(null);

function registrationFlowReducer(
  state: RegistrationFlowState,
  action: RegistrationFlowAction,
): RegistrationFlowState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.step };
    case 'MERGE_DRAFT':
      return { ...state, draft: action.draft };
    case 'RESET':
      return { currentStep: 0, draft: initialDraft };
    default:
      return state;
  }
}

function createInitialState(): RegistrationFlowState {
  return {
    currentStep: 0,
    draft: loadRegistrationDraft() ?? initialDraft,
  };
}

export function RegistrationFlowProvider({
  children,
}: PropsWithChildren) {
  const [state, dispatch] = useReducer(
    registrationFlowReducer,
    undefined,
    createInitialState,
  );

  useEffect(() => {
    saveRegistrationDraft(state.draft);
  }, [state.draft]);

  const value: RegistrationFlowContextValue = {
    state,
    setStep: (step) => {
      dispatch({ type: 'SET_STEP', step });
    },
    mergeDraft: (draft) => {
      dispatch({ type: 'MERGE_DRAFT', draft });
    },
    resetFlow: () => {
      clearRegistrationDraft();
      dispatch({ type: 'RESET' });
    },
  };

  return (
    <RegistrationFlowContext.Provider value={value}>
      {children}
    </RegistrationFlowContext.Provider>
  );
}

export function useRegistrationFlow() {
  const context = useContext(RegistrationFlowContext);

  if (!context) {
    throw new Error(
      'useRegistrationFlow must be used within RegistrationFlowProvider.',
    );
  }

  return context;
}
