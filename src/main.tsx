import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"
import {
	ClerkProvider,
	SignedIn,
	SignedOut,
	RedirectToSignIn,
} from "@clerk/clerk-react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { DbContextProvider } from "./context/DbContext.tsx"
import CreatePassword from "./components/CreatePassword.tsx"
import UserPasswords from "./components/UserPasswords.tsx"

if (!import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY) {
	throw new Error("Missing Publishable key")
}
const clerkPubKey = import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
	},
	{
		path: "/create-password",
		element: <CreatePassword />,
	},
	{
		path: "/user-passwords",
		element: <UserPasswords />,
	},
])

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<DbContextProvider>
			<ClerkProvider publishableKey={clerkPubKey}>
				<SignedOut>
					<RedirectToSignIn />
				</SignedOut>
				<SignedIn>
					<RouterProvider router={router} />
				</SignedIn>
			</ClerkProvider>
		</DbContextProvider>
	</React.StrictMode>
)
