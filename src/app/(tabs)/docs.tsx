import { DocumentIcon } from '@/components/icons';
import { PlaceholderScreen } from '@/screens/placeholder';

export default function DocsRoute() {
  return (
    <PlaceholderScreen
      title="Docs"
      description="Manuals, warranties and receipts for your gear are coming soon."
      icon={<DocumentIcon size={26} />}
    />
  );
}
