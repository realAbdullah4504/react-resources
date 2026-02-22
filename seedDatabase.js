import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseServiceRoleKey = 'sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz'; // Must use service_role key

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function seed() {
  const emails = [
    'abdullahjavaid1@live.com',
    'abdullahjaved4504@gmail.com',
    'abdullah.jstechsol@gmail.com',
  ];

  const users = [];

  console.log('Creating Auth users...');
  for (const email of emails) {
    // Create user in Auth
    const { data: user, error } = await supabase.auth.admin.createUser({
      email,
      password: '11111111@', // temporary password for testing
      email_confirm: true,
      user_metadata: {
        email_verified: true,
        role: email === 'abdullahjavaid1@live.com' ? 'admin' : 'member',
      },
    });

    if (error) {
      console.error('Error creating user:', email, error.message);
      continue;
    }
    console.log('Created user:', user.user.id, email);
    users.push(user.user);
  }

  console.log('Seeding profiles...');
  for (const user of users) {
    const { data, error } = await supabase.from('profiles').insert({
      id: user.id, // must match auth user ID
      full_name:
        user.email === 'abdullahjavaid1@live.com'
          ? 'Abdullah live'
          : user.email === 'abdullahjaved4504@gmail.com'
          ? 'Abdullah gmail'
          : 'Abdullah jstechsol',
      avatar_url: `https://i.pravatar.cc/150?u=${user.id}`,
    });

    if (error) console.error('Error inserting profile:', error.message);
    else console.log('Inserted profile for:', user.email);
  }

  console.log('Seeding projects...');
  const projects = [
    {
      user_email: 'abdullahjavaid1@live.com',
      name: 'Alice Project',
      description: 'Project owned by Abdullah 1',
    },
    {
      user_email: 'abdullahjaved4504@gmail.com',
      name: 'Bob Project',
      description: 'Project owned by Abdullah 4504',
    },
  ];

  const projectsData = [];
  for (const p of projects) {
    const user = users.find((u) => u.email === p.user_email);
    const { data, error } = await supabase.from('projects').insert({
      id: p.id,
      user_id: user.id,
      name: p.name,
      description: p.description,
    }).select('*');
    if (data) projectsData.push(...data);
    if (error) console.error('Error inserting project:', error.message);
  }

  console.log('Seeding tasks...');
  const tasks = [
    { projectName: 'Alice Project', title: 'Setup RLS', completed: false },
    { projectName: 'Alice Project', title: 'Test invites', completed: true },
    { projectName: 'Bob Project', title: 'Write docs', completed: false },
  ];
  for (const t of tasks) {
    const project = projectsData.find((p) => p.name === t.projectName);
    const { error } = await supabase.from('tasks').insert({
      project_id: project.id,
      title: t.title,
      completed: t.completed,
    });
    if (error) console.error('Error inserting task:', error.message);
  }

  console.log('Seeding team members...');
  for (const user of users) {
    const role =
      user.email === 'abdullahjavaid1@live.com'
        ? 'owner'
        : user.email === 'abdullahjaved4504@gmail.com'
        ? 'member'
        : 'viewer';
      
    const invitedBy = users.find((u) => u.email === 'abdullahjavaid1@live.com');

    const { error } = await supabase.from('team_members').insert({
      user_id: user.id,
      role,
      invited_by: invitedBy.id,
    });
    if (error) console.error('Error inserting team member:', error.message);
  }

  console.log('Seeding complete!');
}

seed();