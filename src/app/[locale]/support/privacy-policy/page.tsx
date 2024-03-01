import type { Metadata } from 'next'
import { useFormatter } from 'next-intl'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import type { FC } from 'react'
import { parseLocale, type LocaleRouteParams } from '~/i18n'

export async function generateMetadata({
  params,
}: LocaleRouteParams): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'privacy-policy',
  })
  return {
    title: {
      default: t('meta.title'),
      template: `%s | ${t('meta.title')}`,
    },
    description: t('meta.description'),
  }
}

const lastUpdate = new Date('2023-10-20')

const PrivacyPolicyPage: FC<LocaleRouteParams> = ({ params }) => {
  const locale = parseLocale(params.locale)
  unstable_setRequestLocale(locale)

  const format = useFormatter()

  const formatedLastUpdate = format.dateTime(lastUpdate, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <>
      <div className="prose">
        <h1>Privacy Policy</h1>
        <blockquote>Last updated: {formatedLastUpdate} </blockquote>
        <p>
          We at Begur Secret are committed to protecting your privacy and
          personal information. This Privacy Policy explains how we collect,
          use, and safeguard your data when you use our web application. We are
          in compliance with the European Union&#39;s General Data Protection
          Regulation (GDPR).
        </p>
        <p>
          <strong>1. Information We Collect</strong>
        </p>
        <ul>
          <li>
            <p>
              <strong>Personal Information:</strong> We collect your name and
              email address only when you willingly provide it for specific
              purposes, such as newsletters or customer support.
            </p>
          </li>
          <li>
            <p>
              <strong>Usage Information:</strong> We collect non-personal
              information, like your device type, browser, and the pages you
              visit, to improve your experience and app performance.
            </p>
          </li>
        </ul>
        <p>
          <strong>2. How We Use Your Information</strong>
        </p>
        <ul>
          <li>
            <p>
              <strong>Providing Services:</strong> We use your personal
              information to provide you with our app services, answer your
              inquiries, and send updates you request.
            </p>
          </li>
          <li>
            <p>
              <strong>Analytics:</strong> We use usage information to understand
              how our app is used and make improvements.
            </p>
          </li>
        </ul>
        <p>
          <strong>3. Data Sharing</strong>
        </p>
        <ul>
          <li>
            <p>
              <strong>Third Parties:</strong> We do not sell, rent, or share
              your personal information with third parties for marketing
              purposes.
            </p>
          </li>
          <li>
            <p>
              <strong>Service Providers:</strong> We may share data with trusted
              service providers who help us run and maintain our app, subject to
              strict data protection standards.
            </p>
          </li>
        </ul>
        <p>
          <strong>4. Cookies and Tracking</strong>
        </p>
        <ul>
          <li>
            We use cookies and similar technologies for a better user
            experience, understanding usage patterns, and gathering analytics
            data.
          </li>
        </ul>
        <p>
          <strong>5. Your Choices</strong>
        </p>
        <ul>
          <li>
            <p>
              <strong>Opt-Out:</strong> You can opt out of receiving
              communications from us and manage cookies settings in your
              browser.
            </p>
          </li>
          <li>
            <p>
              <strong>Access and Correction:</strong> You can request access or
              corrections to your personal data by contacting us.
            </p>
          </li>
        </ul>
        <p>
          <strong>6. Data Security</strong>
        </p>
        <ul>
          <li>
            We employ industry-standard security measures to protect your data
            from unauthorized access and breaches.
          </li>
        </ul>
        <p>
          <strong>7. Children&#39;s Privacy</strong>
        </p>
        <ul>
          <li>
            Our services are not intended for users under 18 years of age. We do
            not knowingly collect information from children.
          </li>
        </ul>
        <p>
          <strong>8. Changes to this Privacy Policy</strong>
        </p>
        <ul>
          <li>
            We may update this policy as our services evolve. Check for changes
            periodically.
          </li>
        </ul>
        <p>
          <strong>9. Contact Us</strong>
        </p>
        <ul>
          <li>
            If you have questions or concerns regarding your privacy, please
            contact us at
            <a href="mailto:hola@begursecret.com">hola@begursecret.com</a>.
          </li>
        </ul>
        <p>
          By using Begur Secret, you agree to this Privacy Policy. Your trust is
          essential to us, and we are committed to protecting your data and
          ensuring a transparent and secure user experience.
        </p>
        <p>Thank you for using Begur Secret!</p>
        <p>
          Begur Secret | Begur, Girona, Spain |
          <a href="mailto:hola@begursecret.com">hola@begursecret.com</a>
        </p>
      </div>
    </>
  )
}

export default PrivacyPolicyPage
