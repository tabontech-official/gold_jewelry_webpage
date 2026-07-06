import {Suspense} from 'react';
import {
  redirect,
  useLoaderData,
  useNavigate,
  Await,
} from 'react-router';
import type {Route} from './+types/products.$handle';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductGallery, type GalleryMedia} from '~/components/ProductGallery';
import {ProductForm} from '~/components/ProductForm';
import {FeatureStrip} from '~/components/FeatureStrip';
import {ProductSlider} from '~/components/ProductSlider';
import {ShopByCategory} from '~/components/ShopByCategory';
import {Breadcrumb} from '~/components/Breadcrumb';
import {CATEGORIES} from '~/lib/categories';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

export const meta: Route.MetaFunction = ({data}) => {
  return [
    {title: `Hydrogen | ${data?.product.title ?? ''}`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  // Sibling "length" articles (deferred — never blocks the page).
  const lengthArticles = loadLengthArticles(args.context, criticalData.product);

  return {...deferredData, ...criticalData, lengthArticles};
}

/**
 * Many chains/necklaces exist as separate products per length (16", 18" …).
 * Find those siblings by matching every product whose title is identical once
 * the length is stripped out, so the shopper can jump straight to any length.
 */
function parseLength(text: string) {
  // Matches "16 Inches", "26-Inches", "22 Inch", "26in", "18\"", "18”" etc.
  const match = text.match(
    /(\d+(?:\.\d+)?)\s*-?\s*(?:inch(?:es)?\b|in\b|["”″])/i,
  );
  if (!match) return null;
  const length = parseFloat(match[1]);
  const baseKey = text
    .replace(match[0], ' ')
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return {length, baseKey};
}

type LengthArticles = {
  current: number;
  options: Array<{handle: string; length: number}>;
};

function loadLengthArticles(
  context: Route.LoaderArgs['context'],
  product: {title: string; handle: string},
): Promise<LengthArticles | null> {
  const info = parseLength(product.title);
  if (!info) return Promise.resolve(null);

  return context.storefront
    .query(SIBLING_PRODUCTS_QUERY, {variables: {query: info.baseKey}})
    .then((res: any) => {
      const nodes: Array<{handle: string; title: string}> =
        res?.products?.nodes ?? [];
      const seen = new Set<number>();
      const options = nodes
        .map((node) => {
          const parsed = parseLength(node.title);
          if (!parsed || parsed.baseKey !== info.baseKey) return null;
          if (seen.has(parsed.length)) return null;
          seen.add(parsed.length);
          return {handle: node.handle, length: parsed.length};
        })
        .filter((item): item is {handle: string; length: number} => item !== null)
        .sort((a, b) => a.length - b.length);

      return options.length > 1 ? {current: info.length, options} : null;
    })
    .catch(() => null);
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({
  context,
  params,
  request,
}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {
    product,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context, params}: Route.LoaderArgs) {
  // Related products — fetched after first paint so they never block the page.
  const recommendedProducts = context.storefront
    .query(PRODUCT_RECOMMENDATIONS_QUERY, {
      variables: {productHandle: params.handle},
    })
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  return {recommendedProducts};
}

export default function Product() {
  const {product, recommendedProducts, lengthArticles} =
    useLoaderData<typeof loader>();

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml, vendor} = product;
  const mediaItems = normalizeMedia(product.media?.nodes ?? [], title);
  const rawCategory = product.category?.name || product.productType || '';
  const categoryName =
    rawCategory && rawCategory.toLowerCase() !== 'uncategorized'
      ? rawCategory
      : '';
  const sku = selectedVariant?.sku?.trim();

  // Resolve the category to a shoppable collection so the crumb is clickable.
  // Shopify taxonomy names look like "Necklaces in Jewelry", so we match on
  // containment as well as exact label/handle.
  const categoryMatch = categoryName
    ? CATEGORIES.find((c) => {
        const name = categoryName.toLowerCase();
        const label = c.label.toLowerCase();
        return (
          name === label ||
          name === c.handle ||
          name.includes(label) ||
          name.includes(c.handle)
        );
      })
    : undefined;

  const breadcrumbs = [
    {label: 'Home', to: '/'},
    {label: 'Shop', to: '/collections/all'},
    ...(categoryName
      ? [
          {
            label: categoryMatch?.label ?? categoryName,
            to: categoryMatch
              ? `/collections/${categoryMatch.handle}`
              : undefined,
          },
        ]
      : []),
    {label: title},
  ];

  return (
    <div className="product">
      <Breadcrumb items={breadcrumbs} />

      <div className="product-layout">
        <ProductGallery
          media={mediaItems}
          selectedImageUrl={selectedVariant?.image?.url}
          title={title}
        />

        <div className="product-main">
          {categoryName && (
            <span className="eyebrow product-vendor">{categoryName}</span>
          )}
          <h1>{title}</h1>
          <div className="product-meta">
            {vendor && <span className="product-meta-item">{vendor}</span>}
            {sku && <span className="product-meta-item">SKU: {sku}</span>}
          </div>
          <ProductPrice
            price={selectedVariant?.price}
            compareAtPrice={selectedVariant?.compareAtPrice}
          />

          <Suspense fallback={null}>
            <Await resolve={lengthArticles}>
              {(data) => <LengthArticleSelect data={data} />}
            </Await>
          </Suspense>

          <ProductForm
            productOptions={productOptions}
            selectedVariant={selectedVariant}
          />

          <ul className="product-assurances">
            <li>Free U.S. shipping over $99</li>
            <li>1-year warranty</li>
            <li>14-day returns</li>
          </ul>

          {descriptionHtml && (
            <div className="product-description">
              <h2 className="product-description-heading">Description</h2>
              <div
                className="product-details-body"
                dangerouslySetInnerHTML={{__html: descriptionHtml}}
              />
            </div>
          )}
        </div>
      </div>

      <RelatedProducts products={recommendedProducts} />

      <ShopByCategory />

      <FeatureStrip />

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

function LengthArticleSelect({data}: {data: LengthArticles | null}) {
  const navigate = useNavigate();
  if (!data || data.options.length < 2) return null;

  return (
    <div className="product-options">
      <label className="product-options-label" htmlFor="length-articles">
        Length
      </label>
      <div className="product-select-wrap">
        <select
          id="length-articles"
          className="product-select"
          value={String(data.current)}
          onChange={(event) => {
            const target = data.options.find(
              (option) => String(option.length) === event.target.value,
            );
            if (target) void navigate(`/products/${target.handle}`);
          }}
        >
          {data.options.map((option) => (
            <option key={option.handle} value={String(option.length)}>
              {option.length}&quot;
            </option>
          ))}
        </select>
        <span className="product-select-caret" aria-hidden="true">
          ▾
        </span>
      </div>
    </div>
  );
}

function RelatedProducts({
  products,
}: {
  products: Promise<{productRecommendations: any[]} | null>;
}) {
  return (
    <section className="home-section">
      <div className="section-inner">
        <div className="home-section-heading">
          <span className="eyebrow">You may also like</span>
          <h2>Related Products</h2>
        </div>
        <Suspense fallback={null}>
          <Await resolve={products}>
            {(data) => {
              const items = (data?.productRecommendations ?? []).slice(0, 8);
              if (!items.length) return null;
              return (
                <ProductSlider
                  eyebrow="You may also like"
                  heading="Related Products"
                  products={items}
                  showHeading={false}
                  showArrows
                />
              );
            }}
          </Await>
        </Suspense>
      </div>
    </section>
  );
}

/** Normalize the Storefront `media` union into the gallery's flat item shape. */
function normalizeMedia(nodes: any[], title: string): GalleryMedia[] {
  return nodes
    .map((node): GalleryMedia | null => {
      const base = {
        key: node.id ?? node.previewImage?.url ?? '',
        thumbUrl: node.previewImage?.url ?? node.image?.url ?? null,
        alt: node.alt ?? title,
      };
      switch (node.__typename) {
        case 'MediaImage':
          if (!node.image?.url) return null;
          return {...base, kind: 'image', image: node.image};
        case 'Video':
          if (!node.sources?.length) return null;
          return {...base, kind: 'video', sources: node.sources};
        case 'ExternalVideo':
          if (!node.embedUrl) return null;
          return {...base, kind: 'external', embedUrl: node.embedUrl};
        default:
          return null;
      }
    })
    .filter((item): item is GalleryMedia => item !== null);
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    productType
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    category {
      name
    }
    media(first: 25) {
      nodes {
        __typename
        id
        alt
        mediaContentType
        previewImage {
          url
        }
        ... on MediaImage {
          image {
            id
            url
            altText
            width
            height
          }
        }
        ... on Video {
          sources {
            url
            mimeType
          }
        }
        ... on ExternalVideo {
          embedUrl
        }
      }
    }
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const SIBLING_PRODUCTS_QUERY = `#graphql
  query SiblingProducts(
    $query: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: 100, query: $query) {
      nodes {
        handle
        title
      }
    }
  }
` as const;

const PRODUCT_RECOMMENDATIONS_QUERY = `#graphql
  fragment RecommendedItem on Product {
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
    selectedOrFirstAvailableVariant {
      id
      availableForSale
    }
  }
  query ProductRecommendations(
    $productHandle: String
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    productRecommendations(productHandle: $productHandle) {
      ...RecommendedItem
    }
  }
` as const;
