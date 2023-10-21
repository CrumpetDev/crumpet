import { MdInfoOutline } from 'react-icons/md';
import { resolveValue, Toast as RHToast } from 'react-hot-toast';

interface ToastProps {
  toast: RHToast;
  customMessage?: string | null;
}

const Toast = ({ toast, customMessage = null }: ToastProps) => {
  const message = customMessage != null ? customMessage : resolveValue(toast.message, toast);
  return (
    <div
      className={`w-80 py-2 px-3 bg-green-600 rounded-lg shadow justify-center items-center gap-2 inline-flex ${
        toast.visible ? 'animate-in' : 'animate-out'
      }`}>
      <div className="w-4 h-4 relative">
        <MdInfoOutline className="text-white" />
      </div>
      <div className="grow shrink basis-0 flex-col justify-start items-start gap-1 inline-flex">
        <p className="self-stretch text-white text-sm w-full">{message}</p>
      </div>
      <div className="text-center text-neutral-300 text-sm">Close</div>
    </div>
  );
};

export default Toast;
