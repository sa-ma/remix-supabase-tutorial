import { createCookie} from "remix"

const cookieOptions = { httpOnly: true, secure: false, sameSite: "lax", maxAge: 604_800 };

const supabaseToken = createCookie("sb:token", {
    ...cookieOptions
})

export default supabaseToken;