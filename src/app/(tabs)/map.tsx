import { MapIcon } from '@/components/icons';
import { PlaceholderScreen } from '@/screens/placeholder';

export default function MapRoute() {
  return (
    <PlaceholderScreen
      title="Ride Map"
      description="Routes, bike shops and service points near you are on their way."
      icon={<MapIcon size={28} />}
    />
  );
}
