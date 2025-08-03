/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { JwtPayload } from 'jsonwebtoken';

/**
 * Generate JWT Token
 * @param payload - Data to be included in the token
 * @param expiresIn - Token expiration time (e.g., "1h", "7d")
 * @returns JWT token string
 */
export const generateToken = (
    secretKey: string,
    payload: JwtPayload,
    expiresIn: string,
): string => {
    return jwt.sign(payload, secretKey, { expiresIn: expiresIn as any });
};

/**
 * Verify JWT Token
 * @param token - JWT token string
 * @returns Decoded token payload if valid, otherwise throws an error
 */
export const verifyToken = (secretKey: string, token: string): any => {
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

/**
 * Decode JWT Token (Without Verification)
 * @param token - JWT token string
 * @returns Decoded token payload or null if invalid
 */
export const decodeToken = (token: string): any | null => {
    return jwt.decode(token);
};
