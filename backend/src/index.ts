import type { Core } from '@strapi/strapi';

import { seedDemoSchedulingData } from './bootstrap/seed-demo-scheduling-data';

type RoleSeed = {
  type: string;
  name: string;
  description: string;
  permissions: string[];
};

type UserSeed = {
  username: string;
  email: string;
  password: string;
  roleType: string;
};

type PermissionRecord = {
  id: number;
  action: string;
};

type RoleRecord = {
  id: number;
  type: string;
  name: string;
  description?: string | null;
  permissions?: PermissionRecord[];
};

type UserRecord = {
  id: number;
  email: string;
  username: string;
  role?: {
    id: number;
    type: string;
  };
};

const ACADEMIC_COORDINATOR_ACTIONS = [
  'api::teacher.teacher.find',
  'api::teacher.teacher.findOne',
  'api::teacher.teacher.create',
  'api::teacher.teacher.update',
  'api::teacher.teacher.delete',

  'api::course.course.find',
  'api::course.course.findOne',
  'api::course.course.create',
  'api::course.course.update',
  'api::course.course.delete',

  'api::classroom.classroom.find',
  'api::classroom.classroom.findOne',
  'api::classroom.classroom.create',
  'api::classroom.classroom.update',
  'api::classroom.classroom.delete',

  'api::classroom-feature.classroom-feature.find',
  'api::classroom-feature.classroom-feature.findOne',
  'api::classroom-feature.classroom-feature.create',
  'api::classroom-feature.classroom-feature.update',
  'api::classroom-feature.classroom-feature.delete',

  'api::academic-group.academic-group.find',
  'api::academic-group.academic-group.findOne',
  'api::academic-group.academic-group.create',
  'api::academic-group.academic-group.update',
  'api::academic-group.academic-group.delete',

  'api::availability.availability.find',
  'api::availability.availability.findOne',
  'api::availability.availability.create',
  'api::availability.availability.update',
  'api::availability.availability.delete',

  'api::class-session.class-session.find',
  'api::class-session.class-session.findOne',
  'api::class-session.class-session.create',
  'api::class-session.class-session.update',
  'api::class-session.class-session.delete',
  'api::class-session.class-session.findByTeacher',
  'api::class-session.class-session.findByClassroom',
  'api::class-session.class-session.findByAcademicGroup',
  'api::class-session.class-session.validateSession',

  'api::schedule-config.schedule-config.find',
  'api::schedule-config.schedule-config.findOne',
  'api::schedule-config.schedule-config.create',
  'api::schedule-config.schedule-config.update',
  'api::schedule-config.schedule-config.delete',
  'api::schedule-config.schedule-config.getProcessedRules',
  'api::schedule-config.schedule-config.validateSchedule',
] as const;

const TEACHER_ACTIONS = [
  'api::teacher.teacher.find',
  'api::teacher.teacher.findOne',
  'api::course.course.find',
  'api::course.course.findOne',
  'api::academic-group.academic-group.find',
  'api::academic-group.academic-group.findOne',
  'api::availability.availability.find',
  'api::availability.availability.findOne',

  'api::class-session.class-session.findByTeacher',
  'api::class-session.class-session.findByClassroom',
  'api::class-session.class-session.findByAcademicGroup',
  'api::class-session.class-session.validateSession',
  'api::schedule-config.schedule-config.getProcessedRules',
  'api::schedule-config.schedule-config.validateSchedule',
] as const;

const STUDENT_ACTIONS = [
  'api::course.course.find',
  'api::course.course.findOne',
  'api::academic-group.academic-group.find',
  'api::academic-group.academic-group.findOne',
  'api::classroom.classroom.find',
  'api::classroom.classroom.findOne',
] as const;

const ROLE_SEEDS: RoleSeed[] = [
  {
    type: 'academic_coordinator',
    name: 'Academic Coordinator',
    description: 'Main frontend role with full academic management access',
    permissions: [...ACADEMIC_COORDINATOR_ACTIONS],
  },
  {
    type: 'teacher',
    name: 'Teacher',
    description: 'Teacher user with access to relevant academic information',
    permissions: [...TEACHER_ACTIONS],
  },
  {
    type: 'student',
    name: 'Student',
    description: 'Student user with access to relevant academic information',
    permissions: [...STUDENT_ACTIONS],
  },
];

const USER_SEEDS: UserSeed[] = [
  {
    username: 'academic_coordinator',
    email: process.env.SEED_ACADEMIC_COORDINATOR_EMAIL ?? 'coordinator@planify.edu',
    password: process.env.SEED_ACADEMIC_COORDINATOR_PASSWORD ?? 'Planify123*',
    roleType: 'academic_coordinator',
  },
  {
    username: 'teacher',
    email: process.env.SEED_TEACHER_EMAIL ?? 'teacher@planify.edu',
    password: process.env.SEED_TEACHER_PASSWORD ?? 'Planify123*',
    roleType: 'teacher',
  },
  {
    username: 'student',
    email: process.env.SEED_STUDENT_EMAIL ?? 'student@planify.edu',
    password: process.env.SEED_STUDENT_PASSWORD ?? 'Planify123*',
    roleType: 'student',
  },
];

async function findRoleByType(strapi: Core.Strapi, type: string): Promise<RoleRecord | null> {
  return strapi.db.query('plugin::users-permissions.role').findOne({
    where: { type },
    populate: ['permissions'],
  }) as Promise<RoleRecord | null>;
}

