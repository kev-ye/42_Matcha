import {ApiProfile} from "../global/global";

export const getCurrentUser = async () => {
	const token = localStorage.getItem('__access_token__')
	if (token === null) return null

	const url = `${ApiProfile}/profile`
	const headers = {authorization: `Bearer ${token}`}
	const res = await fetch(url, {
		method: 'get',
		headers
	})

	return await res.json()
}

export const setCurrentUser = async (f: Function) => {
	const token = localStorage.getItem('__access_token__')
	if (token !== null) {
		const url = `${ApiProfile}/profile`
		const headers = {authorization: `Bearer ${token}`}
		const res = await fetch(url, {
			method: 'get',
			headers
		})

		if (res.status !== 200) f(null)
		else f(await res.json())
	}
	else
		f(null)
}