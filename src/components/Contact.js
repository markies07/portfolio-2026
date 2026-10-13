import { PERSON, SOCIALS } from "@/lib/content";
import ScrollReveal from "./ScrollReveal";
import ContactForm from "./ContactForm";
import { GithubIcon, FacebookIcon, MailIcon } from "./SocialIcons";

const ICONS = {
  GitHub: GithubIcon,
  Facebook: FacebookIcon,
  Email: MailIcon,
};

export default function Contact() {
  return (
    <section id="contact" className="relative bg-ink py-32 sm:py-44 lg:py-56">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-16">
        <p className="font-mono text-xs sm:text-sm tracking-[0.25em] uppercase text-paper/50">
          Contact
        </p>

        <ScrollReveal variant="mask" className="mt-6">
          <h2 className="font-display font-semibold uppercase leading-[0.92] tracking-tight text-[clamp(2.5rem,8vw,7rem)]">
            Start a Conversation
          </h2>
        </ScrollReveal>

        <div className="mt-16 sm:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20">
          <ScrollReveal>
            <p className="max-w-md text-lg sm:text-xl leading-relaxed text-paper/70">
              Have a project in mind? I&apos;d love to hear about your ideas
              and help bring them to life.
            </p>

            <dl className="mt-12 flex flex-col gap-8">
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/45">
                  Email
                </dt>
                <dd className="mt-2">
                  <a
                    href={`mailto:${PERSON.email}`}
                    className="text-base sm:text-lg text-paper/85 transition-colors duration-300 hover:text-paper"
                  >
                    {PERSON.email}
                  </a>
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
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith("http") ? "_blank" : undefined}
                    rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/15 text-paper/60 transition-colors duration-300 hover:border-paper/40 hover:text-paper"
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                  </a>
                );
              })}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1} className="lg:flex lg:flex-col lg:justify-start">
            <ContactForm />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
