import { Button } from '@nextui-org/button'
import { Card } from '@nextui-org/card'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalProps,
} from '@nextui-org/modal'
import {
  IconCircleCheck,
  IconDiscountCheckFilled,
  IconQrcodeOff,
} from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import { FC } from 'react'
import { AlertBox } from '~/components/generic/alert-box'
import { DividerWithText } from '~/components/generic/divider-with-text'

export const ValidatePlaceVisitModal: FC<
  Omit<ModalProps, 'children'> & {
    onValidate: (hasBeenVerified: boolean) => void
  }
> = ({ isOpen, onOpenChange, onValidate }) => {
  const t = useTranslations('validate')
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {t('validate-visit')}
            </ModalHeader>
            <ModalBody className="block space-y-2 pb-6 pt-0">
              <>
                <Card className="mb-4 space-y-2 p-4 text-center">
                  <div className="mx-auto inline-block rounded-full bg-primary-50 p-4 text-primary-900">
                    <IconQrcodeOff size={24 * 2} stroke={1.5} />
                  </div>
                  <p className="font-bold">{t('place-has-no-code')}</p>
                  <p>{t('use-device-location-to-validate')}</p>
                </Card>

                <AlertBox type="warning">
                  {t('grant-location-permission-to-continue')}
                </AlertBox>

                <Button
                  color="primary"
                  fullWidth
                  onPress={() => {
                    onValidate(true)
                    onClose()
                  }}
                  startContent={<IconDiscountCheckFilled size={20} />}
                >
                  {t('validate-visit')}
                </Button>

                <DividerWithText text={t('or')} />

                <Button
                  fullWidth
                  onPress={() => {
                    onValidate(false)
                    onClose()
                  }}
                  startContent={
                    <IconCircleCheck className="text-stone-700" size={20} />
                  }
                >
                  {t('continue-without-validating')}
                </Button>
              </>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
