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

	const handlePasswordGenerated = (password: Password) => {
		setGeneratedPassword(password)
	}

	const fetchPasswordsHandler = useCallback(async () => {
		try {
			const response = await fetch(
				"https://password-generator-57bd8-default-rtdb.firebaseio.com/passwords.json"
			)
			if (!response.ok) {
				throw new Error("Something went wrong")
			}

			const dataDB: User[] = await response.json()
			console.log("Suka ~ file: App.tsx:34 ~ dataDB:", dataDB)
			setUsersDB(dataDB)
		} catch (error) {
			console.error("Error fetching data:", error)
		}
	}, [])

	useEffect(() => {
		fetchPasswordsHandler()
	}, [fetchPasswordsHandler])

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
			console.log("Suka ~ file: App.tsx:58 ~ newPassword:", generatedPassword)

			const existingUserIndex = usersDB.findIndex(
				(userData) => userData.id === userID
			)

			if (existingUserIndex !== -1) {
				// User exists, update their password array
				const updatedUsers = [...usersDB]
				updatedUsers[existingUserIndex].passwords.push(newPassword)
				setUsersDB(updatedUsers)
			} else {
				// User does not exist, create a new user entry
				const userDB: User = {
					id: userID || "",
					passwords: [newPassword],
				}

				try {
					const response = await fetch(
						"https://password-generator-57bd8-default-rtdb.firebaseio.com/passwords.json",
						{
							method: "POST",
							body: JSON.stringify(userDB),
							headers: {
								"Content-Type": "application/json",
							},
						}
					)

					const data = await response.json()
					console.log("Data after adding password:", data)
				} catch (error) {
					console.error("Error adding password:", error)
				}
			}
		}
	}

	// const currentUser = usersDB.find((userData) => userData.id === user?.id)
	// const currentUserPasswords = currentUser?.passwords || []

	return (
		<main className="flex flex-col justify-center items-center w-screen h-screen gap-8 p-4">
			<h1 className="text-2xl text-slate-500">Password generator</h1>
			<div className="sm:p-4 flex flex-col justify-center gap-4">
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
				<button onClick={fetchPasswordsHandler}>FETCH DATA</button>
				<button onClick={addPasswordHandler}>ADD PASSWORD</button>
			</div>
			<footer className="flex flex-col gap-2 items-center">
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
