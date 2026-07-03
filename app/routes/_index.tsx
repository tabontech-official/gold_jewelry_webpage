import {
  Await,
  useLoaderData,
  Link,
} from 'react-router';
import type {Route} from './+types/_index';
import {Suspense} from 'react';
import {Image} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {ProductItem} from '~/components/ProductItem';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Fine Jewelry & Watches | Gold Jewelry Co.'}];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: Route.LoaderArgs) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    featuredCollection: collections.nodes[0],
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error: Error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      <Hero />
      <FeatureStrip />
      <ShopByCategory />
      <FeaturedCollection collection={data.featuredCollection} />
      <RecommendedProducts products={data.recommendedProducts} />
      <FeatureStrip />
      <Showroom />
      <SocialStrip />
    </div>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-inner">
        <span className="eyebrow hero-eyebrow">Summer Event</span>
        <h1>Up to 45% Off Fine Jewelry</h1>
        <p>
          Solid gold chains, diamond pendants, and luxury watches &mdash;
          crafted for every moment that matters. Use code JULY15 at checkout.
        </p>
        <div className="hero-ctas">
          <Link to="/collections/mens" className="btn btn-primary">
            Shop Men&rsquo;s
          </Link>
          <Link to="/collections/womens" className="btn btn-outline">
            Shop Women&rsquo;s
          </Link>
        </div>
      </div>
    </section>
  );
}

const FEATURES = [
  {icon: '✦', label: 'Lifetime Warranty'},
  {icon: '⤴', label: 'Lifetime Upgrade'},
  {icon: '🚚', label: 'Free Shipping & Returns'},
  {icon: '%', label: '0% APR Financing'},
];

function FeatureStrip() {
  return (
    <div className="feature-strip">
      {FEATURES.map((feature) => (
        <div className="feature-strip-item" key={feature.label}>
          <span className="feature-strip-icon" aria-hidden="true">
            {feature.icon}
          </span>
          <span>{feature.label}</span>
        </div>
      ))}
    </div>
  );
}

const CATEGORIES = [
  {label: 'Rings', handle: 'rings'},
  {label: 'Chains', handle: 'chains'},
  {label: 'Bracelets', handle: 'bracelets'},
  {label: 'Earrings', handle: 'earrings'},
  {label: 'Pendants', handle: 'pendants'},
  {label: 'Necklaces', handle: 'necklaces'},
  {label: 'Diamond', handle: 'diamond'},
  {label: 'Engagement', handle: 'engagement-rings'},
];

function ShopByCategory() {
  return (
    <section className="home-section">
      <div className="section-inner">
        <div className="home-section-heading">
          <span className="eyebrow">Explore</span>
          <h2>Shop by Category</h2>
        </div>
        <div className="category-grid">
          {CATEGORIES.map((category) => (
            <Link
              key={category.handle}
              to={`/collections/${category.handle}`}
              className="category-tile"
            >
              <span className="category-tile-circle" aria-hidden="true">
                {category.label.charAt(0)}
              </span>
              <span>{category.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <section className="home-section is-soft">
      <div className="section-inner">
        <div className="home-section-heading">
          <span className="eyebrow">Curated</span>
          <h2>Featured Collection</h2>
        </div>
        <Link
          className="featured-collection"
          to={`/collections/${collection.handle}`}
        >
          <div className="featured-collection-image">
            {image && <Image data={image} sizes="100vw" />}
          </div>
          <div className="featured-collection-caption">
            <h2>{collection.title}</h2>
          </div>
        </Link>
      </div>
    </section>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <section className="home-section">
      <div className="section-inner">
        <div className="home-section-heading">
          <span className="eyebrow">Best Sellers</span>
          <h2>New Arrivals</h2>
        </div>
        <Suspense fallback={<p>Loading...</p>}>
          <Await resolve={products}>
            {(response) => (
              <div className="recommended-products-grid">
                {response
                  ? response.products.nodes.map((product) => (
                      <ProductItem
                        key={product.id}
                        product={product}
                        className="recommended-product"
                      />
                    ))
                  : null}
              </div>
            )}
          </Await>
        </Suspense>
        <div className="home-section-footer">
          <Link to="/collections/all" className="btn btn-outline">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}

function Showroom() {
  return (
    <section className="showroom" id="showroom">
      <div className="showroom-inner">
        <span className="eyebrow" style={{color: 'var(--color-gold)'}}>
          Visit Us
        </span>
        <h2>Where Luxury Comes to Life</h2>
        <p>
          Visit our exclusive NYC showroom and discover our stunning
          collection in person, with a personal stylist by your side.
        </p>
        <p className="showroom-address">
          10 W 46th St, Floor 17, New York, NY 10036
        </p>
        <a href="mailto:info@bayamjewelry.com" className="btn btn-primary on-dark">
          Book an Appointment
        </a>
      </div>
    </section>
  );
}

function SocialStrip() {
  return (
    <section className="home-section social-strip">
      <div className="section-inner">
        <span className="eyebrow">@yourjewelry</span>
        <h2>Follow Us on Instagram</h2>
        <div className="social-strip-icons">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
            IG
          </a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
            FB
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok">
            TT
          </a>
        </div>
      </div>
    </section>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
