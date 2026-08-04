const { test, expect, beforeEach, describe } = require('@playwright/test')

const loginWith = async (page, username, password) => {
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createNewBlog = async (page, blog) => {
  await page.getByRole('button', { name: 'create new blog' }).click()
  const createBlogForm = await page.getByRole('form')
  await createBlogForm.getByLabel('title').fill(blog.title)
  await createBlogForm.getByLabel('author').fill(blog.author)
  await createBlogForm.getByLabel('url').fill(blog.url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.getByText(blog.title).waitFor()
}

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'P. Lay Wright',
        username: 'playwright',
        password: 'playwleft-secret'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Log in to application' })).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'playwright', 'playwleft-secret')
      await page.getByText('login successful').waitFor()

      await expect(page.getByText('P. Lay Wright logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'playwrong', 'asdasdas')

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toBeVisible()
      await expect(errorDiv).toContainText('wrong credentials')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'playwright', 'playwleft-secret')
    })

    test('a new blog can be created', async ({ page }) => {
      const blog = {
        title: 'Playwright E2E testing',
        author: 'P. Lay Wright',
        url: 'http://example.com/playwright-e2e-testing'
      }
      await createNewBlog(page, blog)

      const blogBox = page.locator('.blogBox')
      await expect(blogBox).toBeVisible()
      await expect(blogBox).toContainText(blog.title)
    })
  })
})