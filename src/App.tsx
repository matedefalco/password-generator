import { useState } from "react"
import PasswordGenerator from "./components/PasswordGenerator"
import GeneratedPassword from "./components/GeneratedPassword"

const App = () => {
	const [generatedPassword, setGeneratedPassword] = useState<string>("")

	const handlePasswordGenerated = (password: string) => {
		setGeneratedPassword(password)
	}

	return (
		<main className="flex flex-col justify-center items-center w-screen h-screen gap-8">
			<h1 className="text-2xl text-slate-500">Password generator</h1>
			<GeneratedPassword generatedPassword={generatedPassword} />
			<PasswordGenerator onPasswordGenerated={handlePasswordGenerated} />
		</main>
	)
}

export default App
