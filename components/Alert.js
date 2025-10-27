function Alert({ type, message, onClose }) {
  try {
    const icons = {
      success: 'check-circle',
      error: 'alert-circle',
      warning: 'alert-triangle',
      info: 'info'
    };

    const colors = {
      success: 'bg-green-50 border-green-200 text-green-800',
      error: 'bg-red-50 border-red-200 text-red-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800'
    };

    return (
      <div className={`fixed top-4 right-4 z-50 max-w-md p-4 border rounded-lg shadow-lg ${colors[type]}`}>
        <div className="flex items-start gap-3">
          <div className={`icon-${icons[type]} text-xl`}></div>
          <p className="flex-1">{message}</p>
          <button onClick={onClose} className="hover:opacity-70">
            <div className="icon-x text-lg"></div>
          </button>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Alert component error:', error);
    return null;
  }
}