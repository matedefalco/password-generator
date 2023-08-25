type Password = {
	_password: string
	variables: {
		characterLength: number
		upperCase: boolean
		lowerCase: boolean
		numbers: boolean
		symbols: boolean
	}
}

type GeneratedPasswordProps = {
	generatedPassword: string
}

type PasswordGeneratorProps = {
	onPasswordGenerated: (password: string) => void
}

export { Password, GeneratedPasswordProps, PasswordGeneratorProps }
