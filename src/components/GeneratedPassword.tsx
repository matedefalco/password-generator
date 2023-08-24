import { useState, useRef } from "react"

const GeneratedPassword: React.FC = () => {
	const [password] = useState("generated_password")
	const passwordRef = useRef<HTMLInputElement>(null)

	const copyToClipboard = () => {
		if (passwordRef.current) {
			passwordRef.current.select()
			document.execCommand("copy")
		}
	}

	return (
		<div
			data-theme="dark"
			className="card card-compact w-96 bg-base-100 border-black shadow-xl flex-row items-center p-2"
		>
			<p className="flex-1 p-1" ref={passwordRef}>
				{password}
			</p>
			<button className="btn btn-primary" onClick={copyToClipboard}>
				<img
					alt="clipboard"
					src="https://icongr.am/clarity/clipboard.svg?size=128&color=ffffff"
					className="w-8 h-8"
				/>
			</button>
		</div>
	)
}

export default GeneratedPassword
