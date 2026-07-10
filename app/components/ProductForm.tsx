import {useState} from 'react';
import {useNavigate, Link} from 'react-router';
import {type MappedProductOptions} from '@shopify/hydrogen';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import type {ProductFragment} from 'storefrontapi.generated';

export function ProductForm({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const navigate = useNavigate();
  const {open} = useAside();
  const [quantity, setQuantity] = useState(1);
  const maxQuantity = 99;

  return (
    <div className="product-form">
      {productOptions.map((option) => {
        // Don't render a picker for an option that has only one value.
        if (option.optionValues.length === 1) return null;

        return (
          <div className="product-options" key={option.name}>
            <span
              className="product-options-label"
              id={`option-label-${option.name}`}
            >
              {option.name}
            </span>
            <div
              className="variant-tags"
              role="group"
              aria-labelledby={`option-label-${option.name}`}
            >
              {option.optionValues.map((value) => (
                <button
                  key={option.name + value.name}
                  type="button"
                  className={`variant-tag${value.selected ? ' is-selected' : ''}${
                    !value.available ? ' is-unavailable' : ''
                  }`}
                  aria-pressed={value.selected}
                  disabled={!value.exists && !value.isDifferentProduct}
                  onClick={() => {
                    if (value.selected) return;

                    // A value that maps to a different product (combined
                    // listing) takes the shopper straight to that product
                    // page; otherwise we just update the variant search
                    // param in place.
                    if (value.isDifferentProduct) {
                      void navigate(
                        `/products/${value.handle}?${value.variantUriQuery}`,
                        {preventScrollReset: true},
                      );
                    } else {
                      void navigate(`?${value.variantUriQuery}`, {
                        replace: true,
                        preventScrollReset: true,
                      });
                    }
                  }}
                >
                  {value.name}
                </button>
              ))}
            </div>
          </div>
        );
      })}

      <div className="product-purchase-grid">
        <div className="product-purchase-row">
          <div className="product-quantity-block">
            <span className="product-quantity-label">Quantity</span>
            <div
              className="product-quantity-stepper"
              aria-label="Product quantity"
            >
              <button
                type="button"
                className="product-quantity-btn"
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                disabled={!selectedVariant || quantity <= 1}
                aria-label="Decrease quantity"
              >
                &minus;
              </button>
              <span className="product-quantity-value">{quantity}</span>
              <button
                type="button"
                className="product-quantity-btn"
                onClick={() =>
                  setQuantity((current) => Math.min(maxQuantity, current + 1))
                }
                disabled={!selectedVariant || quantity >= maxQuantity}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <AddToCartButton
            className="btn btn-primary product-atc product-purchase-action"
            disabled={!selectedVariant || !selectedVariant.availableForSale}
            onClick={() => {
              open('cart');
            }}
            lines={
              selectedVariant
                ? [
                    {
                      merchandiseId: selectedVariant.id,
                      quantity,
                      selectedVariant,
                    },
                  ]
                : []
            }
          >
            {selectedVariant?.availableForSale ? 'Add to Bag' : 'Sold Out'}
          </AddToCartButton>
        </div>
      </div>

      <p className="product-finance-note">
        <Link to="/policies/finance">Flexible payment plans</Link> and
        installment options are available before checkout.
      </p>
    </div>
  );
}
