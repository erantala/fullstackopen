import { render, screen } from '@testing-library/react'
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