import React from "react"

interface GeneratedPasswordProps {
	password: string
}

const dummyPassword: string = "Suggested password"

const GeneratedPassword: React.FC<GeneratedPasswordProps> = ({ password }) => {
	const copyToClipboard = () => {
		const textField = document.createElement("textarea")
		password !== undefined
			? (textField.value = password)
			: (textField.value = dummyPassword)
		document.body.appendChild(textField)
		textField.select()
		document.execCommand("copy")
		textField.remove()
	}

	return (
		<div
			data-theme="dark"
			className="card card-compact w-96 bg-base-100 border-black shadow-xl flex-row items-center p-2"
		>
			<p className="flex-1 p-1 italic">{password || dummyPassword}</p>
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
