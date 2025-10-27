function TestHeader({ testTitle, timeLeft, onSubmit }) {
  const mm = Math.floor(timeLeft / 60);
  const ss = (timeLeft % 60).toString().padStart(2, '0');
  return (
    <div className="w-full bg-blue-600 text-white p-3 flex items-center justify-between">
      <div className="text-lg font-semibold">{testTitle}</div>
      <div className="flex items-center gap-4">
        <div className="text-sm">Time Left: <span className="font-mono">{mm}:{ss}</span></div>
        <button onClick={onSubmit} className="bg-red-500 px-3 py-1 rounded text-white text-sm">Submit</button>
      </div>
    </div>
  );
}
