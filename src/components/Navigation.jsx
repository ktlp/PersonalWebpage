import { Link } from 'react-router-dom'

function Navigation() {
  return (
    <nav>
      <ul className="flex space-x-4">
        <li><Link to="/" className="text-foreground hover:text-primary">Home</Link></li>
        <li><Link to="/about" className="text-foreground hover:text-primary">About</Link></li>
        <li><Link to="/projects" className="text-foreground hover:text-primary">Projects</Link></li>
        <li><Link to="/blogs" className="text-foreground hover:text-primary">Blogs</Link></li>  {/* Add this line */}
        <li><Link to="/contact" className="text-foreground hover:text-primary">Contact</Link></li>
      </ul>
    </nav>
  )
}

export default Navigation