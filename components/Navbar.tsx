import React from "react";
import Link from "next/link";

const Navbar = () => {
	return (
		<div>
			<div>
				<Link href={"/"}>Home</Link>
				<Link href={"/dashboard"}>Dashboard</Link>
			</div>
		</div>
	);
};

export default Navbar;
