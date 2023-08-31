import { useState, useEffect } from "react"
import { useDbContext } from "../context/DbContext"
import { useUser } from "@clerk/clerk-react"
import { Password } from "../types/Types"
import { Link } from "react-router-dom"
import { CopyToClipboard } from "react-copy-to-clipboard"

const UserPasswords = () => {
	const [state, setState] = useState({ value: "", copied: false })
	const { user } = useUser()
	const usersDb = useDbContext()

	const [userPasswords, setUserPasswords] = useState<Password[]>([])

	useEffect(() => {
		if (user) {
			const currentUser = usersDb.find((userData) => userData.id === user.id)
			if (currentUser) {
				setUserPasswords(currentUser.passwords)
			}
		}
	}, [user, usersDb])

	return (
		<div className="flex flex-col gap-8 items-center justify-center my-8">
			<Link to={`/create-password`}>
				<button className="btn btn-primary w-full">NEW PASSWORD</button>
			</Link>
			{userPasswords ? (
				<div className="flex flex-col gap-4">
					{userPasswords.map((password) => (
						<div
							key={password.name}
							tabIndex={0}
							className="collapse border border-base-300 bg-base-200 w-full"
						>
							<div className="collapse-title text-xl font-medium">
								{password.name}
							</div>
							<div className="collapse-content flex justify-between items-center">
								<p>{password._password}</p>
								<CopyToClipboard
									text={password._password}
									onCopy={() => setState({ ...state, copied: true })}
								>
									<button className="bg-violet-800 p-2 rounded-lg">
										<img
											alt="clipboard"
											src="https://icongr.am/clarity/clipboard.svg?size=128&color=ffffff"
											className="w-5 h-5"
										/>
									</button>
								</CopyToClipboard>
							</div>
						</div>
					))}
				</div>
			) : (
				"No passwords created"
			)}
		</div>
	)
}

export default UserPasswords
