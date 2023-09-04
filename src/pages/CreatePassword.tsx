import { useState } from "react"
import GeneratedPassword from "../components/GeneratedPassword"
import PasswordGenerator from "../components/PasswordGenerator"
import { Password, User } from "../types/Types"
import { useUser } from "@clerk/clerk-react"
import { useNavigate } from "react-router-dom"
import { DbContext } from "../context/DbContext"
import { useContext } from "react"
import NavBar from "../components/NavBar"

const CreatePassword: React.FC = () => {
	// Fetch user data from context and Clerk
	const usersDb = useContext(DbContext)
	const { user } = useUser()
	const userID: string | undefined = user?.id

	// State to hold the generated password and the users' database
	const [generatedPassword, setGeneratedPassword] = useState<Password | null>()
	const [usersDB, setUsersDB] = useState<User[] | undefined>(usersDb)

	// Initialize the navigation hook
	const navigate = useNavigate()

	// Handle generated password event
	const handlePasswordGenerated = (password: Password) => {
		setGeneratedPassword(password)
	}

	// Handle password name change event
	const handlePasswordNameChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const newName = event.target.value
		setGeneratedPassword((prevPassword) => ({
			...prevPassword,
			name: newName,
			_password: prevPassword?._password || "",
			variables: prevPassword?.variables || {
				characterLength: 0,
				upperCase: false,
				lowerCase: true,
				numbers: false,
				symbols: false,
			},
		}))
	}

	// Handle adding a password
	async function addPasswordHandler() {
		if (user && generatedPassword) {
			let errorMessage = ""
			switch (true) {
				case !generatedPassword._password:
				case generatedPassword._password.trim().length === 0:
					errorMessage = "The password cannot be empty."
					break
				case generatedPassword._password
					.trim()
					.split("")
					.every((char) => char === "*"):
					errorMessage = "The password cannot consist entirely of asterisks."
					break
				case !generatedPassword.name:
					errorMessage = "The password must have an assigned name."
					break
			}
			if (errorMessage) {
				alert(errorMessage)
				return
			}

			const newPassword: Password = {
				_password: generatedPassword._password,
				name: generatedPassword.name,
				variables: {
					characterLength: generatedPassword.variables.characterLength,
					upperCase: generatedPassword.variables.upperCase,
					lowerCase: generatedPassword.variables.lowerCase,
					numbers: generatedPassword.variables.numbers,
					symbols: generatedPassword.variables.symbols,
				},
			}

			if (usersDB) {
				const existingUserIndex = usersDB.findIndex(
					(userData) => userData.id === userID
				)

				if (existingUserIndex !== -1) {
					// User exists, update their password array
					const updatedUsers = usersDB.map((userData, index) =>
						index === existingUserIndex
							? { ...userData, passwords: [...userData.passwords, newPassword] }
							: userData
					)

					try {
						await updateDatabase(updatedUsers)
					} catch (error) {
						console.error("Error updating database:", error)
					}
				} else {
					// User does not exist, create a new user entry
					const newUser: User = {
						id: userID || "",
						passwords: [newPassword],
					}

					const updatedUsers = [...usersDB, newUser]

					try {
						await updateDatabase(updatedUsers)
					} catch (error) {
						console.error("Error updating database:", error)
					}
				}
			}

			// Navigate to user-passwords page
			navigate("/user-passwords")
		}
	}

	// Update the users' database and set state
	async function updateDatabase(updatedUsers: User[]) {
		setUsersDB(updatedUsers)
		await fetch(
			"https://password-generator-57bd8-default-rtdb.firebaseio.com/passwords.json",
			{
				method: "PUT",
				body: JSON.stringify(updatedUsers),
				headers: {
					"Content-Type": "application/json",
				},
			}
		)
	}

	return (
		<div className="flex flex-col justify-center items-center gap-8">
			{/* Render the navigation bar */}
			<NavBar />

			{/* Render the generated password component */}
			<GeneratedPassword
				generatedPassword={
					generatedPassword || {
						_password: "",
						name: "",
						variables: {
							characterLength: 0,
							upperCase: false,
							lowerCase: true,
							numbers: false,
							symbols: false,
						},
					}
				}
			/>

			{/* Render the password generator component */}
			<PasswordGenerator onPasswordGenerated={handlePasswordGenerated} />

			{/* Button to open the password creation modal */}
			<div className="flex flex-col items-center mb-8">
				<button
					className="btn btn-primary"
					onClick={() => window.my_modal_1.showModal()}
				>
					CREATE PASSWORD
				</button>
			</div>

			{/* Password creation modal */}
			<dialog id="my_modal_1" className="modal">
				<form method="dialog" className="modal-box">
					<p className="py-4">Name</p>
					<input
						type="text"
						placeholder="Type here"
						className="input input-bordered w-full"
						onChange={handlePasswordNameChange}
					/>
					<p className="py-4">Password</p>
					<input
						type="text"
						placeholder={generatedPassword?._password}
						className="input input-bordered w-full"
						disabled
					/>
					<div className="modal-action">
						<button className="btn btn-primary" onClick={addPasswordHandler}>
							Save
						</button>
						<button className="btn">Close</button>
					</div>
				</form>
			</dialog>
		</div>
	)
}

export default CreatePassword
