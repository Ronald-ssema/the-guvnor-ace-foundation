import Link from "next/link";

const questions = [
  {
    question: "How can I donate?",
    answer: (
      <p>
        You can donate online through PayPal or GoFundMe, or send Airtel Money
        in Uganda. The payment options above take you directly to the official
        provider or show the verified mobile-money details.
      </p>
    ),
  },
  {
    question: "Can I choose which programme my donation supports?",
    answer: (
      <p>
        Unrestricted donations help us respond where support is most urgently
        needed. If you want to support a particular programme, please{" "}
        <Link href="/contact">contact our team</Link> before donating so we can
        confirm what is possible.
      </p>
    ),
  },
  {
    question: "Is my online donation secure?",
    answer: (
      <p>
        PayPal and GoFundMe process online payments on their own secure
        websites. The Foundation does not collect or store your card details,
        and we will never ask you to send card information by email or message.
      </p>
    ),
  },
  {
    question: "Will I receive a confirmation or receipt?",
    answer: (
      <p>
        PayPal and GoFundMe normally send an electronic confirmation. For
        Airtel Money or additional receipt support, keep your transaction
        reference and <Link href="/contact">contact our team</Link>.
      </p>
    ),
  },
  {
    question: "Can I make a monthly donation?",
    answer: (
      <p>
        Recurring options depend on the payment provider and your location.
        Check the options displayed by PayPal or GoFundMe, or contact us if you
        would like help arranging regular support.
      </p>
    ),
  },
  {
    question: "Can I claim UK Gift Aid?",
    answer: (
      <p>
        We do not currently present donations on this website as eligible for
        UK Gift Aid. Please do not make a tax claim unless the Foundation has
        given you written confirmation that your donation qualifies.
      </p>
    ),
  },
  {
    question: "What if I made a payment by mistake?",
    answer: (
      <p>
        Contact us as soon as possible with the payment provider and
        transaction reference. Requests are handled under our{" "}
        <Link href="/donation-refund">Donation and Refund Policy</Link>.
      </p>
    ),
  },
];

export default function DonationFaq({ paypalHref }: { paypalHref: string }) {
  return (
    <section
      className="page-section donation-faq-section"
      aria-labelledby="donation-faq-heading"
    >
      <div className="site-container">
        <div className="donation-faq-appeal">
          <div>
            <p>Help children and families build safer, stronger futures</p>
            <strong>Give practical support today.</strong>
          </div>
          <a
            href={paypalHref}
            target="_blank"
            rel="noopener noreferrer"
            className="donation-faq-appeal-button"
          >
            Donate now
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="donation-faq-layout">
          <div className="donation-faq-intro">
            <p className="section-eyebrow">Donation support</p>
            <h2 id="donation-faq-heading">Frequently asked questions</h2>
            <p>
              Clear answers about secure payments, receipts and how your gift
              can support the Foundation’s work.
            </p>
          </div>

          <div className="donation-faq-list">
            {questions.map((item) => (
              <details key={item.question} className="donation-faq-item">
                <summary>
                  <span>{item.question}</span>
                  <span className="donation-faq-icon" aria-hidden="true" />
                </summary>
                <div className="donation-faq-answer">{item.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

