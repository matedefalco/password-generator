const GeneratedPassword = ({
	forwardedRef,
}: {
	forwardedRef: React.MutableRefObject<string | null>
}) => {
	console.log(
		"Suka ~ file: GeneratedPassword.tsx:6 ~ forwardedRef:",
		forwardedRef
	)
	const copyToClipboard = () => {
		const textField = document.createElement("textarea")
		textField.value = forwardedRef.current
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
			<p className="flex-1 p-1 italic">{forwardedRef.current}</p>
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
