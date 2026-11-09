import Link from 'next/link';
import { Menu, User, Car } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-red-600 text-white p-2 rounded-xl group-hover:bg-red-700 transition">
                <Car size={24} strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-black tracking-tighter text-red-600">
                RideShare
              </span>
            </Link>
            
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link href="/rides/search" className="text-sm font-semibold text-gray-700 hover:text-red-600 transition">Ride</Link>
              <Link href="/rides/post" className="text-sm font-semibold text-gray-700 hover:text-red-600 transition">Drive</Link>
              <Link href="#features" className="text-sm font-semibold text-gray-700 hover:text-red-600 transition">Features</Link>
              <Link href="#safety" className="text-sm font-semibold text-gray-700 hover:text-red-600 transition">Safety</Link>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/auth/login" className="text-sm font-semibold text-gray-700 hover:text-red-600 transition hidden lg:inline-flex rounded-full px-4 py-2 hover:bg-red-50">
              Log in
            </Link>
            <Link href="/auth/register" className="text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition px-5 py-2.5 rounded-full shadow-md shadow-red-200">
              Sign up
            </Link>
          </div>
          
          <div className="flex md:hidden items-center gap-4">
             <Link href="/auth/login" className="text-gray-700 hover:text-red-600 p-2">
               <User size={24} />
             </Link>
             <button className="text-gray-700 p-2">
               <Menu size={24} />
             </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
