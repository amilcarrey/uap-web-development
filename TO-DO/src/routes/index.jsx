import { createFileRoute } from '@tanstack/react-router'
import BoardList from '../components/react/BoardList'

export const Route = createFileRoute('/')({
  component: BoardList,
}) 