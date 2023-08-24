import React, { useState, useRef } from "react"

type Password = {
	characterLength: number
	upperCase: boolean
	lowerCase: boolean
	numbers: boolean
	symbols: boolean
}

const PasswordGenerator = () => {
	const [password, setPassword] = useState<Password>({
		characterLength: 8,
		upperCase: false,
		lowerCase: false,
		numbers: false,
		symbols: false,
	})
	const passwordRef = useRef<Password | null>(null)

	const handleCharacterLengthChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const length = parseInt(event.target.value)
		setPassword((prevPassword) => ({
			...prevPassword,
			characterLength: length,
		}))
	}

	const handleCheckboxChange = (
		field: keyof Password,
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const value = event.target.checked
		console.log("Suka ~ file: PasswordGenerator.tsx:36 ~ value:", value)
		setPassword((prevPassword) => ({ ...prevPassword, [field]: value }))
	}

	const passwordProperties = Object.keys(password).filter(
		(key) => key !== "characterLength"
	) as Array<keyof Password>

	return (
		<div data-theme="dark" className="card w-96 bg-base-100 shadow-xl">
			<div className="card-body gap-8">
				{/* CHARACTER LENGTH */}
				<div className="flex flex-col gap-2">
					<div className="flex justify-between items-center">
						<h2 className="card-title flex-1">Character length</h2>
						<p className="text-slate-200 text-2xl flex-none">
							{password.characterLength}
						</p>
					</div>
					<input
						type="range"
						min={1}
						max={20}
						value={password.characterLength}
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
								checked={password[property] ?? false}
								onChange={(e) => handleCheckboxChange(property, e)}
								className="checkbox"
							/>
							<p>Include {property}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default PasswordGenerator
