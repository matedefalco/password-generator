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
import CreatePassword from "./pages/CreatePassword.tsx"
import UserPasswords from "./pages/UserPasswords.tsx"

// Check if the Clerk publishable key is available in environment variables
if (!import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY) {
	throw new Error("Missing Publishable key")
}
const clerkPubKey = import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY

// Create a router configuration
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

// Render the React application
ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		{/* Provide the DbContext for context data */}
		<DbContextProvider>
			{/* Provide the ClerkProvider with the Clerk publishable key */}
			<ClerkProvider publishableKey={clerkPubKey}>
				<SignedOut>
					{/* If the user is signed out, redirect to sign-in */}
					<RedirectToSignIn />
				</SignedOut>
				<SignedIn>
					{/* If the user is signed in, provide the router for routing */}
					<RouterProvider router={router} />
				</SignedIn>
			</ClerkProvider>
		</DbContextProvider>
	</React.StrictMode>
)
