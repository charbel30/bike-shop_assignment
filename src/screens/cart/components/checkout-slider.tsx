import { useState } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { AppText } from '@/components/app-text';
import { ChevronRightIcon } from '@/components/icons';
import { SkeuoSurface } from '@/components/skeuo-surface';
import { springs } from '@/theme/motion';

/**
 * "Checkout" slide-to-confirm (1:229, MOTION 2:118 → 2:126 → 2:136). The knob is dragged across
 * the well while "Checkout" fades out and "Done!" fades in; both sit at 50% halfway, as in the
 * mid-slide frame. Releasing past COMPLETE_AT snaps to the end, otherwise it springs back.
 * A tap (or the screen-reader activate action) plays the whole slide.
 */

const TRACK_WIDTH = 174;
const KNOB_SIZE = 44;
const TRAVEL = TRACK_WIDTH - KNOB_SIZE;
const COMPLETE_AT = 0.7;
/** Spring with no overshoot, so the knob never leaves the track. */
const settle = { ...springs.press, overshootClamping: true };
const autoSlide = { duration: 420, easing: Easing.bezier(0.4, 0, 0.2, 1) };

export function CheckoutSlider({ onComplete }: { onComplete: () => void }) {
  const [completed, setCompleted] = useState(false);
  const x = useSharedValue(0);
  const pressed = useSharedValue(0);
  const locked = useSharedValue(false);

  const complete = () => {
    setCompleted(true);
    onComplete();
  };

  const pan = Gesture.Pan()
    .enabled(!completed)
    // Claim horizontal drags quickly, leave vertical ones to the scroll view.
    .activeOffsetX([-6, 6])
    .failOffsetY([-12, 12])
    .onBegin(() => pressed.set(withTiming(1, { duration: 120 })))
    .onChange((event) => {
      if (locked.get()) return;
      x.set(Math.min(TRAVEL, Math.max(0, x.get() + event.changeX)));
    })
    .onEnd(() => {
      if (locked.get()) return;
      if (x.get() >= TRAVEL * COMPLETE_AT) {
        locked.set(true);
        x.set(withSpring(TRAVEL, settle));
        scheduleOnRN(complete);
      } else {
        x.set(withSpring(0, settle));
      }
    })
    .onFinalize(() => pressed.set(withTiming(0, { duration: 160 })));

  /** Plays the full slide; used by a tap on the knob and by the accessibility action. */
  const slideToEnd = () => {
    'worklet';
    if (locked.get()) return;
    locked.set(true);
    x.set(
      withTiming(TRAVEL, autoSlide, (finished) => {
        if (finished) scheduleOnRN(complete);
      }),
    );
  };

  const tap = Gesture.Tap().enabled(!completed).onEnd(slideToEnd);

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.get() }, { scale: 1 - pressed.get() * 0.06 }],
  }));
  const checkoutStyle = useAnimatedStyle(() => ({
    opacity: interpolate(x.get(), [0, TRAVEL], [1, 0], 'clamp'),
  }));
  const doneStyle = useAnimatedStyle(() => ({
    opacity: interpolate(x.get(), [0, TRAVEL], [0, 1], 'clamp'),
  }));

  return (
    <View
      accessible
      accessibilityRole="button"
      accessibilityLabel={completed ? 'Order placed' : 'Checkout'}
      accessibilityHint="Slide the arrow to the right to place your order"
      accessibilityState={{ disabled: completed }}
      accessibilityActions={[{ name: 'activate', label: 'Checkout' }]}
      onAccessibilityAction={({ nativeEvent }) => {
        if (nativeEvent.actionName === 'activate') slideToEnd();
      }}
    >
      <SkeuoSurface variant="well" className="h-11 w-[174px]">
        <Animated.View style={doneStyle} className="absolute inset-y-0 left-[22px] justify-center">
          <AppText weight="medium" tone="muted" tracking="snug">
            Done!
          </AppText>
        </Animated.View>
        <Animated.View style={checkoutStyle} className="absolute inset-y-0 left-[67px] justify-center">
          <AppText weight="medium" tone="muted" tracking="snug">
            Checkout
          </AppText>
        </Animated.View>
        <GestureDetector gesture={Gesture.Race(pan, tap)}>
          <Animated.View
            style={knobStyle}
            className="size-11 items-center justify-center rounded-control border border-t-white/30 border-l-white/30 border-r-black/30 border-b-black/30 bg-linear-to-br from-accent-from to-accent-to"
          >
            <ChevronRightIcon size={16} />
          </Animated.View>
        </GestureDetector>
      </SkeuoSurface>
    </View>
  );
}
