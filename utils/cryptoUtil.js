// utils/cryptoUtil.js
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const key = Buffer.from(process.env.SECRET_KEY, 'utf8');
const iv = Buffer.from(process.env.IV, 'utf8');

export function encrypt(text) {
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

export function decrypt(encrypted) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
