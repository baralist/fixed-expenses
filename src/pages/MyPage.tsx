import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Topbar } from '@/components/layout/Topbar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function MyPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }
      
      setEmail(user.email || '사용자');

      // Fetch expenses to calculate total
      const { data: expenses, error } = await supabase
        .from('expenses')
        .select('amount');

      if (error) throw error;

      const total = (expenses || []).reduce((sum, item) => sum + item.amount, 0);
      setTotalAmount(total);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-50/50">
      <Topbar />
      
      <main className="container p-4 md:p-6 max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">마이 페이지</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>내 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">이메일</p>
              <p className="text-lg">{email}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary text-primary-foreground border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-medium opacity-90">월 예상 고정 지출</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-2xl font-bold opacity-50">계산 중...</div>
            ) : (
              <div className="space-y-2">
                <div className="text-4xl font-bold">
                  {totalAmount.toLocaleString()}원
                </div>
                <p className="text-sm opacity-80">
                  매달 이만큼의 금액이 고정적으로 지출됩니다.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
