// Generate bcrypt hash for default admin password
import bcrypt from 'bcrypt';

const password = 'admin123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    process.exit(1);
  }
  console.log('\n===========================================');
  console.log('Default Admin Password Hash Generated');
  console.log('===========================================');
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\n⚠️  IMPORTANT: Change this password after first login!');
  console.log('===========================================\n');
  process.exit(0);
});