async function ensureRole(strapi: Core.Strapi, roleSeed: RoleSeed): Promise<RoleRecord> {
  const existing = await findRoleByType(strapi, roleSeed.type);

  if (existing) {
    const needsUpdate =
      existing.name !== roleSeed.name || (existing.description ?? '') !== roleSeed.description;

    if (needsUpdate) {
      await strapi.db.query('plugin::users-permissions.role').update({
        where: { id: existing.id },
        data: {
          name: roleSeed.name,
          description: roleSeed.description,
        },
      });
    }

    const updated = await findRoleByType(strapi, roleSeed.type);

    if (!updated) {
      throw new Error(`Role ${roleSeed.type} could not be reloaded after update.`);
    }

    return updated;
  }

  await strapi.db.query('plugin::users-permissions.role').create({
    data: {
      name: roleSeed.name,
      description: roleSeed.description,
      type: roleSeed.type,
    },
  });

  const created = await findRoleByType(strapi, roleSeed.type);

  if (!created) {
    throw new Error(`Role ${roleSeed.type} could not be created.`);
  }

  return created;
}

async function syncRolePermissions(
  strapi: Core.Strapi,
  roleId: number,
  wantedActions: string[]
): Promise<void> {
  const existingPermissions = (await strapi.db
    .query('plugin::users-permissions.permission')
    .findMany({
      where: { role: roleId },
    })) as PermissionRecord[];

  const existingActions = new Set(existingPermissions.map((permission) => permission.action));
  const wantedActionsSet = new Set(wantedActions);

  for (const action of wantedActions) {
    if (!existingActions.has(action)) {
      await strapi.db.query('plugin::users-permissions.permission').create({
        data: {
          action,
          role: roleId,
        },
      });
    }
  }

  for (const permission of existingPermissions) {
    if (!wantedActionsSet.has(permission.action)) {
      await strapi.db.query('plugin::users-permissions.permission').delete({
        where: { id: permission.id },
      });
    }
  }
}

function isAllowPublicAcademicApi(): boolean {
  const v = process.env.ALLOW_PUBLIC_ACADEMIC_API?.trim().toLowerCase();
  return v === 'true' || v === '1' || v === 'yes';
}

/** Solo desarrollo: añade al rol Public los permisos de TEACHER_ACTIONS sin borrar el resto (p. ej. auth.local). */
async function ensurePublicDevTeacherPermissions(strapi: Core.Strapi): Promise<void> {
  const publicRole = await findRoleByType(strapi, 'public');
  if (!publicRole?.id) {
    return;
  }

  const existingPermissions = (await strapi.db
    .query('plugin::users-permissions.permission')
    .findMany({
      where: { role: publicRole.id },
    })) as PermissionRecord[];

  const existingActions = new Set(existingPermissions.map((permission) => permission.action));

  for (const action of TEACHER_ACTIONS) {
    if (!existingActions.has(action)) {
      await strapi.db.query('plugin::users-permissions.permission').create({
        data: {
          action,
          role: publicRole.id,
        },
      });
    }
  }
}

async function removeDangerousPublicPermissions(strapi: Core.Strapi): Promise<void> {
  const publicRole = (await strapi.db.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
    populate: ['permissions'],
  })) as RoleRecord | null;

  if (!publicRole?.id || !publicRole.permissions?.length) {
    return;
  }

  const actionsToRemove = new Set([
    ...ACADEMIC_COORDINATOR_ACTIONS,
    ...TEACHER_ACTIONS,
    ...STUDENT_ACTIONS,
  ]);

  for (const permission of publicRole.permissions) {
    if (actionsToRemove.has(permission.action as (typeof ACADEMIC_COORDINATOR_ACTIONS)[number])) {
      await strapi.db.query('plugin::users-permissions.permission').delete({
        where: { id: permission.id },
      });
    }
  }
}

async function ensureUser(strapi: Core.Strapi, userSeed: UserSeed, roleId: number): Promise<void> {
  const existing = (await strapi.db.query('plugin::users-permissions.user').findOne({
    where: { email: userSeed.email },
    populate: ['role'],
  })) as UserRecord | null;

  if (existing) {
    const roleChanged = existing.role?.id !== roleId;

    if (roleChanged) {
      await strapi.db.query('plugin::users-permissions.user').update({
        where: { id: existing.id },
        data: {
          role: roleId,
          confirmed: true,
          blocked: false,
        },
      });
    }

    return;
  }

  await strapi.service('plugin::users-permissions.user').add({
    username: userSeed.username,
    email: userSeed.email,
    password: userSeed.password,
    provider: 'local',
    confirmed: true,
    blocked: false,
    role: roleId,
  });
}

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    if (isAllowPublicAcademicApi()) {
      strapi.log.warn(
        '[bootstrap] ALLOW_PUBLIC_ACADEMIC_API: el rol Public recibe permisos de lectura tipo Teacher (solo para desarrollo; no uses esto en producción).'
      );
      await ensurePublicDevTeacherPermissions(strapi);
    } else {
      await removeDangerousPublicPermissions(strapi);
    }

    for (const roleSeed of ROLE_SEEDS) {
      const role = await ensureRole(strapi, roleSeed);
      await syncRolePermissions(strapi, role.id, roleSeed.permissions);
    }

    for (const userSeed of USER_SEEDS) {
      const role = await findRoleByType(strapi, userSeed.roleType);

      if (!role?.id) {
        throw new Error(`Role ${userSeed.roleType} was not found for user ${userSeed.email}.`);
      }

      await ensureUser(strapi, userSeed, role.id);
    }

    await seedDemoSchedulingData(strapi);
  },
};
