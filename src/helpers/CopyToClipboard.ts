export const useCopyToClipboard = (text: string) => {
	const handleCopy = () => {
		const textField = document.createElement("textarea")
		textField.value = text
		document.body.appendChild(textField)
		textField.select()
		document.execCommand("copy")
		textField.remove()
	}

	return handleCopy
}
