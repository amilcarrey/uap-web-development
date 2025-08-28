import { it, expect, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ReviewForm from '../components/ReviewForm'

it('valida texto mínimo y dispara onSubmit', async () => {
  const onSubmit = vi.fn().mockResolvedValue(undefined)
  render(<ReviewForm bookId="b1" onSubmit={onSubmit} />)

  const input = screen.getByPlaceholderText('¿Qué te pareció?')
  const publishBtn = screen.getByText(/publicar reseña/i)

  const user = userEvent.setup()

  // muy corto -> muestra error
  await user.type(input, 'ok')
  await user.click(publishBtn)
  expect(await screen.findByText(/muy corta/i)).toBeInTheDocument()

  // válido -> llama onSubmit
  await user.clear(input)
  await user.type(input, 'Muy buen libro')
  await user.click(publishBtn)
  expect(onSubmit).toHaveBeenCalledOnce()
})
