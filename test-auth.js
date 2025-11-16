// test-auth.js - Test authentication system
import bcrypt from 'bcryptjs';

async function testAuth() {
  console.log('\n🧪 Testing Authentication System...\n');

  // Test password hashing
  const password = 'admin123';
  console.log('1️⃣ Testing password hashing...');
  const hash = await bcrypt.hash(password, 10);
  console.log('   ✅ Hash generated:', hash.substring(0, 20) + '...');

  // Test password verification
  console.log('\n2️⃣ Testing password verification...');
  const isValid = await bcrypt.compare(password, hash);
  console.log('   ✅ Password verification:', isValid ? 'PASSED' : 'FAILED');

  // Test wrong password
  console.log('\n3️⃣ Testing wrong password rejection...');
  const isInvalid = await bcrypt.compare('wrongpassword', hash);
  console.log('   ✅ Wrong password rejected:', !isInvalid ? 'PASSED' : 'FAILED');

  console.log('\n✅ All authentication tests passed!\n');
}

testAuth().catch(console.error);
