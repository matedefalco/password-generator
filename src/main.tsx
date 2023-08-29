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

if (!import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY) {
	throw new Error("Missing Publishable key")
}
const clerkPubKey = import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<ClerkProvider publishableKey={clerkPubKey}>
			<SignedOut>
				<RedirectToSignIn />
			</SignedOut>
			<SignedIn>
				<App />
			</SignedIn>
		</ClerkProvider>
	</React.StrictMode>
)
