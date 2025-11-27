import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/');
      }
    });
  }, [navigate]);

  const handleKakaoLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    if (error) console.error('Error logging in:', error.message);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Main Content Area - Centered vertically */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in duration-500">
        
        {/* Logo / Icon Area */}
        <div className="relative">
          <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl animate-pulse" />
          <div className="relative bg-white p-6 rounded-3xl shadow-xl ring-1 ring-gray-100">
            <Wallet className="w-16 h-16 text-primary" strokeWidth={1.5} />
          </div>
        </div>

        {/* Text Area */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            고정지출,<br />
            <span className="text-primary">한눈에 관리</span>하세요
          </h1>
          <p className="text-gray-500 text-lg">
            매달 나가는 돈, 이제 놓치지 마세요.
          </p>
        </div>
      </div>

      {/* Bottom Action Area */}
      <div className="p-6 pb-10 space-y-4 bg-white">
        <Button 
          className="w-full h-14 text-lg bg-[#FEE500] text-[#000000] hover:bg-[#FEE500]/90 font-semibold rounded-2xl shadow-sm transition-transform active:scale-95" 
          onClick={handleKakaoLogin}
        >
          <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3C5.373 3 0 6.668 0 11.193C0 14.07 1.885 16.63 4.823 18.15L3.847 21.75C3.791 21.96 4.027 22.13 4.212 22.01L8.683 19.04C9.74 19.25 10.85 19.38 12 19.38C18.627 19.38 24 15.71 24 11.193C24 6.668 18.627 3 12 3Z"/>
          </svg>
          카카오로 3초 만에 시작하기
        </Button>
        <p className="text-center text-xs text-gray-400">
          로그인 시 이용약관 및 개인정보처리방침에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
}
