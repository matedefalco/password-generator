import { useState } from "react"
import GeneratedPassword from "./GeneratedPassword"
import PasswordGenerator from "./PasswordGenerator"
import { Password, User } from "../types/Types"
import { useUser } from "@clerk/clerk-react"
import { useDbContext } from "../context/DbContext"

const CreatePassword: React.FC = () => {
	const usersDb = useDbContext()
	const { user } = useUser()
	const userID: string | undefined = user?.id
	const [generatedPassword, setGeneratedPassword] = useState<Password | null>()
	const [usersDB, setUsersDB] = useState<User[]>(usersDb)

	const handlePasswordGenerated = (password: Password) => {
		setGeneratedPassword(password)
	}

	async function addPasswordHandler() {
		if (user && generatedPassword) {
			const newPassword: Password = {
				_password: generatedPassword._password,
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
				usersDB !== null
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
		}
	}

	return (
		<div className="sm:p-4 flex flex-col justify-center items-center gap-4">
			<GeneratedPassword
				generatedPassword={
					generatedPassword || {
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
			/>
			<PasswordGenerator onPasswordGenerated={handlePasswordGenerated} />
			<button className="btn btn-primary w-75" onClick={addPasswordHandler}>
				SAVE PASSWORD
			</button>
		</div>
	)
}

export default CreatePassword
