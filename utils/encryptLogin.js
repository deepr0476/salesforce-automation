const { encrypt } = require('./cryptoUtil');
// Initialise 
const username = 'raman@pw.com';
const password = '92614rgr@Bhl';
// Encrypt
const encryptedUsername = encrypt(username);
const encryptedPassword = encrypt(password);
// Final Non user readable credentials 
console.log(' Encrypted Username:', encryptedUsername);
console.log(' Encrypted Password:', encryptedPassword);
