import React, { useEffect, useState, createContext } from "react"
import { User, DbContextProviderProps } from "../types/Types"

// Create context
export const DbContext = createContext<User[] | undefined>(undefined)

export const DbContextProvider: React.FC<DbContextProviderProps> = ({
	children,
}) => {
	const [usersDB, setUsersDB] = useState<User[] | undefined>(undefined)

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

	return <DbContext.Provider value={usersDB}>{children}</DbContext.Provider>
}
