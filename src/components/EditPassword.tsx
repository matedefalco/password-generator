import { useState, useContext } from "react"
import { Password, User } from "../types/Types"
import { useUser } from "@clerk/clerk-react"
import { DbContext } from "../context/DbContext"

const EditPassword = ({ password, userPasswords, updateUserPasswords }) => {
	console.log("Suka ~ file: EditPassword.tsx:7 ~ password:", password)
	const { user } = useUser()
	const usersDb = useContext<User[] | undefined>(DbContext)

	const [editingPassword, setEditingPassword] = useState<Password | null>(null)
	const [prevPasswordName, setPrevPasswordName] = useState<string | undefined>()
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

			updateUserPasswords(updatedPasswords)

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
		<div>
			<button
				className="btn join-item bg-gray-300"
				onClick={() => {
					window[`my_modal_${password}`].showModal()
					setPrevPasswordName(password)
				}}
			>
				<img
					alt="edit"
					src="https://cdn-icons-png.flaticon.com/512/1827/1827951.png"
					className="lg:w-5 sm:w-4 lg:h-5 sm:h-4"
				/>
			</button>
			<dialog id={`my_modal_${password}`} className="modal">
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
						onChange={(event) => handleEditChange("_password", event)}
					/>
					<div className="modal-action">
						<button className="btn btn-primary" onClick={editPasswordHandler}>
							Save
						</button>
						<button className="btn">Close</button>
					</div>
				</form>
			</dialog>
		</div>
	)
}

export default EditPassword
