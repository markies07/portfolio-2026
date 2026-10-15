import { PERSON, SOCIALS } from "@/lib/content";
import ScrollReveal from "./ScrollReveal";
import SectionHeading from "./SectionHeading";
import ContactForm from "./ContactForm";
import EmailLink from "./EmailLink";
import { GithubIcon, FacebookIcon, MailIcon } from "./SocialIcons";

const ICONS = {
  GitHub: GithubIcon,
  Facebook: FacebookIcon,
  Email: MailIcon,
};

export default function Contact() {
  return (
    <section id="contact" className="relative bg-ink py-28 sm:py-36 lg:py-44">
      <div className="mx-auto max-w-[100rem] px-5 sm:px-8 lg:px-12 xl:px-16">
        <SectionHeading eyebrow="Contact" title="Start a Conversation" titleClassName="uppercase" />

        <div className="mt-16 sm:mt-24 grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16">
          <ScrollReveal className="lg:col-span-5">
            <p className="max-w-md text-lg sm:text-xl leading-relaxed text-paper/70">
              Have a project in mind? I&apos;d love to hear about it. Send me a
              message and I&apos;ll get back to you as soon as I can.
            </p>

            <dl className="mt-12 flex flex-col gap-8">
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/45">
                  Email
                </dt>
                <dd className="mt-2">
                  <EmailLink className="text-base sm:text-lg text-paper/85 transition-colors duration-300 hover:text-paper">
                    {PERSON.email}
                  </EmailLink>
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/45">
                  Location
                </dt>
                <dd className="mt-2 text-base sm:text-lg text-paper/85">
                  {PERSON.location}
                </dd>
              </div>
            </dl>

            <div className="mt-10 flex items-center gap-4">
              {SOCIALS.map((social) => {
                const Icon = ICONS[social.label];
                const className =
                  "flex h-10 w-10 items-center justify-center rounded-full border border-paper/15 text-paper/60 transition-colors duration-300 hover:border-paper/40 hover:text-paper";
                if (social.href.startsWith("mailto:")) {
                  return (
                    <EmailLink key={social.label} aria-label={social.label} className={className}>
                      {Icon && <Icon className="h-4 w-4" />}
                    </EmailLink>
                  );
                }
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={className}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                  </a>
                );
              })}
            </div>
          </ScrollReveal>

          {/* No parallax on the form — fields shouldn't drift while you type */}
          <ScrollReveal delay={0.1} className="lg:col-span-7">
            <ContactForm />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
