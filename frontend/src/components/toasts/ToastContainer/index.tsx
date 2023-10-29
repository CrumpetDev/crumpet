import { useToaster } from 'react-hot-toast';
import Toast from '../Toast';

const ToastContainer = () => {
  const { toasts, handlers } = useToaster();
  const { startPause, endPause } = handlers;

  return (
    <div
      onMouseEnter={startPause}
      onMouseLeave={endPause}
      className="fixed bottom-4 right-4 gap-2 flex flex-col-reverse">
      {toasts
        .filter(toast => toast.visible)
        .map(toast => {
          const message = typeof toast.message === 'string' ? toast.message : '';
          switch (toast.type) {
            case 'success':
              return <Toast key={toast.id} duration={toast.duration} message={message} type="success" />;
            case 'error':
              return <Toast key={toast.id} duration={toast.duration} message={message} type="error" />;
            default:
              return <Toast key={toast.id} duration={toast.duration} message={message} type="info" />;
          }
        })}
    </div>
  );
};

export default ToastContainer;
