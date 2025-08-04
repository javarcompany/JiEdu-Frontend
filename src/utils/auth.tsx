export function getUserRole() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.role || null;
}

export function isAuthenticated() {
    return !!localStorage.getItem('token');
}
