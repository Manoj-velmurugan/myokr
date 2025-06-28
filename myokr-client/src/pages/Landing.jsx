import { Link } from 'react-router-dom';
import admin from '../assets/admin.png';

function Landing() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between font-sans">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6 shadow-md bg-white z-10">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-800">
          MyOKR
        </h1>
        <div className="space-x-4">
          <Link
            to="/login"
            className="text-purple-700 font-semibold border border-purple-700 px-5 py-2 rounded-xl hover:bg-purple-50 transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-purple-700 text-white px-5 py-2 rounded-xl hover:bg-purple-800 transition"
          >
            Signup
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col-reverse md:flex-row items-center justify-center gap-12 px-6 py-16 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-xl text-center md:text-left space-y-6">
          <h2 className="text-5xl font-bold leading-tight text-gray-900">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-800">
              Align Goals.
            </span>{' '}
            Empower Teams.
          </h2>
          <p className="text-lg text-gray-600">
            MyOKR helps your organization stay focused and aligned. Track your
            team’s OKRs and boost performance with a clean, modern dashboard.
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            <Link
              to="/signup"
              className="bg-purple-700 text-white px-6 py-3 rounded-xl hover:bg-purple-800 transition shadow-md"
            >
              Get Started
            </Link>
          </div>
        </div>
        <div>
          <img
            src={admin}
            alt="Admin Panel Screenshot"
            className="w-full max-w-xl rounded-2xl shadow-xl border border-gray-200"
          />
        </div>
      </main>

      {/* Footer */}
     <footer className="text-center text-sm text-gray-500 py-6 border-t">
  &copy; {new Date().getFullYear()} MyOKR. All rights reserved. Created by Manoj MV.
</footer>

    </div>
  );
}

export default Landing;
