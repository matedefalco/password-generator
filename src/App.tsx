import { useState } from "react"
import PasswordGenerator from "./components/PasswordGenerator"
import GeneratedPassword from "./components/GeneratedPassword"

const imgUrls = [
	"https://cdn1.iconfinder.com/data/icons/programing-development-8/24/react_logo-512.png",
	"https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/2048px-Typescript_logo_2020.svg.png",
	"https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/tailwind-css-icon.png",
	"https://raw.githubusercontent.com/saadeghi/daisyui/master/src/docs/static/images/daisyui-logo/favicon-192.png",
]

const App = () => {
	const [generatedPassword, setGeneratedPassword] = useState<string>("")

	const handlePasswordGenerated = (password: string) => {
		setGeneratedPassword(password)
	}

	return (
		<main className="flex flex-col justify-center items-center w-screen h-screen gap-8">
			<h1 className="text-2xl text-slate-500">Password generator</h1>
			<GeneratedPassword generatedPassword={generatedPassword} />
			<PasswordGenerator onPasswordGenerated={handlePasswordGenerated} />{" "}
			<footer className="flex flex-col gap-2 items-center">
				<p>Made with:</p>
				<ul className="flex gap-2">
					{imgUrls.map((url, index) => (
						<li key={index} className="references">
							<img
								alt={`Image ${index}`}
								className="w-8 h-8 object-contain"
								src={url}
							/>
						</li>
					))}
				</ul>
			</footer>
		</main>
	)
}

export default App
