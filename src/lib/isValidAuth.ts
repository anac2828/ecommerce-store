export async function isValidAuth(username: string, password: string) {
    // will return true or false
    // password = user password from login screen
    return (username === process.env.ADMIN_USERNAME && await hashPassword(password) === process.env.HASHED_ADMIN_PASSWORD)
}

// Encrypt password
async function hashPassword(password: string) {
    const arrayBuffer = await crypto.subtle.digest("SHA-512", new TextEncoder().encode(password))

    return Buffer.from(arrayBuffer).toString("base64")
}