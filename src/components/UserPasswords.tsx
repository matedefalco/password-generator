import { useState, useEffect } from "react"
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
	const [editingPassword, setEditingPassword] = useState<Password | null>(null)
	const [prevPasswordName, setPrevPasswordName] = useState<string | undefined>()
	const [userPasswords, setUserPasswords] = useState<Password[]>([])
	const [passwordVisibility, setPasswordVisibility] = useState<{
		[key: string]: boolean
	}>({})

	const togglePasswordVisibility = (passwordName: string) => {
		setPasswordVisibility((prevState) => ({
			...prevState,
			[passwordName]: !prevState[passwordName],
		}))
	}

	useEffect(() => {
		if (user && usersDb !== undefined) {
			const currentUser = usersDb.find((userData) => userData.id === user.id)
			if (currentUser) {
				setUserPasswords(currentUser.passwords)
			}
		}
	}, [user, usersDb])

	const handleEditChange = (
		field: "name" | "_password",
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const newValue = event.target.value

		setEditingPassword((prevPassword: Password | null) => {
			if (prevPassword) {
				return {
					...prevPassword,
					[field]: newValue || prevPassword[field] || "",
				}
			} else {
				return {
					name: "",
					_password: "",
					variables: {
						characterLength: 0,
						upperCase: false,
						lowerCase: true,
						numbers: false,
						symbols: false,
					},
				}
			}
		})
	}

	const editPasswordHandler = async () => {
		if (editingPassword) {
			let errorMessage = ""

			// Realizar las validaciones necesarias para el campo _password
			if (
				!editingPassword._password ||
				editingPassword._password.trim().length === 0
			) {
				errorMessage = "The password cannot be empty."
			} else if (
				editingPassword._password
					.trim()
					.split("")
					.every((char) => char === "*")
			) {
				errorMessage = "The password cannot consist entirely of asterisks."
			}

			// Realizar las validaciones necesarias para el campo name
			if (!editingPassword.name) {
				errorMessage = "The password must have an assigned name."
			}

			if (errorMessage) {
				alert(errorMessage)
				return
			}

			const updatedPasswords = userPasswords.map((password) =>
				prevPasswordName && password.name === prevPasswordName
					? editingPassword
					: password
			)

			setUserPasswords(updatedPasswords)

			// Lógica de actualización en el backend
			const usersDBCopy = usersDb ? [...usersDb] : []

			const currentUserIndex =
				user !== null && user !== undefined
					? usersDBCopy.findIndex((userData) => userData.id === user.id)
					: -1

			if (currentUserIndex !== -1) {
				usersDBCopy[currentUserIndex].passwords = updatedPasswords

				try {
					await fetch(
						"https://password-generator-57bd8-default-rtdb.firebaseio.com/passwords.json",
						{
							method: "PUT",
							body: JSON.stringify(usersDBCopy),
							headers: {
								"Content-Type": "application/json",
							},
						}
					)
				} catch (error) {
					console.error("Error updating password:", error)
				}
			}

			setEditingPassword(null)
			setPrevPasswordName(undefined)
		}
	}

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
									<p>
										{passwordVisibility[password.name ? password.name : ""]
											? password._password
											: password._password.replace(/./g, "*")}
									</p>
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
										<button
											className="btn join-item bg-blue-500"
											onClick={() =>
												togglePasswordVisibility(
													password.name ? password.name : ""
												)
											}
										>
											<img
												alt="show"
												src="https://www.svgrepo.com/show/45216/eye-view-interface-symbol.svg"
												className="w-5 h-5"
											/>
										</button>
										<button
											className="btn join-item bg-gray-300"
											onClick={() => {
												window[`my_modal_${password.name}`].showModal()
												setPrevPasswordName(password.name)
											}}
										>
											<img
												alt="edit"
												src="https://cdn-icons-png.flaticon.com/512/1827/1827951.png"
												className="w-5 h-5"
											/>
										</button>
										<dialog id={`my_modal_${password.name}`} className="modal">
											<form method="dialog" className="modal-box">
												<p className="py-4">Name</p>
												<input
													type="text"
													placeholder="Type here"
													className="input input-bordered w-full"
													value={editingPassword?.name || ""}
													onChange={(event) => handleEditChange("name", event)}
												/>
												<p className="py-4">Password</p>
												<input
													type="text"
													placeholder={password._password}
													className="input input-bordered w-full"
													value={editingPassword?._password || ""}
													onChange={(event) =>
														handleEditChange("_password", event)
													}
												/>
												<div className="modal-action">
													<button
														className="btn btn-primary"
														onClick={editPasswordHandler}
													>
														Save
													</button>
													<button className="btn">Close</button>
												</div>
											</form>
										</dialog>
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
