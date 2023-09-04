import { Link } from "react-router-dom"
import SignOutButton from "./SignOutButton"

const NavBar = () => {
	return (
		<div className="navbar bg-base-100">
			<div className="navbar-start">
				<div className="dropdown">
					<label tabIndex={0} className="btn btn-ghost btn-circle">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M4 6h16M4 12h16M4 18h7"
							/>
						</svg>
					</label>
					<ul
						tabIndex={0}
						className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
					>
						<li>
							<Link to={`/user-passwords`}>
								<p>My passwords</p>
							</Link>
						</li>
						<li>
							<Link to={`/`}>
								<p>Homepage</p>
							</Link>
						</li>
						<li>
							<Link to={`/create-password`}>
								<p>New pasword</p>
							</Link>
						</li>
					</ul>
				</div>
			</div>
			<div className="navbar-center">
				<Link to={`/user-passwords`}>
					<button className="btn btn-ghost normal-case text-xl">
						Password generator
					</button>
				</Link>
			</div>
			<div className="navbar-end">
				<SignOutButton />
			</div>
		</div>
	)
}

export default NavBar
