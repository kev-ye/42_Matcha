import {useContext, useEffect, useMemo, useState} from "react";
import {
	BrowserRouter,
	Routes,
	Route,
} from 'react-router-dom';

import Nav from "./app/nav/nav";
import Signin from "./app/signin/signin";
import Signup from "./app/signup/signup"
import App from "./app/app";
import {UserContext} from "./utils/context";
import {getCurrentUser} from "./utils/api";

const RouterAfterAuth = () => {
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
	const value = useMemo(() => ({user, setUser}), [user, setUser])

	useEffect(() => {
		getCurrentUser(setUser).then()
	}, [])

	return (
			<BrowserRouter>
				<UserContext.Provider value={value}>
					<Nav />
					<RouterAfterAuth />
				</UserContext.Provider>
			</BrowserRouter>
		)
}

export default AppRouter