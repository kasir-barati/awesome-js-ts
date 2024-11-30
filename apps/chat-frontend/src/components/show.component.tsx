import { PropsWithChildren } from 'react';

interface ShowProps {
  when: boolean;
}

export function Show({
  when,
  children,
}: Readonly<PropsWithChildren<ShowProps>>) {
  if (!when) {
    return <></>;
  }
  return <>{children}</>;
}
