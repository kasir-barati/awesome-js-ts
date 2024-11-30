import {
  createContext,
  Dispatch,
  PropsWithChildren,
  useContext,
  useReducer,
} from 'react';
import { assertExists } from 'shared';

interface AppContextState {
  roomId: string;
  username: string;
}
interface DispatchAction {
  type: 'set';
  payload: AppContextState;
}
interface AppContext {
  state: AppContextState;
  dispatch: Dispatch<DispatchAction>;
}

const Context = createContext<AppContext | null>(null);

function contextReducer(
  state: AppContextState,
  action: DispatchAction,
): AppContextState {
  if (action.type === 'set') {
    return action.payload;
  }
  throw 'InvalidActionType';
}

export function useAppContext() {
  const context = useContext(Context);

  assertExists(context);

  return context;
}
export function AppContextProvider({
  children,
}: Readonly<PropsWithChildren>) {
  const [state, dispatch] = useReducer(contextReducer, {
    roomId: '',
    username: '',
  } satisfies AppContextState);
  const value = { state, dispatch };

  return (
    <Context.Provider value={value}>{children}</Context.Provider>
  );
}
