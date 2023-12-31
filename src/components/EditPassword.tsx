import { useState, useContext } from "react"
import { Password, User } from "../types/Types"
import { useUser } from "@clerk/clerk-react"
import { DbContext } from "../context/DbContext"

const EditPassword = ({
	passwordName,
	passwordValue,
	userPasswords,
	updateUserPasswords,
}) => {
	// Fetch user data and user database from context
	const { user } = useUser()
	const usersDb = useContext<User[] | undefined>(DbContext)

	// Initialize state for editing password and previous password name
	const [editingPassword, setEditingPassword] = useState<Password | null>({
		name: passwordName,
		_password: passwordValue,
		variables: {
			characterLength: 0,
			upperCase: false,
			lowerCase: true,
			numbers: false,
			symbols: false,
		},
	})
	const [prevPasswordName, setPrevPasswordName] = useState<string | undefined>()

	// Handle changes in the edit fields
	const handleEditChange = (field: "name" | "_password", newValue: string) => {
		setEditingPassword((prevPassword: Password | null) => {
			if (prevPassword) {
				return {
					...prevPassword,
					[field]: newValue || prevPassword[field] || "",
				}
			} else {
				return {
					name: passwordName,
					_password: passwordValue,
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

	// Handle password edit submission
	const editPasswordHandler = async () => {
		if (editingPassword) {
			let errorMessage = ""

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

			if (!editingPassword.name) {
				errorMessage = "The password must have an assigned name."
			}

			if (errorMessage) {
				alert(errorMessage)
				return
			}

			const updatedPasswords = userPasswords.map((p) =>
				prevPasswordName === passwordName ? editingPassword : p
			)

			updateUserPasswords(updatedPasswords)

			// Backend update logic
			const usersDBCopy = usersDb ? [...usersDb] : []

			const currentUserIndex = usersDBCopy.findIndex(
				(userData) => userData.id === user?.id
			)

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

			// Reset state
			setEditingPassword(null)
			setPrevPasswordName(undefined)
		}
	}

	return (
		<div>
			{/* Button to open the modal */}
			<button
				className="btn join-item bg-gray-300"
				onClick={() => {
					window[`my_modal_${passwordName}`].showModal()
					setPrevPasswordName(passwordName)
				}}
			>
				<img
					alt="edit"
					src="https://cdn-icons-png.flaticon.com/512/1827/1827951.png"
					className="lg:w-5 sm:w-4 lg:h-5 sm:h-4"
				/>
			</button>
			{/* Modal for editing */}
			<dialog id={`my_modal_${passwordName}`} className="modal">
				<form method="dialog" className="modal-box">
					<p className="py-4">Name</p>
					<input
						type="text"
						placeholder={passwordName}
						className="input input-bordered w-full text-gray-700"
						value={editingPassword?.name || passwordName}
						onChange={(event) => {
							handleEditChange("name", event.target.value)
						}}
					/>
					<p className="py-4">Password</p>
					<input
						type="text"
						placeholder={passwordValue}
						className="input input-bordered w-full text-gray-700"
						value={editingPassword?._password || passwordValue}
						onChange={(event) => {
							handleEditChange("_password", event.target.value)
						}}
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
