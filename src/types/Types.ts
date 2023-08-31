import { PropsWithChildren } from "react"

export type PasswordVariables = {
	characterLength: number
	upperCase: boolean
	lowerCase: boolean
	numbers: boolean
	symbols: boolean
}

export type Password = {
	_password: string
	name?: string
	variables: PasswordVariables
}

export type GeneratedPasswordProps = {
	generatedPassword: Password
}

export type PasswordGeneratorProps = {
	onPasswordGenerated: (password: Password) => void
}

export interface User {
	id: string
	passwords: Password[]
}

export type DbContextProviderProps = PropsWithChildren<object>

declare global {
	interface Window {
		my_modal_1: any
	}
}
