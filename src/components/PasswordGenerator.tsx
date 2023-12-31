import React, { useState, useEffect, useMemo } from "react"
import { PasswordGeneratorProps, Password } from "../types/Types"

const PasswordGenerator: React.FC<PasswordGeneratorProps> = ({
	onPasswordGenerated,
}) => {
	// State to manage the password and its variables
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

	// Generate a new password whenever variables change
	useEffect(() => {
		generatePassword()
	}, [password.variables])

	// Handle character length change
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

	// Handle checkbox change for variables
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

	// Generate a new password
	const generatePassword = () => {
		const lowercaseChars = "abcdefghijklmnopqrstuvwxyz"
		const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
		const numberChars = "0123456789"
		const symbolChars = "!@#$%^&"

		let allowedChars = "*"
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

		if (onPasswordGenerated) {
			onPasswordGenerated(password)
		}
	}

	// Calculate security percentage based on active options
	const getSecurityPercentage = () => {
		const totalOptions = passwordProperties.length
		const activeOptions = passwordProperties.filter(
			(property) => password.variables[property]
		).length
		return (activeOptions / totalOptions) * 100
	}

	// Filter out keys that are not needed for display
	const passwordProperties = useMemo(() => {
		return Object.keys(password.variables).filter(
			(key) => key !== "characterLength"
		) as Array<keyof Password["variables"]>
	}, [password.variables])

	// Calculate interpolated color based on security percentage
	const getColorForSecurity = () => {
		const securityPercentage = getSecurityPercentage()
		const minHue = 0 // Red
		const maxHue = 120 // Green
		const hue = minHue + (maxHue - minHue) * (securityPercentage / 100)
		return `hsl(${hue}, 100%, 50%)`
	}

	return (
		<div
			data-theme="dark"
			className="card sm:w-8/12 sm:mx-auto lg:w-96 bg-base-100 shadow-xl"
		>
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
								checked={!!password.variables[property]}
								onChange={(e) => handleCheckboxChange(property, e)}
								className="checkbox"
							/>
							<p>Include {property}</p>
						</div>
					))}
				</div>
				{/* SECURITY COUNTER */}
				<div className="flex justify-between bg-black p-2">
					<p className="w-80 italic">STRENGTH</p>
					<p className={"font-bold"} style={{ color: getColorForSecurity() }}>
						{getSecurityPercentage()}%
					</p>
				</div>
			</div>
		</div>
	)
}

export default PasswordGenerator
