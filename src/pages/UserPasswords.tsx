import { useState, useEffect } from "react"
import { useUser } from "@clerk/clerk-react"
import { Password } from "../types/Types"
import { Link } from "react-router-dom"
import { DbContext } from "../context/DbContext"
import { useContext } from "react"
import { User } from "../types/Types"
import NavBar from "../components/NavBar"
import ClipboardButton from "../components/ClipboardButton"
import EditPassword from "../components/EditPassword"

const UserPasswords = () => {
	// Fetch the current user and user database from context
	const { user } = useUser()
	const usersDb = useContext<User[] | undefined>(DbContext)

	// Initialize state for user passwords and password visibility
	const [userPasswords, setUserPasswords] = useState<Password[]>([])
	const [passwordVisibility, setPasswordVisibility] = useState<{
		[key: string]: boolean
	}>({})

	// Function to toggle password visibility
	const togglePasswordVisibility = (passwordName: string) => {
		setPasswordVisibility((prevState) => ({
			...prevState,
			[passwordName]: !prevState[passwordName],
		}))
	}

	// Function to update user passwords in state
	const updateUserPasswords = (updatedPasswords: Password[]) => {
		setUserPasswords(updatedPasswords)
	}

	useEffect(() => {
		// Fetch user passwords from the database when user and usersDb are available
		if (user && usersDb !== undefined) {
			const currentUser = usersDb.find((userData) => userData.id === user.id)
			if (currentUser) {
				setUserPasswords(currentUser.passwords)
			}
		}
	}, [user, usersDb])

	return (
		<div className="flex flex-col gap-8 items-center justify-center">
			<NavBar />
			<Link to={`/create-password`}>
				{/* Button to create a new password */}
				<button className="btn btn-primary w-full">NEW PASSWORD</button>
			</Link>
			{userPasswords.length !== 0 ? (
				// Display user passwords if they exist
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 w-[80%]">
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
										{/* Button to copy password to clipboard */}
										<ClipboardButton password={password._password} />
										<button
											className="btn join-item bg-blue-500"
											onClick={() =>
												togglePasswordVisibility(
													password.name ? password.name : ""
												)
											}
										>
											{/* Button to toggle password visibility */}
											<img
												alt="show"
												src="https://www.svgrepo.com/show/45216/eye-view-interface-symbol.svg"
												className="lg:w-5 sm:w-4 lg:h-5 sm:h-4"
											/>
										</button>
										{/* EditPassword component to edit the password */}
										<EditPassword
											passwordName={password.name}
											passwordValue={password._password}
											userPasswords={userPasswords}
											updateUserPasswords={updateUserPasswords}
										/>
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
