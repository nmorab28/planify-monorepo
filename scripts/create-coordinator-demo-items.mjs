const API_URL = process.env.REACT_APP_API_URL || process.env.API_URL || 'http://localhost:1337';
const ADMIN_EMAIL = process.env.PLANIFY_COORDINATOR_EMAIL || 'coordinator@planify.edu';
const ADMIN_PASSWORD = process.env.PLANIFY_COORDINATOR_PASSWORD || 'Planify123*';

const batch = process.env.PLANIFY_DEMO_BATCH || Date.now().toString().slice(-6);

const jsonHeaders = (jwt) => ({
  Authorization: `Bearer ${jwt}`,
  'Content-Type': 'application/json',
});

const request = async (path, { jwt, method = 'GET', data } = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: jwt ? jsonHeaders(jwt) : { 'Content-Type': 'application/json' },
    body: data === undefined ? undefined : JSON.stringify(data),
  });
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const details = body?.error?.details?.errors?.map((error) => error.message).join(', ');
    throw new Error(`${method} ${path} failed: ${body?.error?.message || details || response.status}`);
  }

  return body;
};

const login = async () => {
  const body = await request('/api/auth/local', {
    method: 'POST',
    data: {
      identifier: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    },
  });
  return body.jwt;
};

const findOne = async (jwt, resource, field, value, extra = '') => {
  const params = new URLSearchParams(extra);
  params.set(`filters[${field}][$eq]`, value);
  params.set('pagination[pageSize]', '1');
  const body = await request(`/api/${resource}?${params.toString()}`, { jwt });
  return body.data?.[0] || null;
};

const create = async (jwt, resource, data) => {
  const body = await request(`/api/${resource}`, {
    jwt,
    method: 'POST',
    data: { data },
  });
  return body.data;
};

const createUnique = async (jwt, resource, field, value, data, extra = '') => {
  const existing = await findOne(jwt, resource, field, value, extra);
  if (existing) return { item: existing, created: false };
  const item = await create(jwt, resource, data);
  return { item, created: true };
};

const relation = (documentId) => ({ connect: [{ documentId }] });

const time = (hhmm) => `${hhmm}:00.000`;

const getActiveScheduleConfig = async (jwt) => {
  const params = new URLSearchParams();
  params.set('filters[isActive][$eq]', 'true');
  params.set('sort', 'createdAt:desc');
  params.set('pagination[pageSize]', '1');
  const body = await request(`/api/schedule-configs?${params.toString()}`, { jwt });

  if (body.data?.[0]) return body.data[0];

  return create(jwt, 'schedule-configs', {
    name: `Configuración Demo ${batch}`,
    academicPeriod: '2026-1',
    weekdayStart: time('07:00'),
    weekdayEnd: time('22:00'),
    saturdayStart: time('07:00'),
    saturdayEnd: time('13:00'),
    lunchStart: time('12:00'),
    lunchEnd: time('13:00'),
    classSizeTolerancePercent: 10,
    closeSectionBelow: 10,
    isActive: true,
  });
};

const main = async () => {
  const jwt = await login();
  const scheduleConfig = await getActiveScheduleConfig(jwt);

  const created = {
    teachers: [],
    courses: [],
    features: [],
    classrooms: [],
    availabilities: [],
    academicGroups: [],
    classSessions: [],
    hardRules: [],
    softRules: [],
  };

  const days = [1, 2, 3, 4, 5];
  const labels = ['A', 'B', 'C', 'D', 'E'];

  for (let index = 0; index < 5; index += 1) {
    const number = index + 1;
    const suffix = `${batch}-${number}`;
    const dayOfWeek = days[index];

    const teacher = await createUnique(jwt, 'teachers', 'code', `DEMO5-DOC-${suffix}`, {
      code: `DEMO5-DOC-${suffix}`,
      firstName: `Docente Demo ${labels[index]}`,
      lastName: `Coordinador ${batch}`,
      email: `demo5.docente.${suffix}@planify.edu`,
      isActive: true,
    });
    created.teachers.push(teacher.item);

    const feature = await createUnique(jwt, 'classroom-features', 'code', `DEMO5-FEAT-${suffix}`, {
      code: `DEMO5-FEAT-${suffix}`,
      name: `Característica demo ${labels[index]}`,
    });
    created.features.push(feature.item);

    const course = await createUnique(jwt, 'courses', 'code', `DEMO5-CUR-${suffix}`, {
      code: `DEMO5-CUR-${suffix}`,
      name: `Curso Demo ${labels[index]} ${batch}`,
      weeklySessions: 1,
      sessionDurationMinutes: 60,
      needsNonConsecutiveDays: false,
      isActive: true,
      requiredFeatures: relation(feature.item.documentId),
    });
    created.courses.push(course.item);

    const classroom = await createUnique(
      jwt,
      'classrooms',
      'code',
      `DEMO5-AULA-${suffix}`,
      {
        code: `DEMO5-AULA-${suffix}`,
        name: `Aula Demo ${labels[index]} ${batch}`,
        capacity: 40 + number,
        isActive: true,
        features: relation(feature.item.documentId),
      },
      'populate=features'
    );
    created.classrooms.push(classroom.item);

    const availability = await create(jwt, 'availabilities', {
      dayOfWeek,
      startTime: time('14:00'),
      endTime: time('16:00'),
      isAvailable: true,
      teacher: relation(teacher.item.documentId),
    });
    created.availabilities.push(availability);

    const group = await createUnique(jwt, 'academic-groups', 'code', `DEMO5-GRP-${suffix}`, {
      code: `DEMO5-GRP-${suffix}`,
      capacityTarget: 25,
      minStudents: 10,
      maxStudents: 35,
      status: 'planned',
      course: relation(course.item.documentId),
      teacher: relation(teacher.item.documentId),
      scheduleConfig: relation(scheduleConfig.documentId),
    });
    created.academicGroups.push(group.item);

    const session = await create(jwt, 'class-sessions', {
      dayOfWeek,
      startTime: time('14:00'),
      endTime: time('15:00'),
      sessionOrder: 1,
      status: 'planned',
      isLocked: false,
      academicGroup: relation(group.item.documentId),
      classroom: relation(classroom.item.documentId),
    });
    created.classSessions.push(session);

    const hardRule = await createUnique(jwt, 'hard-rules', 'code', `DEMO5-HARD-${suffix}`, {
      code: `DEMO5-HARD-${suffix}`,
      name: `Regla obligatoria demo ${labels[index]}`,
      isEnabled: true,
      parameters: { demoBatch: batch, order: number },
      scheduleConfig: relation(scheduleConfig.documentId),
    });
    created.hardRules.push(hardRule.item);

    const softRule = await createUnique(jwt, 'soft-rules', 'code', `DEMO5-SOFT-${suffix}`, {
      code: `DEMO5-SOFT-${suffix}`,
      name: `Regla blanda demo ${labels[index]}`,
      weight: 50 + number,
      isEnabled: true,
      parameters: { demoBatch: batch, order: number },
      scheduleConfig: relation(scheduleConfig.documentId),
    });
    created.softRules.push(softRule.item);
  }

  console.log(
    JSON.stringify(
      {
        batch,
        scheduleConfig: {
          documentId: scheduleConfig.documentId,
          name: scheduleConfig.name,
        },
        counts: Object.fromEntries(Object.entries(created).map(([key, value]) => [key, value.length])),
        samples: {
          teachers: created.teachers.map((item) => item.email),
          courses: created.courses.map((item) => item.code),
          classrooms: created.classrooms.map((item) => item.code),
          groups: created.academicGroups.map((item) => item.code),
        },
      },
      null,
      2
    )
  );
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
