export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
      <div className="relative flex items-center justify-center w-42 h-42">
        <span className="absolute inset-0 rounded-full border-4 border-dotted border-blue-500 animate-spin-slow" style={{ borderWidth: '8px' }}></span>
        <img
          src="/logo-loader.jpg"
          alt="Loading..."
          className="rounded-full w-40 h-40 object-cover shadow-lg"
        />
      </div>
    </div>
  );
}
