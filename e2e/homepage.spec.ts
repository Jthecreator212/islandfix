import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('loads with correct title and hero', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/IslandFix/)
    await expect(page.locator('h1')).toContainText('Find Trusted Trades')
    await expect(page.locator('h1')).toContainText('Across the Caribbean')
  })

  test('displays navigation bar with logo', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('nav')).toBeVisible()
    await expect(page.locator('nav').getByText('IslandFix')).toBeVisible()
  })

  test('shows Find Trades and Sign Up nav links', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'Find Trades' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Sign Up' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Log In' })).toBeVisible()
  })

  test('displays 6 trade categories', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Browse by Trade')).toBeVisible()
    const categories = ['Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Roofing', 'Landscaping']
    for (const cat of categories) {
      await expect(page.getByText(cat, { exact: true }).first()).toBeVisible()
    }
  })

  test('displays How It Works section', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Simple as 1, 2, 3')).toBeVisible()
    await expect(page.getByText('Search', { exact: true })).toBeVisible()
    await expect(page.getByText('Compare & Book')).toBeVisible()
    await expect(page.getByText('Get It Done')).toBeVisible()
  })

  test('displays Built for Trust features', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Built for Trust')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Verified Tradespeople' })).toBeVisible()
    await expect(page.getByText('Honest Reviews')).toBeVisible()
    await expect(page.getByText('Direct Messaging')).toBeVisible()
  })

  test('hero CTA links work', async ({ page }) => {
    await page.goto('/')
    const findBtn = page.getByRole('link', { name: 'Find a Tradesperson' })
    await expect(findBtn).toBeVisible()
    await expect(findBtn).toHaveAttribute('href', '/search')

    const joinBtn = page.getByRole('link', { name: 'Join as a Tradesperson' })
    await expect(joinBtn).toBeVisible()
    await expect(joinBtn).toHaveAttribute('href', '/signup')
  })

  test('category cards link to search with filter', async ({ page }) => {
    await page.goto('/')
    const plumbingCard = page.getByRole('link', { name: 'Plumbing' })
    await expect(plumbingCard).toHaveAttribute('href', '/search?category=plumbing')
  })

  test('footer is visible with copyright', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('2026 IslandFix')).toBeVisible()
  })
})
