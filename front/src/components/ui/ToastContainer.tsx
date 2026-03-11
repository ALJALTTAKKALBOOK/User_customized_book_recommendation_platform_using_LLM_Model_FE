import { useToastStore } from '../../store/useToastStore';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Info, XCircle } from 'lucide-react';

export function ToastContainer() {
  const { toasts } = useToastStore();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
            className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] text-white min-w-[300px] backdrop-blur-xl border ${
              toast.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/30' :
              toast.type === 'error' ? 'bg-red-500/20 border-red-500/30' : 'bg-white/10 border-white/20'
            }`}
          >
            {toast.type === 'success' && <CheckCircle size={20} className="text-emerald-400" />}
            {toast.type === 'error' && <XCircle size={20} className="text-red-400" />}
            {toast.type === 'info' && <Info size={20} className="text-indigo-400" />}
            <span className="font-medium text-[15px]">{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
