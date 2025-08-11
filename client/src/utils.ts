// utils/jwt.ts  (Adjust the path if needed)
import { jwtVerify } from 'jose'; // or 'jsonwebtoken'

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'default_jwt_secret_key';
const jwtSecret = new TextEncoder().encode(JWT_SECRET_KEY);
const JWT_ISSUER = process.env.JWT_ISSUER || 'your-app';
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || 'your-users';


interface JWTPayload {
    brokerId: string;
    // Add other claims as needed
}

export async function verifyJWT(token: string): Promise<{ isAuth: boolean; token?: JWTPayload; message?: string }> {
    try {
        const { payload } = await jwtVerify(token, jwtSecret, {
            issuer: JWT_ISSUER,
            audience: JWT_AUDIENCE,
        });

        return { isAuth: true, token: payload as JWTPayload };
    } catch (error: any) {
        console.error("JWT verification error:", error.message);
        return { isAuth: false, message: 'Token is invalid' };
    }
}
export function formatDate(dateString: string): string {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date)
    } catch (error) {
      return dateString
    }
  }
  
  export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }
  
  export function formatPhoneNumber(phoneNumber: number): string {
    // Convert to string and ensure it's a valid format
    const phoneStr = phoneNumber.toString()
    
    // If it's a placeholder or test value, just return it
    if (phoneStr.length <= 3) {
      return phoneStr
    }
    
    // Format as (XXX) XXX-XXXX if 10 digits
    if (phoneStr.length === 10) {
      return `(${phoneStr.substring(0, 3)}) ${phoneStr.substring(3, 6)}-${phoneStr.substring(6)}`
    }
    
    // Return original if not standard format
    return phoneStr
  }
  