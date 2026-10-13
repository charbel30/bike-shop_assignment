import { View, type ViewProps } from 'react-native';

import { BackgroundShape, type BackgroundShapePlacement } from '@/components/background-shape';

/** Full-screen page container: app background colour plus the optional diagonal shape. */

export type ScreenBackgroundProps = ViewProps & {
  /** Which frame's diagonal shape to draw behind the content; omit for a plain background. */
  shape?: BackgroundShapePlacement;
  className?: string;
};

export function ScreenBackground({ shape, className, children, ...props }: ScreenBackgroundProps) {
  return (
    <View className={`flex-1 overflow-hidden bg-bg ${className ?? ''}`} {...props}>
      {shape ? <BackgroundShape placement={shape} /> : null}
      {children}
    </View>
  );
}
