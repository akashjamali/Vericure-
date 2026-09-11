import { Stack } from 'expo-router';

import { Link } from '@/components/ui/link';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center p-5 bg-background gap-3">
        <Text variant="heading" className="text-foreground font-bold text-xl">
          Screen not found
        </Text>
        <Text variant="caption" className="text-muted-foreground text-center">
          This screen does not exist.
        </Text>
        <Link href="/" className="mt-2">
          <Text className="text-primary font-semibold underline">
            Go to home screen
          </Text>
        </Link>
      </View>
    </>
  );
}
