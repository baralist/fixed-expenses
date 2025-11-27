import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, User as UserIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { type User } from '@supabase/supabase-js';

export function Topbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2 font-bold text-lg text-primary">
          고정지출
        </div>
        {user && (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => navigate('/mypage')} title="My Page">
              <UserIcon className="h-5 w-5" />
              <span className="sr-only">My Page</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
