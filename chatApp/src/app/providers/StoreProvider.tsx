import { Provider } from 'react-redux';
import type { ReactNode } from 'react';
import { store } from '@/app/store/store';

interface Props {
  children: ReactNode;
}

export function StoreProvider({ children }: Props) {
  return <Provider store={store}>{children}</Provider>;
}
