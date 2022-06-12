import * as React from "react";

import {UserContext} from "../../utils/context";
import NavLoggedOut from "./components/navLoggedOut";
import NavLoggedIn from "./components/navLoggedIn";

const Nav = () => {
	const { user } = React.useContext(UserContext)

	return user === null ? <NavLoggedOut /> : <NavLoggedIn />
}

export default Nav