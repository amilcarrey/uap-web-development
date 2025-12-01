require('dotenv').config();

const url = process.env.DATABASE_URL;
console.log("Raw URL:", url);

for (let i = 0; i < url.length; i++) {
  const c = url.charAt(i);
  const code = url.charCodeAt(i);
  console.log(`${i}: '${c}' (${code})`);
}
