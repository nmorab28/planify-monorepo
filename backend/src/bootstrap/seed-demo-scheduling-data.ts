import type { Core } from '@strapi/strapi';

type DocumentRecord = {
  documentId: string;
  [key: string]: unknown;
};

const DEMO_PREFIX = 'DEMO';

async function findByCode<T extends DocumentRecord>(
  strapi: Core.Strapi,
  uid: string,
  code: string,
  populate?: Record<string, unknown>
): Promise<T | null> {
  const records = (await strapi.documents(uid as never).findMany({
    filters: { code: { $eq: code } },
    populate,
    pagination: { pageSize: 1 },
  } as never)) as T[];

  return records[0] || null;
}

async function ensureByCode<T extends DocumentRecord>(
  strapi: Core.Strapi,
  uid: string,
  code: string,
  data: Record<string, unknown>,
  populate?: Record<string, unknown>
): Promise<T> {
  const existing = await findByCode<T>(strapi, uid, code, populate);
  if (existing) return existing;

  return strapi.documents(uid as never).create({ data } as never) as Promise<T>;
}

async function findOne<T extends DocumentRecord>(
  strapi: Core.Strapi,
  uid: string,
  filters: Record<string, unknown>,
  populate?: Record<string, unknown>
): Promise<T | null> {
  const records = (await strapi.documents(uid as never).findMany({
    filters,
    populate,
    pagination: { pageSize: 1 },
  } as never)) as T[];

  return records[0] || null;
}

async function ensureOne<T extends DocumentRecord>(
  strapi: Core.Strapi,
  uid: string,
  filters: Record<string, unknown>,
  data: Record<string, unknown>,
  populate?: Record<string, unknown>
): Promise<T> {
  const existing = await findOne<T>(strapi, uid, filters, populate);
  if (existing) return existing;

  return strapi.documents(uid as never).create({ data } as never) as Promise<T>;
}

function relation(documentId: string) {
  return { connect: [{ documentId }] };
}

export async function seedDemoSchedulingData(strapi: Core.Strapi): Promise<void> {
  const enabled = (process.env.SEED_DEMO_SCHEDULING_DATA ?? 'true').toLowerCase() !== 'false';
  if (!enabled) {
    strapi.log.info('[seed-demo-scheduling-data] Seed demo deshabilitado.');
    return;
  }

  const computers = await ensureByCode(strapi, 'api::classroom-feature.classroom-feature', `${DEMO_PREFIX}-PC`, {
    code: `${DEMO_PREFIX}-PC`,
    name: 'Computadores',
  });

  const mobileChairs = await ensureByCode(
    strapi,
    'api::classroom-feature.classroom-feature',
    `${DEMO_PREFIX}-SILLAS-MOVILES`,
    {
      code: `${DEMO_PREFIX}-SILLAS-MOVILES`,
      name: 'Sillas moviles',
    }
  );

  const teacher = await ensureByCode(strapi, 'api::teacher.teacher', `${DEMO_PREFIX}-DOC-01`, {
    code: `${DEMO_PREFIX}-DOC-01`,
    firstName: 'Laura',
    lastName: 'Martinez',
    email: 'laura.martinez@planify.edu',
    isActive: true,
  });

  const course = await ensureByCode(strapi, 'api::course.course', `${DEMO_PREFIX}-ING-SW`, {
    code: `${DEMO_PREFIX}-ING-SW`,
    name: 'Ingenieria de software',
    weeklySessions: 2,
    sessionDurationMinutes: 120,
    needsNonConsecutiveDays: true,
    isActive: true,
    requiredFeatures: relation(computers.documentId),
  });

  const classroom = await ensureByCode(strapi, 'api::classroom.classroom', `${DEMO_PREFIX}-LAB-301`, {
    code: `${DEMO_PREFIX}-LAB-301`,
    name: 'Laboratorio 301',
    capacity: 32,
    isActive: true,
    features: {
      connect: [{ documentId: computers.documentId }, { documentId: mobileChairs.documentId }],
    },
  });

  const scheduleConfig = await ensureOne(
    strapi,
    'api::schedule-config.schedule-config',
    { name: { $eq: 'Demo final 2026-1' }, academicPeriod: { $eq: '2026-1' } },
    {
      name: 'Demo final 2026-1',
      academicPeriod: '2026-1',
      weekdayStart: '07:00:00.000',
      weekdayEnd: '22:00:00.000',
      lunchStart: '12:00:00.000',
      lunchEnd: '13:00:00.000',
      saturdayEnabled: true,
      saturdayStart: '07:00:00.000',
      saturdayEnd: '13:00:00.000',
      classSizeTolerancePercent: 10,
      closeSectionBelow: 10,
      isActive: true,
    } as Record<string, unknown>
  );

  const group = await ensureByCode(strapi, 'api::academic-group.academic-group', `${DEMO_PREFIX}-ING-SW-01`, {
    code: `${DEMO_PREFIX}-ING-SW-01`,
    capacityTarget: 28,
    minStudents: 10,
    maxStudents: 35,
    status: 'planned',
    course: relation(course.documentId),
    teacher: relation(teacher.documentId),
    scheduleConfig: relation(scheduleConfig.documentId),
  });

  await ensureByCode(strapi, 'api::hard-rule.hard-rule', `${DEMO_PREFIX}-NO-CONFLICTOS`, {
    code: `${DEMO_PREFIX}-NO-CONFLICTOS`,
    name: 'Evitar conflictos de horario',
    isEnabled: true,
    parameters: { appliesTo: ['teacher', 'classroom', 'academicGroup'] },
    scheduleConfig: relation(scheduleConfig.documentId),
  });

  await ensureByCode(strapi, 'api::soft-rule.soft-rule', `${DEMO_PREFIX}-DISTRIBUIR-SESIONES`, {
    code: `${DEMO_PREFIX}-DISTRIBUIR-SESIONES`,
    name: 'Distribuir sesiones durante la semana',
    weight: 80,
    isEnabled: true,
    parameters: { preferMorning: true },
    scheduleConfig: relation(scheduleConfig.documentId),
  });

  const availabilitySlots = [
    { dayOfWeek: 1, startTime: '07:00:00.000', endTime: '12:00:00.000' },
    { dayOfWeek: 3, startTime: '07:00:00.000', endTime: '12:00:00.000' },
  ];

  for (const slot of availabilitySlots) {
    await ensureOne(strapi, 'api::availability.availability', {
      dayOfWeek: { $eq: slot.dayOfWeek },
      startTime: { $eq: slot.startTime },
      endTime: { $eq: slot.endTime },
      teacher: { documentId: { $eq: teacher.documentId } },
    }, {
      ...slot,
      isAvailable: true,
      teacher: relation(teacher.documentId),
    });
  }

  const sessions = [
    { dayOfWeek: 1, startTime: '08:00:00.000', endTime: '10:00:00.000', sessionOrder: 1 },
    { dayOfWeek: 3, startTime: '08:00:00.000', endTime: '10:00:00.000', sessionOrder: 2 },
  ];

  for (const session of sessions) {
    await ensureOne(strapi, 'api::class-session.class-session', {
      sessionOrder: { $eq: session.sessionOrder },
      academicGroup: { documentId: { $eq: group.documentId } },
    }, {
      ...session,
      status: 'planned',
      isLocked: false,
      academicGroup: relation(group.documentId),
      classroom: relation(classroom.documentId),
    });
  }

  strapi.log.info('[seed-demo-scheduling-data] Datos demo de horarios listos.');
}
