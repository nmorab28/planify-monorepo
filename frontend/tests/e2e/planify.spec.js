const { expect, test } = require('@playwright/test');

const credentials = {
  coordinator: {
    email: 'coordinator@planify.edu',
    password: 'Planify123*',
  },
  teacher: {
    email: 'teacher@planify.edu',
    password: 'Planify123*',
  },
  student: {
    email: 'student@planify.edu',
    password: 'Planify123*',
  },
};

const login = async (page, user) => {
  await page.goto('/login');
  await page.getByPlaceholder('Escriba su dirección de correo').fill(user.email);
  await page.getByPlaceholder('Escriba su contraseña').fill(user.password);
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
};

const sidebarItem = (page, label) => page.locator('.nav-text').filter({ hasText: label });

test.beforeEach(async ({ page }) => {
  await page.goto('/login');
  await page.evaluate(() => localStorage.clear());
});

test('coordinador ve las opciones academicas principales', async ({ page }) => {
  await login(page, credentials.coordinator);

  await expect(page.getByText('Panel principal').first()).toBeVisible();
  await expect(sidebarItem(page, 'Planificación')).toBeVisible();
  await expect(sidebarItem(page, 'Docentes')).toBeVisible();
  await expect(sidebarItem(page, 'Cursos')).toBeVisible();
  await expect(sidebarItem(page, 'Aulas')).toBeVisible();
  await expect(sidebarItem(page, 'Sesiones de clase')).toBeVisible();
});

test('docente solo ve disponibilidad y no ve administracion academica', async ({ page }) => {
  await login(page, credentials.teacher);

  await expect(sidebarItem(page, 'Disponibilidad')).toBeVisible();
  await expect(sidebarItem(page, 'Cursos')).toHaveCount(0);
  await expect(sidebarItem(page, 'Aulas')).toHaveCount(0);
  await expect(sidebarItem(page, 'Sesiones de clase')).toHaveCount(0);
});

test('estudiante queda limitado al panel principal', async ({ page }) => {
  await login(page, credentials.student);

  await expect(page.getByText('Panel principal').first()).toBeVisible();
  await expect(sidebarItem(page, 'Disponibilidad')).toHaveCount(0);
  await expect(sidebarItem(page, 'Docentes')).toHaveCount(0);
  await expect(sidebarItem(page, 'Cursos')).toHaveCount(0);
});

test('coordinador puede abrir calendario y exportar csv', async ({ page }) => {
  await login(page, credentials.coordinator);
  await page.goto('/schedule-calendar');

  await expect(page.getByText('Vista calendario base')).toBeVisible();
  await expect(page.locator('#scheduleCalendar')).toBeVisible();

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Exportar CSV' }).click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe('calendario-planify.csv');
});
