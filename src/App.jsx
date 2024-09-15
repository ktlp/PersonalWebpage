import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { useEffect } from 'react'
import Topbar from './components/Topbar'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import Blogs from './pages/Blogs'  // Add this line
import './App.css'

function App() {
  useEffect(() => {
    const updateThemeClass = () => {
      if (document.documentElement.classList.contains('dark')) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    };

    // Initial check
    updateThemeClass();

    // Set up a MutationObserver to watch for changes to the 'class' attribute of <html>
    const observer = new MutationObserver(updateThemeClass);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Topbar />
          <main className="flex-grow pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blogs" element={<Blogs />} />  {/* Add this line */}
              </Routes>
            </div>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
