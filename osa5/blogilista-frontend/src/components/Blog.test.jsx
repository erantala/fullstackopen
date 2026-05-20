import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('Blog title is rendered', () => {
  const blog = {
    title: 'Make component testing great again',
    author: 'Donakd T.'
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText('Make component testing great again')
  expect(element).toBeDefined()
})

test('Url, likes and user are shown when view button is clicked', async () => {
  const blogUser = {
    name: 'James David Vance',
    username: 'jdvance'
  }

  const blog = {
    title: 'Make component testing great again',
    author: 'Donakd T.',
    user: blogUser,
    url: 'http://gov.us/donald/blog',
    likes: 1
  }

  render(<Blog blog={blog} loggedUser={blogUser} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  screen.getByText('http://gov.us/donald/blog', { exact: false })
  screen.getByText('likes 1', { exact: false })
  screen.getByText('James David Vance', { exact: false })
})