import React, { useCallback, useEffect, useState } from "react"
import PasswordGenerator from "./components/PasswordGenerator"
import GeneratedPassword from "./components/GeneratedPassword"
import { Password, User } from "./types/Types"
import { useUser } from "@clerk/clerk-react"

const imgUrls = [
	"https://cdn1.iconfinder.com/data/icons/programing-development-8/24/react_logo-512.png",
	"https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/2048px-Typescript_logo_2020.svg.png",
	"https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/tailwind-css-icon.png",
	"https://raw.githubusercontent.com/saadeghi/daisyui/master/src/docs/static/images/daisyui-logo/favicon-192.png",
]

const App: React.FC = () => {
	const { user } = useUser()
	const userID: string | undefined = user?.id

	const [generatedPassword, setGeneratedPassword] = useState<Password | null>()
	const [usersDB, setUsersDB] = useState<User[]>([])

	// Fetch data when the component loads
	useEffect(() => {
		const fetchPasswordsHandler = async () => {
			try {
				const response = await fetch(
					"https://password-generator-57bd8-default-rtdb.firebaseio.com/passwords.json"
				)
				if (!response.ok) {
					throw new Error("Something went wrong")
				}

				const dataDB: User[] = await response.json()
				setUsersDB(dataDB)
			} catch (error) {
				console.error("Error fetching data:", error)
			}
		}

		fetchPasswordsHandler()
	}, [])

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
		<main className="flex flex-col justify-center items-center w-full h-full my-8 gap-4 p-4">
			<h1 className="text-2xl text-slate-500">Password generator</h1>
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
			<footer className="flex flex-col gap-2 items-center mb-8">
				<p>Made with:</p>
				<ul className="flex gap-2">
					{imgUrls.map((url, index) => (
						<li key={index} className="references">
							<img
								alt={`Image ${index}`}
								className="w-8 h-8 object-contain"
								src={url}
							/>
						</li>
					))}
				</ul>
			</footer>
		</main>
	)
}

export default App
