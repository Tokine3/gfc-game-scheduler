'use client';

import { FC } from 'react';
import { CalendarWithRelations } from '../../../../apis/@types';
import { JoinServerDialog } from '../JoinServerDialog/JoinServerDialog';

type Props = {
  calendar: CalendarWithRelations;
};

export const JoinServerPrompt: FC<Props> = ({ calendar }) => {
  return (
    <JoinServerDialog
      server={calendar.server}
      isOpen={true}
      onClose={() => window.location.reload()}
      onConfirm={async () => {
        window.location.reload();
      }}
      isSubmitting={false}
    />
  );
};
