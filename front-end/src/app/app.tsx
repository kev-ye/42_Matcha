import {useContext} from "react";

import {UserContext} from "../utils/context";

const App = () => {
	const { setUser } = useContext(UserContext)
	return (
		<div>
			<div>index</div>
			<button onClick={() => {
				localStorage.clear()
				setUser(null)
			}}>logout</button>
		</div>
	)
}

export default App