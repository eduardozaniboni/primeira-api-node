type User = {
    id: string,
    name: string
}

function getUserName(user: User) {
    return user.id
}