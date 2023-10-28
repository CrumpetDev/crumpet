import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { MdInfoOutline } from 'react-icons/md';

interface ToastProps {
  id?: string;
  message: string;
  type?: 'info' | 'success' | 'error';
  duration?: number;
}

const Toast = ({ id, message, type = 'info', duration = 4000 }: ToastProps) => {
  const [progress, setProgress] = useState(100);
  const intervalRef = useRef<number | null>(null);
  const color = type == 'info' ? 'bg-radial-ultra-light' : type == 'success' ? 'bg-green-600' : 'bg-red-600';
  const progressColor =
    type == 'info' ? 'bg-gray-200' : type == 'success' ? 'bg-green-200' : 'bg-red-200';

  const startProgress = () => {
    if (!intervalRef.current) {
      intervalRef.current = window.setInterval(() => {
        setProgress(prev => Math.max(prev - 100 / (duration / 10), 0));
      }, 10);
    }
  };

  const stopProgress = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    startProgress();
    return stopProgress;
  }, []);

  return (
    <div
      onMouseEnter={stopProgress}
      onMouseLeave={startProgress}
      className="w-80 rounded flex-col justify-start items-start inline-flex">
      <div className={`self-stretch h-1 rounded-t ${color}`}>
        <div style={{ width: `${progress}%` }} className={`h-1 ${progressColor} `}></div>
      </div>
      <div
        className={`w-full py-2 px-3 shadow justify-center items-center gap-2 inline-flex rounded-b ${color}`}>
        <div className="w-4 h-4 relative">
          <MdInfoOutline className="text-white" />
        </div>
        <div className="grow shrink basis-0 flex-col justify-start items-start gap-1 inline-flex">
          <p className="self-stretch text-white text-sm w-full">{message}</p>
        </div>
        <button
          className="text-center text-neutral-300 hover:text-neutral-200 text-sm"
          onClick={() => toast.remove(id)}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Toast;
