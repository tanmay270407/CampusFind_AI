import { SearchCode } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center justify-center gap-2 text-lg font-bold text-primary-foreground tracking-wider">
      <SearchCode className="h-6 w-6" />
      <span>CampusFind AI</span>
    </div>
  );
}

export function LogoIcon() {
  return <SearchCode className="h-7 w-7" />;
}
