import { useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"

const ClipboardButton = ({ password }) => {
	const [state, setState] = useState({ value: "", copied: false })

	return (
		<button className="btn join-item bg-violet-800 rounded-lg">
			<CopyToClipboard
				text={password}
				onCopy={() => setState({ ...state, copied: true })}
			>
				<img
					alt="clipboard"
					src="https://icongr.am/clarity/clipboard.svg?size=128&color=ffffff"
					className="lg:w-5 sm:w-4 lg:h-5 sm:h-4"
				/>
			</CopyToClipboard>
		</button>
	)
}

export default ClipboardButton
