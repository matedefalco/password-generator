import PasswordGenerator from "./components/PasswordGenerator"
import GeneratedPassword from "./components/GeneratedPassword"

function App() {
	return (
		<main className="flex flex-col justify-center items-center w-screen h-screen gap-8">
			<h1 className="text-2xl text-slate-400">Password generator</h1>
			<GeneratedPassword />
			<PasswordGenerator />
		</main>
	)
}

export default App
