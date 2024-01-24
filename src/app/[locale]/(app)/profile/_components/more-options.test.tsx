import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MoreOptions } from '~/app/[locale]/(app)/profile/_components/more-options'
import { render } from '~/test-utils'

describe('MoreOptionsModal', () => {
  it('shows the correct title', async () => {
    render(<MoreOptions />)

    await userEvent.click(screen.getByRole('button', { name: 'More options' }))

    expect(screen.getByRole('heading', { name: 'More options' })).toBeVisible()
  })
})
