import Navigation from './Navigation'
import ThemeToggle from './ThemeToggle'

function Topbar() {
  return (
    <div className="w-full bg-background shadow-md fixed top-0 left-0 right-0 z-10">
      <div className="max-w-full px-4 sm:px-6 lg:px-8"> {/* Changed max-w-7xl to max-w-full */}
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 w-10"> {/* Added width to balance layout */}
            {/* You can add a logo or site title here if desired */}
          </div>
          <Navigation />
          <div className="flex-shrink-0 w-10 flex justify-end"> {/* Added width and flex properties */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Topbar