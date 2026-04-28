const { encrypt } = require('./cryptoUtil');
// Initialise 
const username = 'enter your username here ';
const password = 'enter your password here ';
// Encrypt
const encryptedUsername = encrypt(username);
const encryptedPassword = encrypt(password);
// Final Non user readable credentials 
console.log(' Encrypted Username:', encryptedUsername);
console.log(' Encrypted Password:', encryptedPassword);
