import WelcomeMessage from '../components/WelcomeMessage'
import ThreeDScene from '../components/ThreeDScene'

function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <WelcomeMessage />
      <div className="w-full max-w-4xl mt-8">
        <ThreeDScene />
      </div>
    </div>
  )
}

export default Home