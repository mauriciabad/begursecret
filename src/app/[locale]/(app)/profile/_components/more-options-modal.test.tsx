import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '~/test-utils'
import { MoreOptionsModal } from './more-options-modal'

describe('MoreOptionsModal', () => {
  it('shows the correct title', async () => {
    render(<MoreOptionsModal />)

    await userEvent.click(screen.getByRole('button', { name: 'More options' }))

    expect(screen.getByRole('heading', { name: 'More options' })).toBeVisible()
  })
})
