const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

const users = [
  {
    email: 'admin@test.com',
    password: 'Admin@123',
    metadata: { role: 'superadmin', name: 'Super Admin' }
  },
  {
    email: 'regular_admin@test.com',
    password: 'Admin@123',
    metadata: { role: 'admin', name: 'Regional Admin' }
  },
  {
    email: 'owner@demo.com',
    password: 'owner123',
    metadata: { role: 'owner', name: 'Rajesh Kumar' }
  },
  {
    email: 'driver1@demo.com',
    password: 'driver123',
    metadata: { role: 'driver', name: 'Suresh Singh' }
  }
];

async function provisionUsers() {
  console.log('🚀 Starting Auth User Provisioning...');

  for (const user of users) {
    console.log(`Checking/Creating user: ${user.email}`);
    
    // Check if user already exists
    const { data: { users: existingUsers }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError.message);
      break;
    }

    const existingUser = existingUsers.find(u => u.email === user.email);

    if (existingUser) {
      console.log(`User ${user.email} already exists. Updating metadata...`);
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        { 
          user_metadata: user.metadata,
          password: user.password,
          email_confirm: true 
        }
      );
      if (updateError) console.error(`Failed to update ${user.email}:`, updateError.message);
    } else {
      const { data, error: createError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        user_metadata: user.metadata,
        email_confirm: true
      });

      if (createError) {
        console.error(`Failed to create ${user.email}:`, createError.message);
      } else {
        console.log(`Successfully created user: ${user.email}`);
      }
    }
  }

  console.log('✅ Provisioning Complete.');
  process.exit();
}

provisionUsers();
