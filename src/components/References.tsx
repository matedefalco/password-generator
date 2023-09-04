const imgUrls = [
	"https://cdn1.iconfinder.com/data/icons/programing-development-8/24/react_logo-512.png",
	"https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/2048px-Typescript_logo_2020.svg.png",
	"https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/tailwind-css-icon.png",
	"https://raw.githubusercontent.com/saadeghi/daisyui/master/src/docs/static/images/daisyui-logo/favicon-192.png",
]

const References = () => {
	return (
		<footer className="flex flex-col gap-2 items-center mb-8">
			<p>Made with:</p>
			<ul className="flex gap-2">
				{imgUrls.map((url, index) => (
					<li key={index} className="references">
						<img
							alt={`Image ${index}`}
							className="w-8 h-8 object-contain"
							src={url}
						/>
					</li>
				))}
			</ul>
		</footer>
	)
}

export default References
