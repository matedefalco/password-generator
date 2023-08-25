export type PasswordVariables = {
	characterLength: number
	upperCase: boolean
	lowerCase: boolean
	numbers: boolean
	symbols: boolean
}

export type Password = {
	_password: string
	variables: PasswordVariables
}

export type GeneratedPasswordProps = {
	generatedPassword: string
}

export type PasswordGeneratorProps = {
	onPasswordGenerated: (password: string) => void
}
