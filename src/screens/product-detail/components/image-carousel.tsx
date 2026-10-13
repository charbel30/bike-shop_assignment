import { Image } from 'expo-image';
import { type ImageSourcePropType, View, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';

import { useDesignScale } from '@/hooks/use-design-scale';

import { PageDots } from './page-dots';

/**
 * Product photo pager (1:198): full-width pages, each holding the 288x208 photo with its soft
 * ground shadow, and the page dots underneath driven by the scroll position.
 */

/** Figma "Image" group 1:200 and the photo inside it (1:201), at 390 wide. */
const GROUP = { width: 287.7, height: 208.4 };
const PHOTO = { left: 3, width: 284.7 };
/** Gap between the photo and the dots (1:199 sits 8dp below the photo). */
const DOTS_GAP = 8;

export type ImageCarouselProps = {
  images: readonly ImageSourcePropType[];
  accessibilityLabel: string;
};

export function ImageCarousel({ images, accessibilityLabel }: ImageCarouselProps) {
  const { width } = useWindowDimensions();
  const scale = useDesignScale();
  const position = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    position.set(event.contentOffset.x / width);
  });

  const groupWidth = GROUP.width * scale;
  const groupHeight = GROUP.height * scale;

  return (
    <View>
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={{ height: groupHeight }}
      >
        {images.map((source, index) => (
          <View key={index} className="items-center" style={{ width }}>
            <View style={{ width: groupWidth, height: groupHeight }}>
              <GroundShadow width={groupWidth} height={groupHeight} />
              <Image
                source={source}
                contentFit="contain"
                accessibilityLabel={`${accessibilityLabel}, photo ${index + 1} of ${images.length}`}
                style={{
                  position: 'absolute',
                  left: PHOTO.left * scale,
                  width: PHOTO.width * scale,
                  height: groupHeight,
                }}
              />
            </View>
          </View>
        ))}
      </Animated.ScrollView>
      {/* Reserve the row even for single-photo products so the sheet stays put. */}
      <View style={{ marginTop: DOTS_GAP }} className="h-[5px]">
        {images.length > 1 ? <PageDots count={images.length} position={position} /> : null}
      </View>
    </View>
  );
}

/**
 * Blurred ground shadow under the wheels (1:202: three black ellipses with a 9dp layer blur),
 * drawn as radial gradients so it renders the same on every platform.
 */
function GroundShadow({ width, height }: { width: number; height: number }) {
  return (
    <Svg
      pointerEvents="none"
      width={width}
      height={height}
      viewBox={`0 0 ${GROUP.width} ${GROUP.height}`}
      style={{ position: 'absolute' }}
    >
      <Defs>
        <RadialGradient id="ground-shadow">
          <Stop stopColor="black" stopOpacity={1} />
          <Stop offset={1} stopColor="black" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      {/* Figma ellipses grown by the blur radius; opacity carries their fill alpha. */}
      <Ellipse cx={145.2} cy={187} rx={145} ry={11} fill="url(#ground-shadow)" opacity={0.12} />
      <Ellipse cx={49.3} cy={190.5} rx={58} ry={9} fill="url(#ground-shadow)" opacity={0.3} />
      <Ellipse cx={231.3} cy={190.5} rx={60} ry={9} fill="url(#ground-shadow)" opacity={0.3} />
    </Svg>
  );
}
