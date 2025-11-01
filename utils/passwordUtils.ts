/**
 * ⚠️ WARNING: This implementation uses SHA-256 which is NOT secure for password hashing.
 * This is for demonstration/development purposes ONLY.
 * 
 * SHA-256 issues:
 * - Too fast, vulnerable to brute-force attacks
 * - No built-in salt, vulnerable to rainbow tables
 * - Not a slow hash function designed for passwords
 * 
 * For production, use:
 * - bcrypt (recommended for most use cases)
 * - scrypt or Argon2 (for high-security requirements)
 * 
 * Example with bcrypt.js:
 * ```
 * import bcrypt from 'bcryptjs';
 * const hashedPassword = await bcrypt.hash(password, 10);
 * const isValid = await bcrypt.compare(password, hash);
 * ```
 */

/**
 * Hashes a password using SHA-256
 * @param password - The plain text password to hash
 * @returns A promise that resolves to the hashed password as a hex string
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Verifies a password against a hash
 * @param password - The plain text password to verify
 * @param hash - The hashed password to compare against
 * @returns A promise that resolves to true if the password matches, false otherwise
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}
