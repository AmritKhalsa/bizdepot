import pb from "../../../../connections/pocketbase";
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose'; // or 'jsonwebtoken'
import { nanoid } from 'nanoid';

interface UserData {
    broker: string;
    password: string;
}

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'default_jwt_secret_key'; // Use a strong, random secret
const JWT_ISSUER = process.env.JWT_ISSUER || 'your-app';
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || 'your-users';

if (JWT_SECRET_KEY === 'default_jwt_secret_key') {
    console.warn("Warning: Using default JWT secret key. This is insecure in production!");
}

const jwtSecret = new TextEncoder().encode(JWT_SECRET_KEY);

async function generateJWT(brokerId: string): Promise<string> {
    try {
        const jwt = await new SignJWT({ 'brokerId': brokerId })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setIssuer(JWT_ISSUER)
            .setAudience(JWT_AUDIENCE)
            .setExpirationTime('7d') // e.g., '2h' for 2 hours
            .setJti(nanoid())
            .sign(jwtSecret);

        return jwt
    } catch (error) {
        console.error("JWT generation error:", error);
        throw new Error("Failed to generate JWT");
    }
}

export async function POST(request: Request) {
    const data: UserData = await request.json();
    const cookieStore = await cookies();

    const sanitizedBroker = data.broker.replace(/[^a-zA-Z ]/g, "");

    if (!sanitizedBroker) {
        return new Response(JSON.stringify({ error: "Invalid broker name" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
    
    try {
        const brokerRecord = await pb.collection("Broker").getFirstListItem(`Name="${sanitizedBroker}"`);
        const { password, id } = brokerRecord; // Get the entire record
        
        if (password != data.password) {
            console.log(password, data.password);
            return new Response(JSON.stringify({ error: "Authentication failed (wrong password)" }), { status: 401, headers: { "Content-Type": "application/json" } });
        }

        // Generate JWT
        const token = await generateJWT(id);

        // Set JWT as a cookie
        cookieStore.set("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            expires: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours expiration
        });
        
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });


    } catch (error) {
        console.error("Error fetching broker:", error);
        return new Response(JSON.stringify({ error: "Authentication failed" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }
}