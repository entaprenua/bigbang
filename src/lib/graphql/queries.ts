import {
  PRODUCT_BASIC_FIELDS, PRODUCT_DETAIL_FIELDS, CATEGORY_FIELDS, CART_FIELDS,
  HERO_FIELDS, ORDER_FIELDS, REVIEW_FIELDS,
  REVIEW_STATS_FIELDS, WISHLIST_FIELDS, STORE_FIELDS,
} from "./fragments"

// ─── Store ───────────────────────────────────────────────────

export const STORE_QUERY = `
  ${STORE_FIELDS}
  query Store {
    store {
      ...StoreFields
    }
  }
`



// ─── Products ───────────────────────────────────────────────

export const PRODUCT_BY_SLUG = `
  ${PRODUCT_BASIC_FIELDS}
  ${PRODUCT_DETAIL_FIELDS}
  query ProductBySlug($slug: String!) {
    product(slug: $slug) {
      ...ProductDetailFields
    }
  }
`

export const PRODUCT_BY_ID = `
  ${PRODUCT_BASIC_FIELDS}
  ${PRODUCT_DETAIL_FIELDS}
  query ProductById($id: String!) {
    product(id: $id) {
      ...ProductDetailFields
    }
  }
`

// TODO: Switch back to PRODUCT_BASIC_FIELDS once listing UI no longer needs detail fields
export const PRODUCTS_QUERY = `
  ${PRODUCT_BASIC_FIELDS}
  ${PRODUCT_DETAIL_FIELDS}
  query Products(
    $filters: ProductFiltersInput
    $after: String
    $before: String
    $size: Int
  ) {
    products(filters: $filters, after: $after, before: $before, size: $size) {
      edges {
        node { ...ProductDetailFields }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
        startCursor
      }
      totalCount
    }
  }
`

// ─── Categories ─────────────────────────────────────────────

export const CATEGORIES_QUERY = `
  ${CATEGORY_FIELDS}
  query Categories($filters: CategoryFiltersInput) {
    categories(filters: $filters) {
      ...CategoryFields
    }
  }
`

export const CATEGORY_QUERY = `
  ${CATEGORY_FIELDS}
  query Category($id: String, $slug: String) {
    category(id: $id, slug: $slug) {
      ...CategoryFields
    }
  }
`

// ─── Cart ───────────────────────────────────────────────────

export const CART_QUERY = `
  ${CART_FIELDS}
  query Cart($cartId: String) {
    cart(cartId: $cartId) {
      ...CartFields
    }
  }
`

export const CART_ITEM_MUTATION = `
  mutation CartItem($itemId: String, $productId: String, $quantity: Int, $selected: Boolean, $metadata: String) {
    cartItem(input: { itemId: $itemId, productId: $productId, quantity: $quantity, selected: $selected, metadata: $metadata }) {
      id
      productId
      quantity
      selected
      price
      subtotal
      product {
        id
        parentId 
        name
        image
        slug
        options
      }
    }
  }
`

export const REMOVE_CART_ITEM_MUTATION = `
  mutation RemoveCartItem($itemId: String!) {
    removeCartItem(itemId: $itemId)
  }
`

export const CLEAR_CART_MUTATION = `
  mutation ClearCart {
    clearCart
  }
`

export const CLEAR_SELECTED_CART_ITEMS_MUTATION = `
  mutation ClearSelectedCartItems {
    clearSelectedCartItems
  }
`

// ─── Wishlist ───────────────────────────────────────────────

export const WISHLIST_QUERY = `
  ${WISHLIST_FIELDS}
  query Wishlist {
    wishlist {
      ...WishlistFields
    }
  }
`

export const ADD_TO_WISHLIST_MUTATION = `
  mutation AddToWishlist($input: WishlistInput!) {
    addToWishlist(input: $input)
  }
`

export const REMOVE_FROM_WISHLIST_MUTATION = `
  mutation RemoveFromWishlist($wishlistId: String!) {
    removeFromWishlist(wishlistId: $wishlistId)
  }
`

// ─── Heroes ─────────────────────────────────────────────────

export const HERO_QUERY = `
  ${HERO_FIELDS}
  query Hero {
    hero {
      ...HeroFields
    }
  }
`

// ─── Recommendations ────────────────────────────────────────

