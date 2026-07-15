import {useEffect} from 'react';

const ELFSIGHT_SCRIPT_ID = 'elfsight-platform-script';
const ELFSIGHT_SCRIPT_SRC = 'https://elfsightcdn.com/platform.js';
const ELFSIGHT_WIDGET_ID = 'elfsight-app-40ff83f5-944e-4864-91a0-16bd2dddc311';

export function GoogleReviewsSection() {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const existingScript = document.getElementById(
      ELFSIGHT_SCRIPT_ID,
    ) as HTMLScriptElement | null;

    if (existingScript) return;

    const script = document.createElement('script');
    script.id = ELFSIGHT_SCRIPT_ID;
    script.src = ELFSIGHT_SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const section = document.querySelector('.google-reviews-section');
    if (!section) return;

    const applyReviewLayout = () => {
      section.querySelectorAll<HTMLElement>('*').forEach((element) => {
        const text = element.textContent?.trim();
        if (text === 'Google Reviews' || text === 'What Our Customers Say') {
          element.classList.add('google-reviews-hidden-heading');
        }
      });
    };

    applyReviewLayout();

    const observer = new MutationObserver(applyReviewLayout);
    observer.observe(section, {childList: true, subtree: true});

    return () => observer.disconnect();
  }, []);

  return (
    <section className="home-section google-reviews-section">
      <div className="section-inner">
        <div className="google-reviews-stage" aria-label="Google reviews grid">
          <div
            className={ELFSIGHT_WIDGET_ID}
            data-elfsight-app-lazy=""
            aria-live="polite"
          />
        </div>
      </div>
    </section>
  );
}
