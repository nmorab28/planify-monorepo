const { expect, test } = require('@playwright/test');

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:1337';

const credentials = {
  email: 'coordinator@planify.edu',
  password: 'Planify123*',
};

const suffix = () => Date.now().toString().slice(-6);

const loginAsCoordinator = async (page) => {
  await page.goto('/login');
  await page.evaluate(() => localStorage.clear());
  await page.getByPlaceholder('Escriba su dirección de correo').fill(credentials.email);
  await page.getByPlaceholder('Escriba su contraseña').fill(credentials.password);
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByText('Coordinador académico').first()).toBeVisible();
};

const authHeaders = async (page) => {
  const token = await page.evaluate(() => {
    const details = JSON.parse(localStorage.getItem('userDetails') || '{}');
    return details.idToken || details.jwt;
  });

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

const apiGetFirstByField = async (request, page, resource, field, value, query = '') => {
  const headers = await authHeaders(page);
  const params = new URLSearchParams(query);
  params.set(`filters[${field}][$eq]`, value);
  const response = await request.get(`${API_URL}/api/${resource}?${params.toString()}`, { headers });
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.data?.length).toBeGreaterThan(0);
  return body.data[0];
};

const apiPost = async (request, page, resource, data) => {
  const headers = await authHeaders(page);
  const response = await request.post(`${API_URL}/api/${resource}`, {
    headers,
    data: { data },
  });
  expect(response.ok()).toBeTruthy();
  return (await response.json()).data;
};

const firstScheduleConfig = async (request, page) => {
  const headers = await authHeaders(page);
  const response = await request.get(`${API_URL}/api/schedule-configs?sort=name:asc`, { headers });
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.data?.length).toBeGreaterThan(0);
  return body.data[0];
};

const chooseReactSelectOption = async (page, placeholder, optionText) => {
  await page.getByText(placeholder).click({ force: true });
  await page.keyboard.type(optionText);
  await page.keyboard.press('Enter');
};

test('coordinador crea entidades academicas con datos reales de Strapi', async ({ page, request }) => {
  test.setTimeout(90_000);

  const id = suffix();
  const courseCode = `QA-CUR-${id}`;
  const courseName = `Curso QA ${id}`;
  const teacherCode = id;
  const teacherName = `Docente QA ${id}`;
  const teacherLastName = 'Planify';
  const teacherEmail = `docente.qa.${id}@planify.edu`;
  const featureCode = `QA-FEAT-${id}`;
  const classroomCode = `QA-AULA-${id}`;
  const classroomName = `Aula QA ${id}`;
  const groupCode = `QA-GRP-${id}`;

  await loginAsCoordinator(page);

  await page.goto('/add-courses');
  await page.locator('input[name="name"]').fill(courseName);
  await page.locator('input[name="code"]').fill(courseCode);
  await page.locator('input[name="weeklySessions"]').fill('1');
  await page.locator('input[name="sessionDurationMinutes"]').fill('60');
  await page.getByRole('button', { name: 'Guardar' }).click();
  await expect(page.getByText('Curso creado correctamente')).toBeVisible();
  const course = await apiGetFirstByField(request, page, 'courses', 'code', courseCode);

  page.once('dialog', (dialog) => dialog.accept());
  await page.goto('/add-professor');
  await page.locator('#first_name').fill(teacherName);
  await page.locator('#last_name').fill(teacherLastName);
  await page.locator('#email_here').fill(teacherEmail);
  await page.locator('#teacher_code').fill(teacherCode);
  await page.getByRole('button', { name: 'Guardar' }).click();
  await expect(page).toHaveURL(/\/all-professors$/);
  const teacher = await apiGetFirstByField(request, page, 'teachers', 'code', teacherCode);

  await page.goto('/add-classroom');
  await page.getByRole('button', { name: '+ Nueva característica' }).click();
  await page.getByPlaceholder('Ej: PROYECTOR', { exact: true }).fill(featureCode);
  await page.getByPlaceholder('Ej: Proyector HDMI', { exact: true }).fill(`Característica QA ${id}`);
  await page.getByRole('button', { name: 'Crear' }).click();
  await expect(page.getByText('Característica creada')).toBeVisible();
  await expect(page.locator('.modal.show')).toHaveCount(0);
  await page.locator('#code').fill(classroomCode);
  await page.locator('#name').fill(classroomName);
  await page.locator('#capacity').fill('40');
  await page.getByRole('button', { name: 'Guardar' }).click();
  await expect(page).toHaveURL(/\/all-classrooms$/);
  const classroom = await apiGetFirstByField(
    request,
    page,
    'classrooms',
    'code',
    classroomCode,
    'populate=features'
  );

  await page.goto(`/add-availability?teacher=${teacher.documentId}`);
  await expect(page.getByText(teacherName)).toBeVisible();
  await page.locator('#startTime').fill('15:00');
  await page.locator('#endTime').fill('17:00');
  await page.getByRole('button', { name: 'Guardar' }).click();
  await expect(page).toHaveURL(/\/all-availability$/);

  const scheduleConfig = await firstScheduleConfig(request, page);
  await apiPost(request, page, 'academic-groups', {
    code: groupCode,
    capacityTarget: 20,
    minStudents: 10,
    maxStudents: 30,
    status: 'draft',
    course: { connect: [{ documentId: course.documentId }] },
    teacher: { connect: [{ documentId: teacher.documentId }] },
    scheduleConfig: { connect: [{ documentId: scheduleConfig.documentId }] },
  });

  await page.goto('/add-class-session');
  await chooseReactSelectOption(page, 'Selecciona curso, grupo y docente', groupCode);
  await page.locator('#dayOfWeek').selectOption('1');
  await page.locator('#startTime').fill('15:00');
  await page.locator('#endTime').fill('16:00');
  await chooseReactSelectOption(page, 'Selecciona un aula', classroomCode);
  await page.locator('#sessionOrder').fill('1');
  await page.locator('#status').selectOption('planned');
  await page.getByRole('button', { name: 'Guardar' }).click();
  await expect(page).toHaveURL(/\/all-class-sessions$/);

  await page.goto('/all-courses');
  await expect(page.getByText(courseCode).first()).toBeVisible();
  await page.goto('/all-professors');
  await page.locator('input[type="search"]').fill(teacherEmail);
  await expect(page.getByText(teacherEmail).first()).toBeVisible();
  await page.goto('/all-classrooms');
  await expect(page.getByText(classroomCode).first()).toBeVisible();
  await page.goto('/all-availability');
  await expect(page.getByText(teacherName).first()).toBeVisible();
  await page.goto('/all-class-sessions');
  await expect(page.getByText(groupCode).first()).toBeVisible();
  await expect(page.getByText(classroomCode).first()).toBeVisible();
  expect(classroom.features?.length || 0).toBeGreaterThan(0);
});
