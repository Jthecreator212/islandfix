import { test, expect } from '@playwright/test'

test.describe('Signup Page', () => {
  test('renders signup form with role selection', async ({ page }) => {
    await page.goto('/signup')
    await expect(page.getByText('Create your account')).toBeVisible()
    await expect(page.getByText('Join the IslandFix community')).toBeVisible()
    await expect(page.getByText('Homeowner')).toBeVisible()
    await expect(page.getByText('Tradesperson')).toBeVisible()
  })

  test('has all form fields', async ({ page }) => {
    await page.goto('/signup')
    await expect(page.getByPlaceholder('Your full name')).toBeVisible()
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible()
    await expect(page.getByPlaceholder('Min 6 characters')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible()
  })

  test('role toggle works', async ({ page }) => {
    await page.goto('/signup')

    // Homeowner is selected by default
    const homeownerBtn = page.getByRole('button', { name: 'Homeowner' })
    const tradespersonBtn = page.getByRole('button', { name: 'Tradesperson' })

    await expect(homeownerBtn).toHaveClass(/border-\[#4fc3f7\]/)

    // Click tradesperson
    await tradespersonBtn.click()
    await expect(tradespersonBtn).toHaveClass(/border-\[#4fc3f7\]/)
  })

  test('has link to login page', async ({ page }) => {
    await page.goto('/signup')
    const loginLink = page.getByRole('link', { name: 'Log in' })
    await expect(loginLink).toBeVisible()
    await loginLink.click()
    await expect(page).toHaveURL('/login')
  })

  test('password requires minimum 6 characters', async ({ page }) => {
    await page.goto('/signup')
    const passwordInput = page.getByPlaceholder('Min 6 characters')
    await expect(passwordInput).toHaveAttribute('minlength', '6')
  })

  test('all fields are required', async ({ page }) => {
    await page.goto('/signup')
    await expect(page.getByPlaceholder('Your full name')).toHaveAttribute('required', '')
    await expect(page.getByPlaceholder('you@example.com')).toHaveAttribute('required', '')
    await expect(page.getByPlaceholder('Min 6 characters')).toHaveAttribute('required', '')
  })
})
