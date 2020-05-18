export const loginCheck = (e) => {
	if(e.response.status == 401){
		window.location.href = '/login';
	}
};