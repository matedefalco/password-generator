import PasswordGenerator from "./components/PasswordGenerator"
import GeneratedPassword from "./components/GeneratedPassword"
import { useRef } from "react"

const App = () => {
	const generatedPasswordRef = useRef<string | null>(null)

	const handlePasswordGenerated = (password: string) => {
		generatedPasswordRef.current = password
	}

	return (
		<main className="flex flex-col justify-center items-center w-screen h-screen gap-8">
			<h1 className="text-2xl text-slate-500">Password generator</h1>
			<GeneratedPassword forwardedRef={generatedPasswordRef} />
			<PasswordGenerator onPasswordGenerated={handlePasswordGenerated} />
		</main>
	)
}

export default App
