import { authServiceInstance } from "./axios.ts";

export async function getUser(token: string) {
    try {

        const user = await authServiceInstance.get("/api/auth/my-account",{
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return user;
        
    } catch (error) {
        console.log(error)
        return error;
    }
}