import { supabaseAuth } from "../lib/supabaseAuth.js";


async function requireAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                error: "Missing or invalid authorization header",
            });
        }

        const token = authHeader.split(" ")[1];

        const { data, error } = await supabaseAuth.auth.getUser(token);

        if (error || !data.user) {
            return res.status(401).json({error: "Unauthorizes"})
        }

        req.user = data.user;
        next();
    } catch(err) {
        console.error("Auth middleware error:", err)
        return res.status(500).json({ error: "Internal server error"})
    }
}

export default requireAuth;