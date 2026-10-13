import { router } from 'expo-router';
import { View } from 'react-native';

import { AppText } from '@/components/app-text';
import { IconButton } from '@/components/icon-button';
import { ChevronLeftIcon } from '@/components/icons';

/** Top navigation (1:206): accent back button and the screen title, 56dp apart. */

/** Back to the previous screen, or to Discover when the page was opened directly (deep link, web). */
export function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

export function DetailHeader({ title }: { title: string }) {
  return (
    <View className="flex-row items-center gap-14 px-5">
      <IconButton accessibilityLabel="Back" onPress={goBack}>
        <ChevronLeftIcon size={16} />
      </IconButton>
      <AppText variant="title" accessibilityRole="header" numberOfLines={1} className="flex-1">
        {title}
      </AppText>
    </View>
  );
}
