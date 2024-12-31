import { Rocket } from 'lucide-react'

const Navbar = () => {
  return (
    <header className="border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center space-x-2">
            <Rocket className="h-6 w-6 text-purple-500" />
            <span className="text-xl font-bold">NEOs</span>
          </a>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </a>
            <a href="/#dashboard" className="text-gray-300 hover:text-white transition-colors">
              Dashboard
            </a>
            <a href="https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/" className="text-gray-300 hover:text-white transition-colors">
              NEO Lookup
            </a>
            <a href="/contact" className="text-gray-300 hover:text-white transition-colors">
              Contact
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Navbar;