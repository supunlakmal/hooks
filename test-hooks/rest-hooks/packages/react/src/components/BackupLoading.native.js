import React, { useEffect } from 'react';
import { Text, Linking, View } from 'react-native';

export default function BackupLoadingNative() {
  let message = <Text>loading...</Text>;
  /* istanbul ignore else */
  if (process.env.NODE_ENV !== 'production') {
    // env should not change during runtime and this excludes from build
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      console.warn(
        `Uncaught suspense.
Make sure to add your own Suspense boundaries: https://dataclient.io/docs/getting-started/data-dependency#boundaries`,
      );
    }, []);

    message = (
      <>
        <Text>Uncaught Suspense.</Text>
        <Text>
          Try
          <Text
            style={{ color: 'blue' }}
            onPress={() =>
              Linking.openURL(
                'https://dataclient.io/docs/getting-started/data-dependency#boundaries',
              )
            }
          >
            adding a suspense boundary
          </Text>
        </Text>
      </>
    );
  }
  return <View>{message}</View>;
}
