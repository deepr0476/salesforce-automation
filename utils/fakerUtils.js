// utils/fakerUtils.js
import { faker } from '@faker-js/faker';

export function genIndianPhone(provided) {
  if (provided) {
    const d = String(provided).replace(/\D/g, '');
    if (d.length === 10) return `+91${d}`;
    if (d.length === 12 && d.startsWith('91')) return `+${d}`;
  }
  const first = faker.helpers.arrayElement(['9', '8', '7', '6']);
  let rest = '';
  for (let i = 0; i < 9; i++) rest += Math.floor(Math.random() * 10);
  return `+91${first}${rest}`;
}

export function mkAccountName(type, first, last, suffix = '') {
  const tag = type.toLowerCase().includes('business') ? 'BA' : 'PA';
  return `RK ${tag} ${first} ${last} ${suffix}`.trim().replace(/\s+/g, ' ');
}
