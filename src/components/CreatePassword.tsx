import { useState } from "react"
import GeneratedPassword from "./GeneratedPassword"
import PasswordGenerator from "./PasswordGenerator"
import { Password, User } from "../types/Types"
import { useUser } from "@clerk/clerk-react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { DbContext } from "../context/DbContext"
import { useContext } from "react"

const CreatePassword: React.FC = () => {
	const usersDb = useContext(DbContext)
	const { user } = useUser()
	const userID: string | undefined = user?.id
	const [generatedPassword, setGeneratedPassword] = useState<Password | null>()
	const [usersDB, setUsersDB] = useState<User[] | undefined>(usersDb)

	const navigate = useNavigate()

	const handlePasswordGenerated = (password: Password) => {
		setGeneratedPassword(password)
	}

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

			// Verifies if usersDB is empty or not, before using findIndex
			const existingUserIndex =
				usersDB !== undefined
					? usersDB.findIndex((userData) => userData.id === userID)
					: -1

			if (existingUserIndex !== -1) {
				// User exists, update their password array
				const updatedUsers = [...usersDB]
				updatedUsers[existingUserIndex].passwords.push(newPassword)
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
			} else {
				// User does not exist, create a new user entry
				const newUser: User = {
					id: userID || "",
					passwords: [newPassword],
				}

				setUsersDB([newUser])

				try {
					await fetch(
						"https://password-generator-57bd8-default-rtdb.firebaseio.com/passwords.json",
						{
							method: "POST",
							body: JSON.stringify(usersDB),
							headers: {
								"Content-Type": "application/json",
							},
						}
					)
				} catch (error) {
					console.error("Error adding password:", error)
				}
			}

			navigate("/user-passwords")
		}
	}

	return (
		<div className="sm:p-4 flex flex-col justify-center items-center gap-8">
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
			<PasswordGenerator onPasswordGenerated={handlePasswordGenerated} />
			{/* Open the modal using ID.showModal() method */}
			<div className="flex flex-col items-center gap-4 lg:flex-row lg:justify-between lg:w-[30%]">
				<Link to={`/`}>
					<button className="btn btn-neutral">GO BACK</button>
				</Link>
				<button
					className="btn btn-primary"
					onClick={() => window.my_modal_1.showModal()}
				>
					CREATE PASSWORD
				</button>
			</div>
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
