import { Button } from "@/components/ui/button";
import { constants } from "@/constants";
import { InstagramIcon } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "Testimonials", href: "#testimonials" },
        { name: "FAQ", href: "#faq" },
      ],
    },
  ];

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Brand and socials */}
          <div>
            <Link
              href="/"
              className="inline-block mb-4"
            >
              <h3 className="text-2xl font-bold">{constants.APP_TITLE}</h3>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              AI-powered tools to help you land your dream job faster and with less stress.
            </p>

            <div className="flex gap-4">
              <Button
                variant="ghost"
                size="icon"
                asChild
              >
                <Link
                  href="https://instagram.com/applyninja.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <InstagramIcon className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section, i) => (
            <div key={i}>
              <h4 className="font-medium mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} {constants.APP_TITLE}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4 mt-4 md:mt-0 justify-center">
            <Link
              href="/privacy-policy"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookie-policy"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Cookie Policy
            </Link>
            <Link
              href="mailto:support@applyninja.ai"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              support@applyninja.ai
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
