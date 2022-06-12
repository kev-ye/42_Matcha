import {useContext} from "react";
import styled from "styled-components";

import {UserContext} from "../utils/context";

const Wrapper = styled.div`
	margin-top: 64px
`

const App = () => {
	const { setUser } = useContext(UserContext)
	return (
		<Wrapper>
				<div>index</div>
				<button onClick={() => {
					localStorage.clear()
					setUser(null)
				}}>logout</button>
		</Wrapper>
	)
}

export default App