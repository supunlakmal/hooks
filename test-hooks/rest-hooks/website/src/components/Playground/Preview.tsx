import {
  DataProvider,
  PollingSubscription,
  SubscriptionManager,
  NetworkManager,
} from '@data-client/react';
import {
  type Fixture,
  type Interceptor,
  MockResolver,
} from '@data-client/test/browser';
import { useScrollPositionBlocker } from '@docusaurus/theme-common/internal';
import clsx from 'clsx';
import React, { memo, useCallback, useState, useMemo, lazy } from 'react';

import Boundary from './Boundary';
import StoreInspector from './StoreInspector';
import styles from './styles.module.css';
import { useTabStorage } from '../../utils/tabStorage';

function Preview<T>({
  groupId,
  defaultOpen,
  row,
  fixtures,
  getInitialInterceptorData,
}: {
  groupId: string;
  row: boolean;
  defaultOpen: 'y' | 'n';
  fixtures: (Fixture | Interceptor<T>)[];
  getInitialInterceptorData?: () => T;
}) {
  const [choice, setTabGroupChoice] = useTabStorage(
    `docusaurus.tab.${groupId}`,
  );
  const [selectedValue, setSelectedValue] = useState(defaultOpen);
  const { blockElementScrollPositionUntilNextRender } =
    useScrollPositionBlocker();

  if (choice != null && choice !== selectedValue) {
    setSelectedValue(choice as any);
  }

  const toggle = useCallback(
    (
      event: React.FocusEvent<HTMLLIElement> | React.MouseEvent<HTMLLIElement>,
    ) => {
      blockElementScrollPositionUntilNextRender(event.currentTarget);
      setSelectedValue(open => (open === 'y' ? 'n' : 'y'));
      setTabGroupChoice(selectedValue === 'y' ? 'n' : 'y');
    },
    [
      blockElementScrollPositionUntilNextRender,
      selectedValue,
      setTabGroupChoice,
    ],
  );

  const managers = useMemo(
    () => [new NetworkManager(), new SubscriptionManager(PollingSubscription)],
    [],
  );

  const hiddenResult = !(selectedValue === 'n' || !row);
  return (
    <DataProvider managers={managers}>
      <MockResolver
        fixtures={fixtures}
        silenceMissing={true}
        getInitialInterceptorData={getInitialInterceptorData}
      >
        <div
          className={clsx('playground-preview', styles.playgroundPreview, {
            [styles.hidden]: hiddenResult,
          })}
        >
          <Boundary fallback={null}>
            <PreviewBlockLazy />
          </Boundary>
        </div>
        <StoreInspector selectedValue={selectedValue} toggle={toggle} />
      </MockResolver>
    </DataProvider>
  );
}
export default memo(Preview);

const PreviewBlockLazy = lazy(
  () =>
    import(
      /* webpackChunkName: 'PreviewBlock', webpackPreload: true */ './PreviewBlock'
    ),
);
