import { PersonIcon } from '@/components/icons';
import { PlaceholderScreen } from '@/screens/placeholder';

export default function ProfileRoute() {
  return (
    <PlaceholderScreen
      title="Profile"
      description="Orders, saved bikes and ride stats will live here."
      icon={<PersonIcon size={26} />}
    />
  );
}
