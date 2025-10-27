import { PrismaClient, EquipmentType, UserRole, UserStatus } from '@prisma/client';

const prisma = new PrismaClient();

const LAB_ID = '00000000-0000-0000-0000-000000000001';
const SEM_EQUIPMENT_ID = '00000000-0000-0000-0000-000000000101';
const TEM_EQUIPMENT_ID = '00000000-0000-0000-0000-000000000102';

async function main() {
  const institution = await prisma.institution.upsert({
    where: { sigla: 'UFSD' },
    update: {},
    create: {
      sigla: 'UFSD',
      name: 'Universidade Federal do SDAI',
      domain: 'sdai.ufsd.br',
    },
  });

  const lab = await prisma.lab.upsert({
    where: { id: LAB_ID },
    update: {
      name: 'Laboratório Central de Microscopia',
      institutionId: institution.id,
    },
    create: {
      id: LAB_ID,
      name: 'Laboratório Central de Microscopia',
      description: 'Laboratório referência para análises SEM e TEM.',
      institutionId: institution.id,
    },
  });

  await prisma.equipment.upsert({
    where: { id: SEM_EQUIPMENT_ID },
    update: {
      labId: lab.id,
      specs: {
        manufacturer: 'Zeiss',
        model: 'Sigma 500',
        serialNumber: 'SEM-ZS-500-001',
      },
    },
    create: {
      id: SEM_EQUIPMENT_ID,
      labId: lab.id,
      type: EquipmentType.SEM,
      specs: {
        manufacturer: 'Zeiss',
        model: 'Sigma 500',
        serialNumber: 'SEM-ZS-500-001',
      },
    },
  });

  await prisma.equipment.upsert({
    where: { id: TEM_EQUIPMENT_ID },
    update: {
      labId: lab.id,
      specs: {
        manufacturer: 'JEOL',
        model: 'JEM-2100F',
        serialNumber: 'TEM-JL-2100-002',
      },
    },
    create: {
      id: TEM_EQUIPMENT_ID,
      labId: lab.id,
      type: EquipmentType.TEM,
      specs: {
        manufacturer: 'JEOL',
        model: 'JEM-2100F',
        serialNumber: 'TEM-JL-2100-002',
      },
    },
  });

  const passwordHashSample =
    '$argon2id$v=19$m=65536,t=3,p=4$YnJpZGdlLXNlZWQAAAAAAAAAAA$F6lTg5T0g9H0RQ47S90903uL5zrOzslZ6iQrFSFR3aI';

  await prisma.user.upsert({
    where: { email: 'admin@sdai.ufsd.br' },
    update: {
      name: 'Administrador SDAI',
      labId: lab.id,
      status: UserStatus.active,
    },
    create: {
      name: 'Administrador SDAI',
      email: 'admin@sdai.ufsd.br',
      passwordHash: passwordHashSample,
      role: UserRole.admin,
      status: UserStatus.active,
      labId: lab.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'tecnico@sdai.ufsd.br' },
    update: {
      name: 'Técnico Responsável',
      labId: lab.id,
      status: UserStatus.active,
      role: UserRole.tecnico,
    },
    create: {
      name: 'Técnico Responsável',
      email: 'tecnico@sdai.ufsd.br',
      passwordHash: passwordHashSample,
      role: UserRole.tecnico,
      status: UserStatus.active,
      labId: lab.id,
    },
  });

  console.info('Seed data created successfully.');
}

main()
  .catch((error) => {
    console.error('Seed failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
