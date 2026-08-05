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

const loginViaApi = async (request, username, password) => {
  const response = await request.post('/api/login', {
    data: { username, password }
  })
  const responseBody = await response.json()
  return responseBody.token
}

const createBlogViaApi = async (request, token, blog) => {
  await request.post('/api/blogs', {
    data: blog,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'P. Lay Wright',
        username: 'playwright',
        password: 'playwright-secret'
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
      await loginWith(page, 'playwright', 'playwright-secret')
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
      await loginWith(page, 'playwright', 'playwright-secret')
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

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        const blog = {
          title: 'Playwrights old and existing blog',
          author: 'P. Lay Wright',
          url: 'http://example.com/playwright-e2e-testing'
        }
        await createNewBlog(page, blog)
      })

      test('it can be liked', async ({ page }) => {
        const blogBox = page.locator('.blogBox')
        await blogBox.getByRole('button', { name: 'view' }).click()
        await blogBox.getByRole('button', { name: 'like' }).click()

        await expect(blogBox).toContainText('likes 1')
      })

      test('it can be deleted', async ({ page }) => {
        page.once('dialog', async dialog => {
          await dialog.accept()
        })

        const blogBox = page.locator('.blogBox')
        await blogBox.getByRole('button', { name: 'view' }).click()
        await blogBox.getByRole('button', { name: 'remove' }).click()

        await expect(blogBox).not.toBeVisible()
        await expect(page.locator('.notification')).toContainText('blog deleted')
      })
    })
  })

  describe('When another user and multiple blogs already exist', () => {
    beforeEach(async ({ page, request }) => {
      // playwright user already created in the outer beforeEach
      const user_playwright = {
        name: 'P. Lay Wright',
        username: 'playwright',
        password: 'playwright-secret'
      }

      const user_playwrong = {
        name: 'Lay Wong',
        username: 'laywong',
        password: 'laywong-secret'
      }

      await request.post('/api/users', {
        data: user_playwrong
      })

      const playwrightToken = await loginViaApi(request, user_playwright.username, user_playwright.password)
      const playwrongToken = await loginViaApi(request, user_playwrong.username, user_playwrong.password)

      await createBlogViaApi(request, playwrightToken, {
        title: 'A Blog That I Created Earlier',
        author: 'Peter Lay Wright',
        url: 'http://example.com/owner-blog',
        likes: 2
      })

      await createBlogViaApi(request, playwrongToken, {
        title: 'Hands Off, Not Your Blog!',
        author: 'P. Lay Wong',
        url: 'http://example.com/another-user-blog',
        likes: 5
      })

      await page.reload()
    })

    describe('when Mr. Wright has logged in', () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, 'playwright', 'playwright-secret')
        await expect(page.getByText('P. Lay Wright logged in')).toBeVisible()
      })

      test('only own blogs can be deleted', async ({ page }) => {
        const blogBoxes = page.locator('.blogBox')
        await expect(blogBoxes).toHaveCount(2)

        const viewButtons = await blogBoxes.getByRole('button', { name: 'view' })
        viewButtons.nth(0).click()
        viewButtons.nth(1).click()

        await expect(blogBoxes.filter({ hasText: 'A Blog That I Created Earlier' }).getByRole('button', { name: 'remove' })).toBeVisible()
        await expect(blogBoxes.filter({ hasText: 'Hands Off, Not Your Blog!' }).getByRole('button', { name: 'remove' })).not.toBeVisible()
      })

      describe('and Mr Wright has created a new blog', () => {
        beforeEach(async ({ page }) => {
          await createNewBlog(page, {
            title: 'My Newly Created Blog',
            author: 'Alter Ego',
            url: 'http://blog.ly'
          })
        })

        test('blogs are ordered by likes in descending order', async ({ page }) => {
          const blogBoxes = page.locator('.blogBox')
          const blogCount = await blogBoxes.count()
          expect(blogCount).toBe(3)

          const viewButtons = await blogBoxes.getByRole('button', { name: 'view' })
          await expect(viewButtons).toHaveCount(blogCount)

          while (await viewButtons.count()) {
            await viewButtons.first().click()
          }

          await expect(blogBoxes.getByRole('button', { name: 'hide' })).toHaveCount(blogCount)

          const blogBoxesTextContents = await blogBoxes.allTextContents()
          const likesArray = blogBoxesTextContents.map(textContent => parseInt(textContent.match(/likes (\d+)/)[1]))

          expect(likesArray).toStrictEqual([5, 2, 0])
        })

        test('blogs are re-ordered after likes are incremented', async ({ page }) => {
          const blogBoxes = page.locator('.blogBox')
          const myNewlyCreatedBlog = blogBoxes.filter({ hasText: 'My Newly Created Blog' })

          const viewButtons = await blogBoxes.getByRole('button', { name: 'view' })

          while (await viewButtons.count()) {
            await viewButtons.first().click()
          }

          const likeButton = myNewlyCreatedBlog.getByRole('button', { name: 'like' })
          for (let i = 0; i < 3; i++) {
            await likeButton.click()
          }

          const blogBoxesTextContents = await blogBoxes.allTextContents()
          const likesArray = blogBoxesTextContents.map(textContent => parseInt(textContent.match(/likes (\d+)/)[1]))
          expect(likesArray).toStrictEqual([5, 3, 2])
          expect(blogBoxes.nth(1)).toContainText('My Newly Created Blog')
        })
      })

    })

  })
})