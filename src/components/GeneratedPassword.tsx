import { GeneratedPasswordProps } from "../types/Types"
import { useCopyToClipboard } from "../helpers/CopyToClipboard"

const GeneratedPassword = ({ generatedPassword }: GeneratedPasswordProps) => {
	const handleCopyToClipboard = useCopyToClipboard(generatedPassword)

	return (
		<div
			data-theme="dark"
			className="card card-compact w-96 bg-base-100 border-black shadow-xl flex-row items-center p-2"
		>
			{/* Display generated password */}
			<p className="flex-1 p-1 italic">{generatedPassword}</p>

			{/* Button to copy password to clipboard */}
			<button className="btn btn-primary" onClick={handleCopyToClipboard}>
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
