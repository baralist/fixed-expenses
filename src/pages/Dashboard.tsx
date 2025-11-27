import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Plus, Trash2, CreditCard } from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';

interface Expense {
  id: string;
  service_name: string;
  amount: number;
  payment_day: number;
  category?: string;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);

  // Form state
  const [serviceName, setServiceName] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentDay, setPaymentDay] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    checkUser();
    fetchExpenses();
  }, []);

  useEffect(() => {
    const total = expenses.reduce((sum, item) => sum + item.amount, 0);
    setTotalAmount(total);
  }, [expenses]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
    }
  };

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('payment_day', { ascending: true });

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async () => {
    if (!serviceName || !amount || !paymentDay) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('expenses').insert([
        {
          user_id: user.id,
          service_name: serviceName,
          amount: parseInt(amount),
          payment_day: parseInt(paymentDay),
          category: category || null,
        },
      ]);

      if (error) throw error;

      // Reset form and refresh list
      setServiceName('');
      setAmount('');
      setPaymentDay('');
      setCategory('');
      fetchExpenses();
      
      // Close sheet (programmatically clicking close button is a hack, better to use controlled state for Sheet open)
      // For MVP, we'll just refresh. Ideally use a controlled Sheet component.
      
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('지출 등록에 실패했습니다.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const { error } = await supabase.from('expenses').delete().eq('id', id);
      if (error) throw error;
      fetchExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  return (
    <div className="h-screen bg-gray-50/50">
      <Topbar />
      
      <main className="container p-4 md:p-6 max-w-3xl mx-auto space-y-6">
        {/* Summary Card */}
        <Card className="bg-primary text-primary-foreground border-none shadow-lg overflow-hidden relative">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-white/10 skew-x-12 translate-x-12" />
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-lg font-medium opacity-90">이번 달 고정 지출</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold">
              {totalAmount.toLocaleString()}원
            </div>
            <p className="text-sm opacity-80 mt-1">
              총 {expenses.length}건의 고정 지출이 있습니다.
            </p>
          </CardContent>
        </Card>

        {/* Action Bar */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">지출 목록</h2>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button className="shadow-sm">
                <Plus className="mr-2 h-4 w-4" />
                지출 추가
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>새로운 고정 지출 추가</SheetTitle>
                <SheetDescription>
                  매달 반복되는 고정 지출 내역을 입력해주세요.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">서비스명</Label>
                  <Input 
                    id="name" 
                    placeholder="예: 넷플릭스, 월세" 
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amount">금액 (원)</Label>
                  <Input 
                    id="amount" 
                    type="number" 
                    placeholder="0" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="day">결제일 (1~31)</Label>
                  <Input 
                    id="day" 
                    type="number" 
                    min="1" 
                    max="31" 
                    placeholder="1" 
                    value={paymentDay}
                    onChange={(e) => setPaymentDay(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">카테고리 (선택)</Label>
                  <Input 
                    id="category" 
                    placeholder="예: 구독, 공과금" 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="submit" onClick={handleAddExpense}>저장하기</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        {/* Expense List */}
        <div className="grid gap-4">
          {loading ? (
            <div className="text-center py-10 text-gray-500">로딩 중...</div>
          ) : expenses.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <div className="bg-gray-100 p-3 rounded-full mb-4">
                  <CreditCard className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">등록된 지출이 없습니다.</p>
                <p className="text-sm text-gray-400 mt-1">새로운 지출을 추가해보세요.</p>
              </CardContent>
            </Card>
          ) : (
            expenses.map((expense) => (
              <Card key={expense.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200 border-0 shadow-sm ring-1 ring-gray-200">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 font-bold text-sm">
                        {expense.payment_day}일
                      </div>
                      <div className='flex flex-col justify-start gap-1'>
                        <h3 className="text-left flex-shrink-0 font-bold text-gray-900">{expense.service_name}</h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          {expense.category || '기타'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="flex-1 whitespace-nowrap font-bold text-lg">
                        {expense.amount.toLocaleString()}원
                      </span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                        onClick={() => handleDelete(expense.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
