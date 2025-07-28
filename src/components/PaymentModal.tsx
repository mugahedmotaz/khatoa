import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { activatePremiumTrial } from '@/utils/subscriptionManager';

interface PaymentModalProps {
  open: boolean;
  amount: number;
  currency?: string;
  onSuccess: () => void;
  onCancel: () => void;
  featureName?: string;
  trial?: boolean;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  amount,
  currency = 'ريال',
  onSuccess,
  onCancel,
  featureName = 'النسخة المتقدمة',
  trial = false,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState('');

  // محاكاة الدفع (يجب ربطها بـ Stripe أو بوابة دفع حقيقية)
  const handlePay = () => {
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      try {
        if (trial) {
          // تفعيل التجربة المجانية
          const success = activatePremiumTrial();
          if (success) {
            setLoading(false);
            setSuccess(true);
            setTimeout(() => {
              onSuccess();
            }, 1200);
          } else {
            setLoading(false);
            setError('فشل في تفعيل التجربة المجانية. حاول مرة أخرى.');
          }
        } else {
          // محاكاة الدفع الفعلي
          setLoading(false);
          setSuccess(true);
          setTimeout(() => {
            onSuccess();
          }, 1200);
        }
      } catch (error) {
        setLoading(false);
        setError('حدث خطأ أثناء المعالجة. حاول مرة أخرى.');
      }
    }, 1800);
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-md mx-auto p-0 overflow-hidden">
        <DialogHeader className="bg-gradient-to-r from-purple-700 to-blue-600 text-white p-6">
          <DialogTitle className="flex items-center gap-2">
            <Crown className="w-7 h-7 text-yellow-300" />
            شراء {featureName}
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 space-y-4">
          {success ? (
            <div className="flex flex-col items-center justify-center gap-2">
              <CheckCircle className="w-14 h-14 text-green-500 mb-2" />
              <p className="text-green-700 font-bold text-lg">تم الدفع بنجاح!</p>
              <p className="text-gray-600 text-sm">شكراً لاختيارك النسخة المتقدمة. تم تفعيل جميع الميزات المدفوعة.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 text-lg font-bold justify-center">
                <CreditCard className="w-7 h-7 text-blue-500" />
                <span>
                  {trial ? 'تفعيل التجربة المجانية' : `المبلغ: ${amount} ${currency}`}
                </span>
              </div>
              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded p-2">
                  <XCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}
              <Button
                onClick={handlePay}
                className="w-full h-12 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-white font-bold text-lg mt-2"
                disabled={loading}
              >
                {trial ? 'تفعيل التجربة المجانية' : loading ? 'جاري الدفع...' : 'ادفع الآن'}
              </Button>
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={onCancel}
                disabled={loading}
              >
                إلغاء
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
