import {useContext, useEffect, useMemo, useState} from "react";
import {
	BrowserRouter,
	Routes,
	Route,
} from 'react-router-dom';

import ToolBar from "./app/toolbar/toolbar";
import Signin from "./app/signin/signin";
import Signup from "./app/signup/signup"
import App from "./app/app";
import {AlertContext, UserContext} from "./utils/context";
import {setCurrentUser} from "./utils/api";

//
const RouterStat = () => {
	const { user } = useContext(UserContext)

	return user === null
		? (
				<Routes>
					<Route path='/' element={<Signin />} />
					<Route path='/signin' element={<Signin />} />
					<Route path="/signup" element={<Signup />} />
					<Route path='*' element={<Signin />}/>
				</Routes>
		)
		: (
				<Routes>
					<Route path='/' element={<App />}/>
					<Route path='*' element={<App />}/>
				</Routes>
		)
}

const AppRouter = () => {
	const [user, setUser] = useState(null)
	const userValue = useMemo(() => ({user, setUser}), [user, setUser])

	const [alert, setAlert] = useState(null)
	const alertValue = useMemo(() => ({alert, setAlert}), [alert, setAlert])

	useEffect(() => {
		setCurrentUser(setUser).then()
	}, [])

	return (
			<BrowserRouter>
				<UserContext.Provider value={userValue}>
					<AlertContext.Provider value={alertValue}>
						<ToolBar />
						<RouterStat />
					</AlertContext.Provider>
				</UserContext.Provider>
			</BrowserRouter>
		)
}

export default AppRouter