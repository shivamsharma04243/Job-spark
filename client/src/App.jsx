import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-900 p-6 transition-all duration-500 relative overflow-hidden">
      
      {/* Animated Background Circles */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-orange-400/30 rounded-full blur-3xl animate-ping"></div>

      {/* Title Section */}
      <h1 className="text-5xl font-extrabold mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
        ❤️ Tailwind CSS Dynamic Test
      </h1>
      
      <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
        Experience the power of <span className="font-semibold text-red-600">Tailwind CSS</span>  
        — responsive design, hover effects, animations, and transitions — all in one place!
      </p>

      {/* Glass Card Section */}
      <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-10 shadow-2xl text-center border border-red-100 hover:shadow-red-200 hover:scale-105 transform transition duration-300 ease-out">
        <h2 className="text-3xl font-semibold mb-3 text-red-600">🔥 Dynamic Counter</h2>
        <p className="text-6xl font-bold mb-6 text-gray-900">{count}</p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setCount((c) => c + 1)}
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg hover:opacity-90 active:scale-95 transition"
          >
            ➕ Increment
          </button>

          <button
            onClick={() => setCount(0)}
            className="bg-gray-200 text-red-600 px-6 py-2 rounded-xl font-semibold shadow-md hover:bg-gray-300 active:scale-95 transition"
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-sm text-gray-500">
        Built with ❤️ by <span className="font-medium text-red-600">Yuvraj Singh</span>
      </footer>
    </div>
  );
}

export default App;
