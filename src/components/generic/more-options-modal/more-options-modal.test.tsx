import { IconHelpCircle } from '@tabler/icons-react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '~/test-utils'
import { MoreOptionsModal, MoreOptionsModalButton } from './more-options-modal'

describe('MoreOptionsModal', () => {
  it('shows the correct title', async () => {
    render(
      <MoreOptionsModal title="More options">
        <MoreOptionsModalButton
          url="/support"
          text="Support"
          icon={<IconHelpCircle />}
          isExternal
        />
      </MoreOptionsModal>
    )

    await userEvent.click(screen.getByRole('button', { name: 'More options' }))

    expect(screen.getByRole('heading', { name: 'More options' })).toBeVisible()
  })
})
