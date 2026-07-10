import type {Route} from './+types/api.subscribe';

// Newsletter signup: creates a customer with marketing consent via the
// Storefront API. Used by the welcome popup and the footer form.
export async function action({request, context}: Route.ActionArgs) {
  const form = await request.formData();
  const email = String(form.get('email') ?? '').trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {error: 'Please enter a valid email address.'};
  }

  try {
    const {customerCreate} = await context.storefront.mutate(
      SUBSCRIBE_MUTATION,
      {
        variables: {
          input: {
            email,
            // ponytail: throwaway password — this store uses passwordless
            // customer accounts; the record only carries marketing consent.
            password: crypto.randomUUID(),
            acceptsMarketing: true,
          },
        },
      },
    );

    const error = customerCreate?.customerUserErrors?.[0];
    // TAKEN = customer already exists, which means they're already on file.
    if (error && error.code !== 'TAKEN') {
      return {error: error.message};
    }
    return {success: true};
  } catch (error) {
    console.error(error);
    return {error: 'Something went wrong. Please try again.'};
  }
}

const SUBSCRIBE_MUTATION = `#graphql
  mutation NewsletterSubscribe($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
      }
      customerUserErrors {
        code
        message
      }
    }
  }
` as const;
