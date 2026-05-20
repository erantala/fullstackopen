import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogCreation from './BlogCreation'
import { test } from 'vitest'

test('Blog creation form calls event handler with right details', async () => {
  const mockHandler = vi.fn()

  render(<BlogCreation submitBlog={mockHandler} />)

  const user = userEvent.setup()

  const [titleInput, authorInput, urlInput] = screen.getAllByRole('textbox')

  await userEvent.type(titleInput, 'Decicions, decisions!')
  await userEvent.type(authorInput, 'Tonalt Drump')
  await userEvent.type(urlInput, 'http://gov.us/dtrump/blog/should-I-order-diet-coke-or-invade-Iran')

  const createButton = screen.getByText('create')
  await user.click(createButton)

  expect(mockHandler).toHaveBeenCalledWith({
    author: 'Tonalt Drump',
    title: 'Decicions, decisions!',
    url: 'http://gov.us/dtrump/blog/should-I-order-diet-coke-or-invade-Iran',
  })
})