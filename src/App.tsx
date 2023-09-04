import NavBar from "./components/NavBar"
import References from "./components/References"
import Welcome from "./components/Welcome"

const App: React.FC = () => {
	return (
		<main className="flex flex-col justify-between w-full h-full gap-4 ">
			<NavBar />
			<Welcome />
			<References />
		</main>
	)
}

export default App
