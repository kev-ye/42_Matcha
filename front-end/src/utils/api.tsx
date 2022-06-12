import {ApiProfile} from "../global/global";

export const getCurrentUser = async (f: Function) => {
	const token = localStorage.getItem('__access_token__')

	if (token === null) {
		f(null)
		return false
	}

	const url = `${ApiProfile}/profile`
	const headers = {authorization: `Bearer ${token}`}
	const res = await fetch(url, {
		method: 'get',
		headers
	})

	const data = await res.json()

	if (res.status !== 200) {
		f(null)
		return true
	} else {
		f(data)
		return true
	}
}
