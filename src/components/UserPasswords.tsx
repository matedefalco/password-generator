import { useState, useEffect } from "react"
// import { useDbContext } from "../context/DbContext"
import { useUser } from "@clerk/clerk-react"
import { Password } from "../types/Types"
import { Link } from "react-router-dom"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { DbContext } from "../context/DbContext"
import { useContext } from "react"
import { User } from "../types/Types"

const UserPasswords = () => {
	const [state, setState] = useState({ value: "", copied: false })
	const { user } = useUser()
	const usersDb = useContext<User[] | undefined>(DbContext)

	const [userPasswords, setUserPasswords] = useState<Password[]>([])

	useEffect(() => {
		if (user && usersDb !== undefined) {
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
			{userPasswords.length !== 0 ? (
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
					{userPasswords.map((password) => (
						<div
							key={password.name}
							tabIndex={0}
							className="card w-96 shadow-xl border border-base-300 bg-base-200 w-full"
						>
							<div className="card-body">
								<p className="text-xl font-medium">{password.name}</p>
								<div className="flex justify-between items-center">
									<p>{password._password}</p>
									<div className="join">
										<button className="btn join-item bg-violet-800 rounded-lg">
											<CopyToClipboard
												text={password._password}
												onCopy={() => setState({ ...state, copied: true })}
											>
												<img
													alt="clipboard"
													src="https://icongr.am/clarity/clipboard.svg?size=128&color=ffffff"
													className="w-5 h-5"
												/>
											</CopyToClipboard>
										</button>
										<button className="btn join-item bg-gray-300">
											<img
												alt="clipboard"
												src="https://cdn-icons-png.flaticon.com/512/1827/1827951.png"
												className="w-5 h-5"
											/>
										</button>
									</div>
								</div>
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
