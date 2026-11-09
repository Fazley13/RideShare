import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Footer() {
  const devLinks = [
    { href: "/onboarding/role-selection", label: "Role Selection" },
    { href: "/profile", label: "Profile" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/rides/booking/demo-ride", label: "Ride Booking Demo" },
    { href: "/rides/status/demo-ride", label: "Ride Status Demo" },
    { href: "/rides/review/demo-ride", label: "Rating & Review Demo" },
    { href: "/admin/login", label: "Admin Login" },
  ];

  return (
    <footer className="bg-gray-950 text-gray-300 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          <div>
            <span className="text-2xl font-black tracking-tighter text-white mb-6 block">
              RideShare
            </span>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              University carpooling made easy, affordable, and safe. Connect with students, share rides, and save the planet together.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="font-bold text-gray-400 hover:text-white transition bg-gray-900 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-red-600">
                FB
              </Link>
              <Link href="#" className="font-bold text-gray-400 hover:text-white transition bg-gray-900 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-red-600">
                X
              </Link>
              <Link href="#" className="font-bold text-gray-400 hover:text-white transition bg-gray-900 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-red-600">
                IG
              </Link>
              <Link href="#" className="font-bold text-gray-400 hover:text-white transition bg-gray-900 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-red-600">
                LI
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Company</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="#" className="hover:text-red-500 transition">About Us</Link></li>
              <li><Link href="#" className="hover:text-red-500 transition">Our Offerings</Link></li>
              <li><Link href="#" className="hover:text-red-500 transition">Newsroom</Link></li>
              <li><Link href="#" className="hover:text-red-500 transition">Investors</Link></li>
              <li><Link href="#" className="hover:text-red-500 transition">Blog</Link></li>
              <li><Link href="#" className="hover:text-red-500 transition">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Products</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/rides/search" className="hover:text-red-500 transition">Ride</Link></li>
              <li><Link href="/rides/post" className="hover:text-red-500 transition">Drive</Link></li>
              <li><Link href="#" className="hover:text-red-500 transition">Delivery</Link></li>
              <li><Link href="#" className="hover:text-red-500 transition">Business</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Dev Tools (Temporary)</h3>
            <ul className="space-y-3 text-sm">
              {devLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="group flex items-center text-gray-400 hover:text-red-500 transition">
                    <ArrowRight size={14} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} RideShare Technologies Inc.</p>
          <div className="flex space-x-6">
            <Link href="#" className="hover:text-white transition">Privacy</Link>
            <Link href="#" className="hover:text-white transition">Accessibility</Link>
            <Link href="#" className="hover:text-white transition">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
