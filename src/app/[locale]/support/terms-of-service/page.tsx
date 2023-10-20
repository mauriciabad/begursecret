import type { Metadata } from 'next'
import { useFormatter } from 'next-intl'
import { getTranslator } from 'next-intl/server'
import type { FC } from 'react'
import type { LocaleRouteParams } from '~/i18n'

export async function generateMetadata({
  params,
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslator(params.locale, 'terms-of-service')
  return {
    description: t('meta.description'),
    title: {
      default: t('meta.title'),
      template: `%s | ${t('meta.title')}`,
    },
  }
}

const lastUpdate = new Date('2023-10-20')

const TermsAndServicesPage: FC<LocaleRouteParams> = () => {
  const format = useFormatter()

  const formatedLastUpdate = format.dateTime(lastUpdate, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <>
      <div className="prose">
        <h1>Terms of Service</h1>
        <blockquote>Last updated: {formatedLastUpdate} </blockquote>

        <p>
          Welcome to Descobreix Begur App! We&#39;re delighted to have you as a
          user. Please read these easy-to-understand terms of service, which
          outline the rules for using our web application.
        </p>
        <p>
          <strong>1. Acceptance of Terms</strong>
        </p>
        <p>
          By using Descobreix Begur App, you agree to these terms and
          conditions. If you don&#39;t agree, please don&#39;t use our app.
        </p>
        <p>
          <strong>2. Using Our App</strong>
        </p>
        <ul>
          <li>
            <p>You must be at least 18 years old to use our app.</p>
          </li>
          <li>
            <p>You agree to use our app for lawful and legitimate purposes.</p>
          </li>
          <li>
            <p>Respect the privacy and rights of others while using our app.</p>
          </li>
        </ul>
        <p>
          <strong>3. Your Account</strong>
        </p>
        <ul>
          <li>
            <p>
              You&#39;re responsible for keeping your account information and
              password secure.
            </p>
          </li>
          <li>
            <p>
              If you suspect unauthorized access to your account, please let us
              know immediately.
            </p>
          </li>
        </ul>
        <p>
          <strong>4. Content and Ownership</strong>
        </p>
        <ul>
          <li>
            <p>We own the content and materials provided on our app.</p>
          </li>
          <li>
            <p>
              You may use our app and content for personal, non-commercial use.
            </p>
          </li>
        </ul>
        <p>
          <strong>5. Privacy</strong>
        </p>
        <p>
          We respect your privacy. Please read our Privacy Policy to understand
          how we collect, use, and protect your data.
        </p>
        <p>
          <strong>6. Termination</strong>
        </p>
        <p>
          We can terminate or suspend your account if you violate these terms.
        </p>
        <p>
          <strong>7. Changes to the Terms</strong>
        </p>
        <p>
          We may update these terms as our app evolves. Check for changes
          periodically.
        </p>
        <p>
          <strong>8. Disclaimers</strong>
        </p>
        <ul>
          <li>
            <p>
              We provide our app &quot;as is&quot; and make no guarantees about
              its accuracy, reliability, or availability.
            </p>
          </li>
          <li>
            <p>
              We are not responsible for any harm or damages resulting from
              using our app.
            </p>
          </li>
        </ul>
        <p>
          <strong>9. Limitation of Liability</strong>
        </p>
        <p>
          We are not liable for any indirect, special, or consequential damages.
        </p>
        <p>
          <strong>10. Governing Law</strong>
        </p>
        <p>These terms are governed by Spanish law.</p>
        <p>
          <strong>11. Contact Us</strong>
        </p>
        <p>
          If you have questions or concerns, please contact us at{' '}
          <a href="mailto:descobreixbegur@gmail.com">
            descobreixbegur@gmail.com
          </a>
          .
        </p>
        <p>
          Thanks for using Descobreix Begur App! We hope you enjoy your
          experience and respect these terms while using our app.
        </p>
        <p>
          Descobreix Begur App | Begur, Girona, Spain |{' '}
          <a href="mailto:descobreixbegur@gmail.com">
            descobreixbegur@gmail.com
          </a>
        </p>
      </div>
    </>
  )
}

export default TermsAndServicesPage
