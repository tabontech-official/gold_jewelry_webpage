import {Suspense} from 'react';
import {Await, Link, NavLink, useFetcher} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  const newsletter = useFetcher<{success?: boolean; error?: string}>();
  const newsletterBusy = newsletter.state !== 'idle';

  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="footer">
            <div className="footer-main">
              <div className="footer-left">
                <div className="footer-brand">Join the Gold Custom Club</div>
                <p>Subscribe for new drops, private offers, and jewelry care notes.</p>
                <newsletter.Form
                  action="/api/subscribe"
                  className="footer-newsletter"
                  method="post"
                >
                  <label className="visually-hidden" htmlFor="footer-email">
                    Email address
                  </label>
                  <input
                    id="footer-email"
                    name="email"
                    placeholder="Email"
                    required
                    type="email"
                  />
                  <button disabled={newsletterBusy} type="submit">
                    {newsletterBusy ? 'Joining' : 'Subscribe'}
                    <span aria-hidden="true">-&gt;</span>
                  </button>
                </newsletter.Form>
                {newsletter.data?.success ? (
                  <p className="footer-newsletter-note">You are in. Welcome to the club.</p>
                ) : (
                  <p className="footer-newsletter-note">
                    By joining, you agree to receive occasional Gold Custom emails.
                  </p>
                )}
                {newsletter.data?.error ? (
                  <p className="footer-newsletter-error">{newsletter.data.error}</p>
                ) : null}
                <div className="footer-social">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                  >
                    <InstagramIcon />
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook"
                  >
                    <FacebookIcon />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="YouTube"
                  >
                    <YoutubeIcon />
                  </a>
                  <a
                    href="https://tiktok.com"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="TikTok"
                  >
                    <TikTokIcon />
                  </a>
                </div>
                {/* quick-shop links removed from here to avoid duplication; kept in Shop column */}
              </div>

              <div className="footer-mid">
                <div className="footer-col">
                  <h4>Shop</h4>
                  <ul>
                    <li>
                      <Link to="/collections/diamond">Diamond & Engagement</Link>
                    </li>
                    <li>
                      <Link to="/collections/chains">Chains</Link>
                    </li>
                    <li>
                      <Link to="/collections/rings">Rings</Link>
                    </li>
                    <li>
                      <Link to="/collections/bracelets">Bracelets</Link>
                    </li>
                    <li>
                      <Link to="/collections/earrings">Earrings</Link>
                    </li>
                    <li>
                      <Link to="/collections/shop-all">Shop All</Link>
                    </li>
                  </ul>
                </div>

                <div className="footer-col">
                  <h4>Customers</h4>
                  <ul>
                    <li>
                      <Link to="/search">Search</Link>
                    </li>
                    <li>
                      <Link to="/policies/privacy-policy">Your Privacy Choices</Link>
                    </li>
                    <li>
                      <Link to="/faq">FAQ</Link>
                    </li>
                    <li>
                      <Link to="/contact">Contact Us</Link>
                    </li>
                    <li>
                      <Link to="/blogs">Blog</Link>
                    </li>
                  </ul>
                </div>

                <div className="footer-col footer-contact-col">
                  <h4>Stay Connected</h4>
                  <div className="footer-contact-grid">
                    <div>
                      <span className="footer-contact-label">Contact</span>
                      <ul>
                        <li>
                          <a href="tel:+13236888837">+1 (323) 688-8837</a>
                        </li>
                        <li>
                          <a href="mailto:mr10k@goldcustom.com">
                            mr10k@goldcustom.com
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <span className="footer-contact-label">Location</span>
                      <ul>
                        <li>
                          <a
                            href="https://maps.app.goo.gl/252CwsjSZfhSae4B6"
                            target="_blank"
                            rel="noreferrer"
                          >
                            550 S Hill Street Suite 660, Los Angeles, CA
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://maps.app.goo.gl/252CwsjSZfhSae4B6"
                            target="_blank"
                            rel="noreferrer"
                          >
                            90013
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Giant wordmark, Cadence-style */}
            <div className="footer-wordmark" aria-hidden="true">
              {header.shop.name}
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
      />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.87.24-1.46 1.49-1.46h1.61V4.95c-.28-.04-1.23-.12-2.33-.12-2.3 0-3.87 1.4-3.87 3.98V11H8v3h2.4v7h3.1Z"
        fill="currentColor"
      />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.28 5 12 5 12 5s-6.28 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.72 19 12 19 12 19s6.28 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15.2V8.8L15.6 12 10 15.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-2.59-2.59c.27 0 .53.04.78.12v-3.16a5.76 5.76 0 1 0 4.9 5.63V9.66a7.35 7.35 0 0 0 4.3 1.38V7.95a4.3 4.3 0 0 1-3.24-2.13Z"
        fill="currentColor"
      />
    </svg>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  return (
    <nav className="footer-menu" role="navigation">
      {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
        if (!item.url) return null;
        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <a href={url} key={item.id} rel="noopener noreferrer" target="_blank">
            {item.title}
          </a>
        ) : (
          <NavLink
            end
            key={item.id}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : undefined,
  };
}
