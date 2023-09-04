import { Link } from "react-router-dom"

const Welcome = () => {
	return (
		<div className="flex flex-col gap-4 items-center">
			<h1 className="font-bold text-2xl">Create and save your passwords</h1>
			<p className="text-lg text-gray-700">
				Use this tool to properly store your passwords and never forget them!
			</p>
			<div className="flex gap-4">
				<Link to={`/user-passwords`}>
					<button className="btn btn-primary w-full">My passwords</button>
				</Link>
				<Link to={`/create-password`}>
					<button className="btn btn-primary w-full">New pasword</button>
				</Link>
			</div>
		</div>
	)
}

export default Welcome
