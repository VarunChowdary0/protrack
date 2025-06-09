import { signIn } from "next-auth/react"

export const RefreshToken = async (email: string) => {
    return await signIn("credentials", {
        redirect: false,
        email: email,
        refresh: true,
    });
}