// TODO: Switch back to PRODUCT_BASIC_FIELDS once recommendations UI no longer needs detail fields
export const RECOMMENDATIONS_QUERY = `
  ${PRODUCT_BASIC_FIELDS}
  ${PRODUCT_DETAIL_FIELDS}
  query Recommendations($input: RecommendationsInput) {
    recommendations(input: $input) {
      products { ...ProductDetailFields }
      source
      fallback
    }
  }
`

// ─── Product Suggestions ──────────────────────────────────────

export const PRODUCT_SUGGESTIONS_QUERY = `
  query ProductSuggestions($query: String!, $limit: Int) {
    productSuggestions(query: $query, limit: $limit)
  }
`

// ─── Product Filter Options ──────────────────────────────────

export const PRODUCT_FILTER_OPTIONS_QUERY = `
  query ProductFilterOptions($fields: [String!]!) {
    productFilterOptions(fields: $fields) {
      brands
      vendors
      productTypes
    }
  }
`

export const TRACK_PRODUCT_VIEW_MUTATION = `
  mutation TrackProductView($productId: String!, $sessionId: String) {
    trackProductView(productId: $productId, sessionId: $sessionId)
  }
`

export const ADD_FAVORITE_MUTATION = `
  mutation AddFavorite($productId: String!) {
    addFavorite(productId: $productId)
  }
`

export const REMOVE_FAVORITE_MUTATION = `
  mutation RemoveFavorite($productId: String!) {
    removeFavorite(productId: $productId)
  }
`

// ─── Reviews ────────────────────────────────────────────────

export const REVIEWS_BY_PRODUCT_QUERY = `
  ${REVIEW_FIELDS}
  query ReviewsByProduct($productId: String!, $page: Int, $size: Int, $sortBy: String) {
    product(id: $productId) {
      reviews(page: $page, size: $size, sortBy: $sortBy) {
        edges {
          node { ...ReviewFields }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }
        totalCount
      }
    }
  }
`

export const REVIEW_STATS_QUERY = `
  ${REVIEW_STATS_FIELDS}
  query ReviewStats($productId: String!) {
    product(id: $productId) {
      reviewStats {
        ...ReviewStatsFields
      }
    }
  }
`

export const CREATE_REVIEW_MUTATION = `
  ${REVIEW_FIELDS}
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      ...ReviewFields
    }
  }
`

export const UPDATE_REVIEW_MUTATION = `
  ${REVIEW_FIELDS}
  mutation UpdateReview($input: UpdateReviewInput!) {
    updateReview(input: $input) {
      ...ReviewFields
    }
  }
`

export const DELETE_REVIEW_MUTATION = `
  mutation DeleteReview($productId: String!, $reviewId: String!) {
    deleteReview(productId: $productId, reviewId: $reviewId)
  }
`

// ─── Orders ─────────────────────────────────────────────────

export const ORDER_QUERY = `
  ${ORDER_FIELDS}
  query Order($id: String!) {
    order(id: $id) {
      ...OrderFields
    }
  }
`

export const CHECKOUT_MUTATION = `
  mutation Checkout($input: CheckoutInput!) {
    checkout(input: $input) {
      success
      status
      orderId
      orderNumber
      total
      currency
      paymentMethod
      paymentId
    }
  }
`

export const CONFIRM_PAYMENT_MUTATION = `
  mutation ConfirmPayment($input: PaymentConfirmationInput!) {
    confirmPayment(input: $input) {
      success
      paymentId
      status
      orderId
    }
  }
`

export const ORDER_LOOKUP_QUERY = `
  ${ORDER_FIELDS}
  query OrderLookup($storeId: String!, $orderNumber: String!, $email: String!) {
    orderLookup(storeId: $storeId, orderNumber: $orderNumber, email: $email) {
      found
      order {
        ...OrderFields
      }
    }
  }
`

// ─── Notifications ──────────────────────────────────────────

export const NOTIFICATION_TEMPLATES_QUERY = `
  query NotificationTemplates($eventType: String) {
    notificationTemplates(eventType: $eventType) {
      eventType
      channel
      subject
      bodyHtml
      bodyText
      isActive
      isDefault
    }
  }
`

// ─── Settings ───────────────────────────────────────────────

export const STORE_SETTINGS_QUERY = `
  query StoreSettings($sel: String) {
    storeSettings {
      contact
      social
      about
      email
    }
  }
`



