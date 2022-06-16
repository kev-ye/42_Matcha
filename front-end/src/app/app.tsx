import {useContext, useState} from "react";
import styled from "styled-components";

import {AlertContext, UserContext} from "../utils/context";
import {TransitionAlert} from "../components/alert";

const Wrapper = styled.div`
	margin-top: 64px
`

const AppContent = () => {
	const { setUser } = useContext(UserContext)

	return (
		<>
			<div>index</div>
			<button onClick={() => {
				localStorage.clear()
				setUser(null)
			}}>logout</button>
		</>
	)
}

const App = () => {
	const { alert } = useContext(AlertContext)
	const [open, setOpen] = useState(alert !== null)

	return (
		<div>
			<TransitionAlert type="success" msg={alert} open={open} f={setOpen}/>
			{
				open
				? <AppContent />
				: <Wrapper><AppContent /></Wrapper>
			}
		</div>
	)
}

export default App