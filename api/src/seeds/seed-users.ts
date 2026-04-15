import 'dotenv/config';
import 'reflect-metadata';
import AppDataSource from '../data-source';
import { User } from '../usuarios/entities/usuario.entity';
import { Roles } from '../usuarios/interfaces/roles';
import * as bcrypt from 'bcrypt';

async function run() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(User);

  const seeds = [
    {
      name: 'Admin',
      email: 'admin@local.test',
      password: 'admin1234',
      isActive: true,
      roles: [Roles.admin],
    },
    {
      name: 'User',
      email: 'user@local.test',
      password: 'user1234',
      isActive: true,
      roles: [Roles.user],
    },
  ];

  for (const s of seeds) {
    const email = s.email.toLowerCase();
    const exists = await repo.findOne({ where: { email } });
    if (exists) {
      console.log(`Skipping existing user ${email}`);
      continue;
    }

    const hashed = await bcrypt.hash(s.password, 10);
    const user = repo.create({
      name: s.name,
      email,
      password: hashed,
      isActive: s.isActive,
      roles: s.roles,
    } as Partial<User>);

    await repo.save(user);
    console.log(`Inserted user ${email}`);
  }

  await AppDataSource.destroy();
}

run()
  .then(() => {
    console.log('Seeding finished');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seeding failed', err);
    process.exit(1);
  });
