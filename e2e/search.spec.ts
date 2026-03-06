import { test, expect } from '@playwright/test'

test.describe('Search Page', () => {
  test('renders search heading and filters', async ({ page }) => {
    await page.goto('/search')
    await expect(page.getByText('Find Tradespeople')).toBeVisible()
    await expect(page.getByText('Browse verified professionals')).toBeVisible()
  })

  test('displays search input and button', async ({ page }) => {
    await page.goto('/search')
    await expect(page.getByPlaceholder('Search by name, location, or skill...')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Search' })).toBeVisible()
  })

  test('displays category filter pills', async ({ page }) => {
    await page.goto('/search')
    await expect(page.getByRole('button', { name: 'All Trades' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Plumbing' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Electrical' })).toBeVisible()
  })

  test('displays sort dropdown', async ({ page }) => {
    await page.goto('/search')
    const sortSelect = page.locator('select')
    await expect(sortSelect).toBeVisible()
    await expect(sortSelect).toContainText('Highest Rated')
  })

  test('category filter updates URL', async ({ page }) => {
    await page.goto('/search')
    await page.getByRole('button', { name: 'Plumbing' }).click()
    await expect(page).toHaveURL(/category=plumbing/)
  })

  test('search input submits query', async ({ page }) => {
    await page.goto('/search')
    await page.getByPlaceholder('Search by name, location, or skill...').fill('Kingston')
    await page.getByRole('button', { name: 'Search' }).click()
    await expect(page).toHaveURL(/q=Kingston/)
  })

  test('sort dropdown updates URL', async ({ page }) => {
    await page.goto('/search')
    await page.locator('select').selectOption('price-low')
    await expect(page).toHaveURL(/sort=price-low/)
  })

  test('loads from category link on homepage', async ({ page }) => {
    await page.goto('/search?category=plumbing')
    await expect(page.getByText('Find Tradespeople')).toBeVisible()
    // Plumbing button should be active
    const plumbingBtn = page.getByRole('button', { name: 'Plumbing' })
    await expect(plumbingBtn).toHaveClass(/bg-\[#4fc3f7\]/)
  })

  test('shows empty state when no results', async ({ page }) => {
    await page.goto('/search?q=zzzznonexistent12345')
    await expect(page.getByText('No tradespeople found')).toBeVisible()
  })
})
