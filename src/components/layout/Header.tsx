import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, title }) => {
  const { user, isCoach } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-display font-bold text-xl md:text-2xl">{title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isCoach 
              ? 'bg-accent/10 text-accent' 
              : 'bg-muted text-muted-foreground'
          }`}>
            {user?.role?.toUpperCase()}
          </span>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
