import React, { useState, useRef, useEffect } from "react"
import Password from "../types/Types"

const PasswordGenerator = () => {
	const [password, setPassword] = useState<Password>({
		_password: "",
		variables: {
			characterLength: 8,
			upperCase: false,
			lowerCase: false,
			numbers: false,
			symbols: false,
		},
	})
	const passwordRef = useRef<string | null>(null)

	useEffect(() => {
		generatePassword()
	}, [password.variables])

	const handleCharacterLengthChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const length = parseInt(event.target.value)
		setPassword((prevPassword) => ({
			...prevPassword,
			variables: {
				...prevPassword.variables,
				characterLength: length,
			},
		}))
	}

	const handleCheckboxChange = (
		field: keyof Password["variables"],
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const value = event.target.checked
		setPassword((prevPassword) => ({
			...prevPassword,
			variables: {
				...prevPassword.variables,
				[field]: value,
			},
		}))
	}

	const generatePassword = () => {
		const lowercaseChars = "abcdefghijklmnopqrstuvwxyz"
		const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
		const numberChars = "0123456789"
		const symbolChars = "!@#$%^&*"

		let allowedChars = " "
		if (password.variables.lowerCase) allowedChars += lowercaseChars
		if (password.variables.upperCase) allowedChars += uppercaseChars
		if (password.variables.numbers) allowedChars += numberChars
		if (password.variables.symbols) allowedChars += symbolChars

		let newPassword = ""
		for (let i = 0; i < password.variables.characterLength; i++) {
			const randomIndex = Math.floor(Math.random() * allowedChars.length)
			newPassword += allowedChars[randomIndex]
		}

		setPassword((prevPassword) => ({
			...prevPassword,
			_password: newPassword,
		}))

		passwordRef.current = password._password
	}

	const getSecurityPercentage = () => {
		const totalOptions = passwordProperties.length
		const activeOptions = passwordProperties.filter(
			(property) => password.variables[property]
		).length
		return (activeOptions / totalOptions) * 100
	}

	const passwordProperties = Object.keys(password.variables).filter(
		(key) => key !== "characterLength" && key !== "_password"
	) as Array<keyof Password["variables"]>

	return (
		<div data-theme="dark" className="card w-96 bg-base-100 shadow-xl">
			<div className="card-body gap-8">
				{/* CHARACTER LENGTH */}
				<div className="flex flex-col gap-2">
					<div className="flex justify-between items-center">
						<h2 className="card-title flex-1">Character length</h2>
						<p className="text-slate-200 text-2xl flex-none">
							{password.variables.characterLength}
						</p>
					</div>
					<input
						type="range"
						min={1}
						max={20}
						value={password.variables.characterLength}
						onChange={handleCharacterLengthChange}
						className="range"
					/>
				</div>
				{/* INPUTS */}
				<div className="flex flex-col gap-2">
					{passwordProperties.map((property) => (
						<div className="flex p-1 gap-4" key={property}>
							<input
								type="checkbox"
								checked={password.variables[property]}
								onChange={(e) => handleCheckboxChange(property, e)}
								className="checkbox"
							/>
							<p>Include {property}</p>
						</div>
					))}
				</div>
				{password._password}
				{/* SECURITY COUNTER */}
				<div className="flex flex-col gap-2">
					<p>Security: {getSecurityPercentage()}%</p>
				</div>
			</div>
		</div>
	)
}

export default PasswordGenerator
