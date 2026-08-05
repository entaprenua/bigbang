export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AppliesToTypeGraphQl =
  | 'ALL'
  | 'CATEGORIES'
  | 'PRODUCTS';

export type Cart = {
  __typename?: 'Cart';
  cartToken?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  items: Array<CartItem>;
  subtotal?: Maybe<Scalars['String']['output']>;
  total?: Maybe<Scalars['String']['output']>;
};

export type CartItem = {
  __typename?: 'CartItem';
  id: Scalars['String']['output'];
  metadata?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['String']['output']>;
  product?: Maybe<Product>;
  productId: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  selected: Scalars['Boolean']['output'];
  subtotal?: Maybe<Scalars['String']['output']>;
};

export type CartItemInput = {
  itemId?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['String']['input']>;
  productId?: InputMaybe<Scalars['String']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  selected?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Category = {
  __typename?: 'Category';
  children: CategoryConnection;
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  level: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  parentId?: Maybe<Scalars['String']['output']>;
  path?: Maybe<Scalars['String']['output']>;
  products: ProductConnection;
  slug?: Maybe<Scalars['String']['output']>;
  visibility?: Maybe<Scalars['String']['output']>;
};


export type CategoryChildrenArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type CategoryProductsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type CategoryAddChildrenInput = {
  categoryId: Scalars['String']['input'];
  childIds: Array<Scalars['String']['input']>;
};

export type CategoryAddProductsInput = {
  categoryId: Scalars['String']['input'];
  productIds: Array<Scalars['String']['input']>;
};

export type CategoryConnection = {
  __typename?: 'CategoryConnection';
  edges: Array<CategoryEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type CategoryEdge = {
  __typename?: 'CategoryEdge';
  cursor: Scalars['String']['output'];
  node: Category;
};

export type CategoryFiltersInput = {
  level?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['String']['input']>;
  root?: InputMaybe<Scalars['Boolean']['input']>;
  tree?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CategoryRemoveChildrenInput = {
  categoryId: Scalars['String']['input'];
  childIds: Array<Scalars['String']['input']>;
};

export type CategoryRemoveProductsInput = {
  categoryId: Scalars['String']['input'];
  productIds: Array<Scalars['String']['input']>;
};

export type CheckoutInput = {
  billingAddress?: InputMaybe<Scalars['String']['input']>;
  currency: Scalars['String']['input'];
  customerEmail?: InputMaybe<Scalars['String']['input']>;
  deliveryLocation?: InputMaybe<Scalars['String']['input']>;
  deliveryMethod?: InputMaybe<Scalars['String']['input']>;
  deliveryZone?: InputMaybe<Scalars['String']['input']>;
  discount?: InputMaybe<Scalars['String']['input']>;
  guestEmail?: InputMaybe<Scalars['String']['input']>;
  items: Array<CheckoutItemInput>;
  name?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  paymentPhone?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  provider: Scalars['String']['input'];
  shippingAddress?: InputMaybe<Scalars['String']['input']>;
  shippingCost?: InputMaybe<Scalars['String']['input']>;
  subtotal: Scalars['String']['input'];
  tax?: InputMaybe<Scalars['String']['input']>;
  timeoutMinutes?: InputMaybe<Scalars['Int']['input']>;
  total: Scalars['String']['input'];
};

export type CheckoutItemInput = {
  metadata?: InputMaybe<Scalars['String']['input']>;
  productId: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
  subtotal: Scalars['String']['input'];
};

export type CheckoutResult = {
  __typename?: 'CheckoutResult';
  currency?: Maybe<Scalars['String']['output']>;
  orderId?: Maybe<Scalars['String']['output']>;
  orderNumber?: Maybe<Scalars['String']['output']>;
  paymentId?: Maybe<Scalars['String']['output']>;
  paymentMethod?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  total?: Maybe<Scalars['String']['output']>;
};

export type Coupon = {
  __typename?: 'Coupon';
  appliesToType: AppliesToTypeGraphQl;
  categoryIds?: Maybe<Array<Scalars['String']['output']>>;
  code: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  expiresAt?: Maybe<Scalars['String']['output']>;
  firstTimeBuyersOnly: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  maxUses?: Maybe<Scalars['Int']['output']>;
  maxUsesPerUser: Scalars['Int']['output'];
  minOrderAmount: Scalars['Float']['output'];
  minProductQuantity: Scalars['Int']['output'];
  productIds?: Maybe<Array<Scalars['String']['output']>>;
  stackable: Scalars['Boolean']['output'];
  startsAt?: Maybe<Scalars['String']['output']>;
  type: CouponTypeGraphQl;
  usages: Scalars['Int']['output'];
  usedCount: Scalars['Int']['output'];
  value: Scalars['Float']['output'];
  visibility: Scalars['String']['output'];
};

export type CouponTypeGraphQl =
  | 'FIXED'
  | 'PERCENTAGE'
  | 'SHIPPING';

export type CouponUsage = {
  __typename?: 'CouponUsage';
  couponId: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  customerId: Scalars['String']['output'];
  discountAmount: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  orderId: Scalars['String']['output'];
};

export type CreateCategoryInput = {
  image?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  visibility?: InputMaybe<Scalars['String']['input']>;
};

export type CreateCouponInput = {
  appliesToType: Scalars['String']['input'];
  categoryIds?: InputMaybe<Array<Scalars['String']['input']>>;
  code: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  expiresAt?: InputMaybe<Scalars['String']['input']>;
  firstTimeBuyersOnly: Scalars['Boolean']['input'];
  isActive: Scalars['Boolean']['input'];
  maxUses?: InputMaybe<Scalars['Int']['input']>;
  maxUsesPerUser: Scalars['Int']['input'];
  minOrderAmount: Scalars['Float']['input'];
  minProductQuantity: Scalars['Int']['input'];
  productIds?: InputMaybe<Array<Scalars['String']['input']>>;
  stackable: Scalars['Boolean']['input'];
  startsAt?: InputMaybe<Scalars['String']['input']>;
  type: Scalars['String']['input'];
  value: Scalars['Float']['input'];
  visibility: Scalars['String']['input'];
};

export type CreateReviewInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  media?: InputMaybe<Array<ReviewMediaInput>>;
  productId: Scalars['String']['input'];
  rating: Scalars['Int']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

/** A delivery zone with its locations and shipping methods as JSON strings */
export type DeliveryZone = {
  __typename?: 'DeliveryZone';
  /** Unique identifier for the zone */
  id: Scalars['String']['output'];
  /** Geographic locations covered by this zone (JSON string — client parses with JSON.parse()) */
  locations?: Maybe<Scalars['String']['output']>;
  /** Shipping methods available in this zone (JSON string — client parses with JSON.parse()) */
  methods?: Maybe<Scalars['String']['output']>;
  /** Display name for the zone */
  name: Scalars['String']['output'];
  /** Sort order position */
  position: Scalars['Int']['output'];
};

export type DeliveryZoneInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  locations?: InputMaybe<Scalars['String']['input']>;
  methods?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  position?: InputMaybe<Scalars['Int']['input']>;
};

export type Hero = {
  __typename?: 'Hero';
  aspectRatio: Scalars['String']['output'];
  autoplay: Scalars['Boolean']['output'];
  autoplayInterval: Scalars['Int']['output'];
  displayType: Scalars['String']['output'];
  endsAt?: Maybe<Scalars['String']['output']>;
  gap: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  items?: Maybe<Array<HeroItem>>;
  maxHeight?: Maybe<Scalars['Int']['output']>;
  metadata?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  showIndicators: Scalars['Boolean']['output'];
  showNavigation: Scalars['Boolean']['output'];
  startsAt?: Maybe<Scalars['String']['output']>;
  visibility?: Maybe<Scalars['String']['output']>;
};

export type HeroItem = {
  __typename?: 'HeroItem';
  backgroundColor?: Maybe<Scalars['String']['output']>;
  backgroundGradient?: Maybe<Scalars['String']['output']>;
  backgroundImageAlt?: Maybe<Scalars['String']['output']>;
  backgroundImageUrl?: Maybe<Scalars['String']['output']>;
  backgroundType: Scalars['String']['output'];
  backgroundVideoUrl?: Maybe<Scalars['String']['output']>;
  contentPosition: Scalars['String']['output'];
  ctaBackgroundColor?: Maybe<Scalars['String']['output']>;
  ctaSecondaryStyle: Scalars['String']['output'];
  ctaSecondaryTarget: Scalars['String']['output'];
  ctaSecondaryText?: Maybe<Scalars['String']['output']>;
  ctaSecondaryUrl?: Maybe<Scalars['String']['output']>;
  ctaStyle: Scalars['String']['output'];
  ctaTarget: Scalars['String']['output'];
  ctaText?: Maybe<Scalars['String']['output']>;
  ctaTextColor?: Maybe<Scalars['String']['output']>;
  ctaUrl?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  descriptionColor: Scalars['String']['output'];
  endsAt?: Maybe<Scalars['String']['output']>;
  hideOnDesktop: Scalars['Boolean']['output'];
  hideOnMobile: Scalars['Boolean']['output'];
  id?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  metadata?: Maybe<Scalars['String']['output']>;
  mobileBackgroundImageUrl?: Maybe<Scalars['String']['output']>;
  mobileContentPosition?: Maybe<Scalars['String']['output']>;
  overlayColor?: Maybe<Scalars['String']['output']>;
  overlayOpacity: Scalars['Float']['output'];
  sortOrder: Scalars['Int']['output'];
  startsAt?: Maybe<Scalars['String']['output']>;
  subtitle?: Maybe<Scalars['String']['output']>;
  subtitleColor: Scalars['String']['output'];
  textAlignment: Scalars['String']['output'];
  title?: Maybe<Scalars['String']['output']>;
  titleColor: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addFavorite: Scalars['Boolean']['output'];
  addToWishlist: Scalars['Boolean']['output'];
  cartItem: CartItem;
  categoryAddChildren: Category;
  categoryAddProducts: Category;
  categoryRemoveChildren: Category;
  categoryRemoveProducts: Category;
  checkout: CheckoutResult;
  clearCart: Scalars['Boolean']['output'];
  clearSelectedCartItems: Scalars['Boolean']['output'];
  confirmPayment: PaymentConfirmationResult;
  createCategory: Category;
  createCoupon: Coupon;
  createNotification?: Maybe<Notification>;
  createReview: Review;
  deleteCategory: Scalars['Boolean']['output'];
  deleteCoupon: Scalars['Boolean']['output'];
  deleteDeliveryZone: Scalars['Boolean']['output'];
  deleteHero: Scalars['Boolean']['output'];
  deleteHeroItem: Scalars['Boolean']['output'];
  deleteNotificationTemplate: Scalars['Boolean']['output'];
  deleteOrder: Scalars['Boolean']['output'];
  deleteProduct: Scalars['Boolean']['output'];
  deleteReview: Scalars['Boolean']['output'];
  markNotificationsRead: Scalars['Int']['output'];
  removeCartItem: Scalars['Boolean']['output'];
  removeFavorite: Scalars['Boolean']['output'];
  removeFromWishlist: Scalars['Boolean']['output'];
  saveDeliveryZone?: Maybe<DeliveryZone>;
  saveDeliveryZones: Array<DeliveryZone>;
  saveHero: Hero;
  saveHeroItem: HeroItem;
  saveNotificationTemplate: NotificationTemplate;
  saveNotificationTemplates: Array<NotificationTemplate>;
  saveOrder: Order;
  saveProduct: Product;
  trackProductView: Scalars['Boolean']['output'];
  updateCategory?: Maybe<Category>;
  updateCoupon?: Maybe<Coupon>;
  updateGenericSettings: Scalars['Boolean']['output'];
  updateHeroItem: HeroItem;
  updateOrderStatus: Order;
  updateReview: Review;
};


export type MutationAddFavoriteArgs = {
  productId: Scalars['String']['input'];
};


export type MutationAddToWishlistArgs = {
  input: WishlistInput;
};


export type MutationCartItemArgs = {
  input: CartItemInput;
};


export type MutationCategoryAddChildrenArgs = {
  input: CategoryAddChildrenInput;
};


export type MutationCategoryAddProductsArgs = {
  input: CategoryAddProductsInput;
};


export type MutationCategoryRemoveChildrenArgs = {
  input: CategoryRemoveChildrenInput;
};


export type MutationCategoryRemoveProductsArgs = {
  input: CategoryRemoveProductsInput;
};


export type MutationCheckoutArgs = {
  input: CheckoutInput;
};


export type MutationConfirmPaymentArgs = {
  input: PaymentConfirmationInput;
};


export type MutationCreateCategoryArgs = {
  input: CreateCategoryInput;
};


export type MutationCreateCouponArgs = {
  input: CreateCouponInput;
};


export type MutationCreateNotificationArgs = {
  input: NotificationInput;
};


export type MutationCreateReviewArgs = {
  input: CreateReviewInput;
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteCouponArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteDeliveryZoneArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteHeroItemArgs = {
  itemId: Scalars['String']['input'];
};


export type MutationDeleteNotificationTemplateArgs = {
  channel: Scalars['String']['input'];
  eventType: Scalars['String']['input'];
};


export type MutationDeleteOrderArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteProductArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteReviewArgs = {
  productId: Scalars['String']['input'];
  reviewId: Scalars['String']['input'];
};


export type MutationMarkNotificationsReadArgs = {
  ids?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type MutationRemoveCartItemArgs = {
  itemId: Scalars['String']['input'];
};


export type MutationRemoveFavoriteArgs = {
  productId: Scalars['String']['input'];
};


export type MutationRemoveFromWishlistArgs = {
  wishlistId: Scalars['String']['input'];
};


export type MutationSaveDeliveryZoneArgs = {
  input: DeliveryZoneInput;
};


export type MutationSaveDeliveryZonesArgs = {
  input: SaveDeliveryZonesInput;
};


export type MutationSaveHeroArgs = {
  input: SaveHeroInput;
};


export type MutationSaveHeroItemArgs = {
  input: SaveHeroItemInput;
};


export type MutationSaveNotificationTemplateArgs = {
  input: NotificationTemplateInput;
};


export type MutationSaveNotificationTemplatesArgs = {
  input: SaveNotificationTemplatesInput;
};


export type MutationSaveOrderArgs = {
  input: SaveOrderInput;
};


export type MutationSaveProductArgs = {
  input: ProductInput;
};


export type MutationTrackProductViewArgs = {
  productId: Scalars['String']['input'];
  sessionId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateCategoryArgs = {
  input: UpdateCategoryInput;
};


export type MutationUpdateCouponArgs = {
  id: Scalars['String']['input'];
  input: UpdateCouponInput;
};


export type MutationUpdateGenericSettingsArgs = {
  input: UpdateGenericSettingsInput;
};


export type MutationUpdateHeroItemArgs = {
  input: SaveHeroItemInput;
  itemId: Scalars['String']['input'];
};


export type MutationUpdateOrderStatusArgs = {
  id: Scalars['String']['input'];
  status: Scalars['String']['input'];
};


export type MutationUpdateReviewArgs = {
  input: UpdateReviewInput;
};

export type Notification = {
  __typename?: 'Notification';
  body?: Maybe<Scalars['String']['output']>;
  channel?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  insertedAt?: Maybe<Scalars['String']['output']>;
  metadata?: Maybe<Scalars['String']['output']>;
  readAt?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  subject?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
};

export type NotificationConnection = {
  __typename?: 'NotificationConnection';
  edges: Array<NotificationEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type NotificationEdge = {
  __typename?: 'NotificationEdge';
  cursor: Scalars['String']['output'];
  node: Notification;
};

export type NotificationInput = {
  body?: InputMaybe<Scalars['String']['input']>;
  channel?: InputMaybe<Scalars['String']['input']>;
  customerId?: InputMaybe<Scalars['String']['input']>;
  dedupKey?: InputMaybe<Scalars['String']['input']>;
  error?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['String']['input']>;
  provider?: InputMaybe<Scalars['String']['input']>;
  providerMessageId?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<NotificationStatus>;
  subject?: InputMaybe<Scalars['String']['input']>;
  type: Scalars['String']['input'];
};

export type NotificationStatus =
  | 'DELIVERED'
  | 'FAILED'
  | 'PENDING'
  | 'SENT';

export type NotificationTemplate = {
  __typename?: 'NotificationTemplate';
  bodyHtml?: Maybe<Scalars['String']['output']>;
  bodyText?: Maybe<Scalars['String']['output']>;
  channel: Scalars['String']['output'];
  eventType: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  isDefault: Scalars['Boolean']['output'];
  subject?: Maybe<Scalars['String']['output']>;
};

export type NotificationTemplateInput = {
  bodyHtml?: InputMaybe<Scalars['String']['input']>;
  bodyText?: InputMaybe<Scalars['String']['input']>;
  channel: Scalars['String']['input'];
  eventType: Scalars['String']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  subject?: InputMaybe<Scalars['String']['input']>;
};

export type Order = {
  __typename?: 'Order';
  billingAddress?: Maybe<Scalars['String']['output']>;
  cancelledAt?: Maybe<Scalars['String']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  customerId?: Maybe<Scalars['String']['output']>;
  deliveredAt?: Maybe<Scalars['String']['output']>;
  deliveryLocation?: Maybe<Scalars['String']['output']>;
  deliveryMethod?: Maybe<Scalars['String']['output']>;
  deliveryZone?: Maybe<Scalars['String']['output']>;
  discount?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  insertedAt?: Maybe<Scalars['String']['output']>;
  items: Array<OrderItem>;
  name?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  orderNumber: Scalars['String']['output'];
  paid: Scalars['Boolean']['output'];
  paidAt?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  refundedAt?: Maybe<Scalars['String']['output']>;
  shippedAt?: Maybe<Scalars['String']['output']>;
  shippingAddress?: Maybe<Scalars['String']['output']>;
  shippingCost?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  subtotal?: Maybe<Scalars['String']['output']>;
  tax?: Maybe<Scalars['String']['output']>;
  total?: Maybe<Scalars['String']['output']>;
  trackingNumber?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type OrderConnection = {
  __typename?: 'OrderConnection';
  edges: Array<OrderEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type OrderEdge = {
  __typename?: 'OrderEdge';
  cursor: Scalars['String']['output'];
  node: Order;
};

export type OrderFiltersInput = {
  customerId?: InputMaybe<Scalars['String']['input']>;
  maxTotal?: InputMaybe<Scalars['String']['input']>;
  minTotal?: InputMaybe<Scalars['String']['input']>;
  paid?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type OrderItem = {
  __typename?: 'OrderItem';
  id?: Maybe<Scalars['String']['output']>;
  metadata?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['String']['output']>;
  productId?: Maybe<Scalars['String']['output']>;
  productName?: Maybe<Scalars['String']['output']>;
  productSku?: Maybe<Scalars['String']['output']>;
  quantity: Scalars['Int']['output'];
  subtotal?: Maybe<Scalars['String']['output']>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type Payment = {
  __typename?: 'Payment';
  amount: Scalars['String']['output'];
  amountRefunded?: Maybe<Scalars['String']['output']>;
  cancelledAt?: Maybe<Scalars['String']['output']>;
  currency: Scalars['String']['output'];
  id: Scalars['String']['output'];
  insertedAt?: Maybe<Scalars['String']['output']>;
  metadata?: Maybe<Scalars['String']['output']>;
  orderId: Scalars['String']['output'];
  processedAt?: Maybe<Scalars['String']['output']>;
  provider?: Maybe<Scalars['String']['output']>;
  refundReason?: Maybe<Scalars['String']['output']>;
  refundedAt?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type PaymentConfirmationInput = {
  metadata?: InputMaybe<Scalars['String']['input']>;
  paymentId: Scalars['String']['input'];
  status: Scalars['String']['input'];
};

export type PaymentConfirmationResult = {
  __typename?: 'PaymentConfirmationResult';
  orderId?: Maybe<Scalars['String']['output']>;
  paymentId: Scalars['String']['output'];
  status: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type PaymentConnection = {
  __typename?: 'PaymentConnection';
  edges: Array<PaymentEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type PaymentEdge = {
  __typename?: 'PaymentEdge';
  cursor: Scalars['String']['output'];
  node: Payment;
};

export type PaymentFiltersInput = {
  maxAmount?: InputMaybe<Scalars['String']['input']>;
  minAmount?: InputMaybe<Scalars['String']['input']>;
  provider?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type PriceRange = {
  __typename?: 'PriceRange';
  max: Scalars['String']['output'];
  min: Scalars['String']['output'];
};

export type Product = {
  __typename?: 'Product';
  allowBackorder: Scalars['Boolean']['output'];
  averageRating?: Maybe<Scalars['String']['output']>;
  brand?: Maybe<Scalars['String']['output']>;
  category?: Maybe<Category>;
  compareToPrice?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  insertedAt?: Maybe<Scalars['String']['output']>;
  lowStockThreshold: Scalars['Int']['output'];
  media?: Maybe<Array<ProductMedia>>;
  metadata?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  optionValues?: Maybe<Scalars['String']['output']>;
  options?: Maybe<Scalars['String']['output']>;
  outOfStockThreshold: Scalars['Int']['output'];
  parentId?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['String']['output']>;
  priceRange?: Maybe<PriceRange>;
  productType?: Maybe<Scalars['String']['output']>;
  relatedProducts: ProductConnection;
  reservedQuantity: Scalars['Int']['output'];
  reviewCount: Scalars['Int']['output'];
  reviewStats?: Maybe<ReviewStats>;
  reviews: ReviewConnection;
  sku?: Maybe<Scalars['String']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  stockQuantity: Scalars['Int']['output'];
  stockStatus: Scalars['String']['output'];
  trackInventory: Scalars['Boolean']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  variants?: Maybe<Array<Product>>;
  vendor?: Maybe<Scalars['String']['output']>;
  visibility?: Maybe<Scalars['String']['output']>;
  weight?: Maybe<Scalars['Float']['output']>;
};


export type ProductRelatedProductsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type ProductReviewsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type ProductConnection = {
  __typename?: 'ProductConnection';
  edges: Array<ProductEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ProductEdge = {
  __typename?: 'ProductEdge';
  cursor: Scalars['String']['output'];
  node: Product;
};

export type ProductFilterOptions = {
  __typename?: 'ProductFilterOptions';
  brands: Array<Scalars['String']['output']>;
  productTypes: Array<Scalars['String']['output']>;
  vendors: Array<Scalars['String']['output']>;
};

export type ProductFiltersInput = {
  brand?: InputMaybe<Scalars['String']['input']>;
  brands?: InputMaybe<Array<Scalars['String']['input']>>;
  categoryId?: InputMaybe<Scalars['String']['input']>;
  maxPrice?: InputMaybe<Scalars['String']['input']>;
  minPrice?: InputMaybe<Scalars['String']['input']>;
  minRating?: InputMaybe<Scalars['String']['input']>;
  productType?: InputMaybe<Scalars['String']['input']>;
  productTypes?: InputMaybe<Array<Scalars['String']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  vendor?: InputMaybe<Scalars['String']['input']>;
  vendors?: InputMaybe<Array<Scalars['String']['input']>>;
  visibility?: InputMaybe<Scalars['String']['input']>;
};

export type ProductInput = {
  allowBackorder?: InputMaybe<Scalars['Boolean']['input']>;
  brand?: InputMaybe<Scalars['String']['input']>;
  compareToPrice?: InputMaybe<Scalars['String']['input']>;
  deliveryZoneIds?: InputMaybe<Array<Scalars['String']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  lowStockThreshold?: InputMaybe<Scalars['Int']['input']>;
  media?: InputMaybe<Array<ProductMediaInput>>;
  metadata?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  optionValues?: InputMaybe<Scalars['String']['input']>;
  options?: InputMaybe<Scalars['String']['input']>;
  outOfStockThreshold?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['String']['input']>;
  productType?: InputMaybe<Scalars['String']['input']>;
  sku?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  stockQuantity?: InputMaybe<Scalars['Int']['input']>;
  trackInventory?: InputMaybe<Scalars['Boolean']['input']>;
  vendor?: InputMaybe<Scalars['String']['input']>;
  visibility?: InputMaybe<Scalars['String']['input']>;
  weight?: InputMaybe<Scalars['Float']['input']>;
};

export type ProductMedia = {
  __typename?: 'ProductMedia';
  alt?: Maybe<Scalars['String']['output']>;
  displayOrder: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  mimeType?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type ProductMediaInput = {
  alt?: InputMaybe<Scalars['String']['input']>;
  displayOrder: Scalars['Int']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  mimeType?: InputMaybe<Scalars['String']['input']>;
  type: Scalars['String']['input'];
  url: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  cart?: Maybe<Cart>;
  categories: Array<Category>;
  category?: Maybe<Category>;
  coupon?: Maybe<Coupon>;
  couponUsages: Array<CouponUsage>;
  coupons: Array<Coupon>;
  deliveryZone?: Maybe<DeliveryZone>;
  deliveryZones: Array<DeliveryZone>;
  hero?: Maybe<Hero>;
  notificationTemplates: Array<NotificationTemplate>;
  notifications: NotificationConnection;
  order?: Maybe<Order>;
  orderCount: Scalars['Int']['output'];
  orders: OrderConnection;
  payment?: Maybe<Payment>;
  paymentByOrder?: Maybe<Payment>;
  payments: PaymentConnection;
  product?: Maybe<Product>;
  productFilterOptions: ProductFilterOptions;
  productSuggestions: Array<Scalars['String']['output']>;
  products: ProductConnection;
  recommendations: RecommendationResult;
  store?: Maybe<Store>;
  storeSettings: StoreSettings;
  unreadNotificationCount: Scalars['Int']['output'];
  validateCoupon: ValidateCouponResult;
  wishlist?: Maybe<Wishlist>;
};


export type QueryCartArgs = {
  cartId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCategoriesArgs = {
  filters?: InputMaybe<CategoryFiltersInput>;
};


export type QueryCategoryArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCouponArgs = {
  id: Scalars['String']['input'];
};


export type QueryCouponUsagesArgs = {
  couponId: Scalars['String']['input'];
};


export type QueryDeliveryZoneArgs = {
  id: Scalars['String']['input'];
};


export type QueryNotificationTemplatesArgs = {
  eventType?: InputMaybe<Scalars['String']['input']>;
};


export type QueryNotificationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryOrderArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  orderNumber?: InputMaybe<Scalars['String']['input']>;
};


export type QueryOrdersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<OrderFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPaymentArgs = {
  id: Scalars['String']['input'];
};


export type QueryPaymentByOrderArgs = {
  orderId: Scalars['String']['input'];
};


export type QueryPaymentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<PaymentFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryProductArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};


export type QueryProductFilterOptionsArgs = {
  fields: Array<Scalars['String']['input']>;
};


export type QueryProductSuggestionsArgs = {
  limit: Scalars['Int']['input'];
  query: Scalars['String']['input'];
};


export type QueryProductsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<ProductFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryRecommendationsArgs = {
  input?: InputMaybe<RecommendationsInput>;
};


export type QueryValidateCouponArgs = {
  input: ValidateCouponInput;
};

export type RecommendationResult = {
  __typename?: 'RecommendationResult';
  fallback?: Maybe<Scalars['String']['output']>;
  products: Array<Product>;
  source: Scalars['String']['output'];
};

export type RecommendationsInput = {
  cartProductIds?: InputMaybe<Array<Scalars['String']['input']>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  productId?: InputMaybe<Scalars['String']['input']>;
  sessionId?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type Review = {
  __typename?: 'Review';
  authorName?: Maybe<Scalars['String']['output']>;
  comment?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  media?: Maybe<Array<ReviewMedia>>;
  rating: Scalars['Int']['output'];
};

export type ReviewConnection = {
  __typename?: 'ReviewConnection';
  edges: Array<ReviewEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ReviewEdge = {
  __typename?: 'ReviewEdge';
  cursor: Scalars['String']['output'];
  node: Review;
};

export type ReviewMedia = {
  __typename?: 'ReviewMedia';
  alt?: Maybe<Scalars['String']['output']>;
  displayOrder: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  mimeType?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type ReviewMediaInput = {
  alt?: InputMaybe<Scalars['String']['input']>;
  displayOrder: Scalars['Int']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  mimeType?: InputMaybe<Scalars['String']['input']>;
  type: Scalars['String']['input'];
  url: Scalars['String']['input'];
};

export type ReviewStats = {
  __typename?: 'ReviewStats';
  averageRating?: Maybe<Scalars['Float']['output']>;
  totalCount: Scalars['Int']['output'];
};

export type SaveDeliveryZonesInput = {
  zones: Array<DeliveryZoneInput>;
};

export type SaveHeroInput = {
  aspectRatio?: InputMaybe<Scalars['String']['input']>;
  autoplay?: InputMaybe<Scalars['Boolean']['input']>;
  autoplayInterval?: InputMaybe<Scalars['Int']['input']>;
  displayType?: InputMaybe<Scalars['String']['input']>;
  endsAt?: InputMaybe<Scalars['String']['input']>;
  gap?: InputMaybe<Scalars['Int']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  maxHeight?: InputMaybe<Scalars['Int']['input']>;
  metadata?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  showIndicators?: InputMaybe<Scalars['Boolean']['input']>;
  showNavigation?: InputMaybe<Scalars['Boolean']['input']>;
  startsAt?: InputMaybe<Scalars['String']['input']>;
  visibility?: InputMaybe<Scalars['String']['input']>;
};

export type SaveHeroItemInput = {
  backgroundColor?: InputMaybe<Scalars['String']['input']>;
  backgroundGradient?: InputMaybe<Scalars['String']['input']>;
  backgroundImageAlt?: InputMaybe<Scalars['String']['input']>;
  backgroundImageUrl?: InputMaybe<Scalars['String']['input']>;
  backgroundType?: InputMaybe<Scalars['String']['input']>;
  backgroundVideoUrl?: InputMaybe<Scalars['String']['input']>;
  contentPosition?: InputMaybe<Scalars['String']['input']>;
  ctaBackgroundColor?: InputMaybe<Scalars['String']['input']>;
  ctaSecondaryStyle?: InputMaybe<Scalars['String']['input']>;
  ctaSecondaryTarget?: InputMaybe<Scalars['String']['input']>;
  ctaSecondaryText?: InputMaybe<Scalars['String']['input']>;
  ctaSecondaryUrl?: InputMaybe<Scalars['String']['input']>;
  ctaStyle?: InputMaybe<Scalars['String']['input']>;
  ctaTarget?: InputMaybe<Scalars['String']['input']>;
  ctaText?: InputMaybe<Scalars['String']['input']>;
  ctaTextColor?: InputMaybe<Scalars['String']['input']>;
  ctaUrl?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  descriptionColor?: InputMaybe<Scalars['String']['input']>;
  endsAt?: InputMaybe<Scalars['String']['input']>;
  hideOnDesktop?: InputMaybe<Scalars['Boolean']['input']>;
  hideOnMobile?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  metadata?: InputMaybe<Scalars['String']['input']>;
  mobileBackgroundImageUrl?: InputMaybe<Scalars['String']['input']>;
  mobileContentPosition?: InputMaybe<Scalars['String']['input']>;
  overlayColor?: InputMaybe<Scalars['String']['input']>;
  overlayOpacity?: InputMaybe<Scalars['Float']['input']>;
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
  startsAt?: InputMaybe<Scalars['String']['input']>;
  subtitle?: InputMaybe<Scalars['String']['input']>;
  subtitleColor?: InputMaybe<Scalars['String']['input']>;
  textAlignment?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  titleColor?: InputMaybe<Scalars['String']['input']>;
};

export type SaveNotificationTemplatesInput = {
  templates: Array<NotificationTemplateInput>;
};

export type SaveOrderInput = {
  billingAddress?: InputMaybe<Scalars['String']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  customerId?: InputMaybe<Scalars['String']['input']>;
  deliveryLocation?: InputMaybe<Scalars['String']['input']>;
  deliveryMethod?: InputMaybe<Scalars['String']['input']>;
  deliveryZone?: InputMaybe<Scalars['String']['input']>;
  discount?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  items?: InputMaybe<Array<SaveOrderItemInput>>;
  name?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  orderNumber?: InputMaybe<Scalars['String']['input']>;
  paid?: InputMaybe<Scalars['Boolean']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  shippingAddress?: InputMaybe<Scalars['String']['input']>;
  shippingCost?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  subtotal?: InputMaybe<Scalars['String']['input']>;
  tax?: InputMaybe<Scalars['String']['input']>;
  total?: InputMaybe<Scalars['String']['input']>;
  trackingNumber?: InputMaybe<Scalars['String']['input']>;
};

export type SaveOrderItemInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['String']['input']>;
  price: Scalars['String']['input'];
  productId: Scalars['String']['input'];
  productName: Scalars['String']['input'];
  productSku?: InputMaybe<Scalars['String']['input']>;
  quantity: Scalars['Int']['input'];
  subtotal: Scalars['String']['input'];
};

export type Store = {
  __typename?: 'Store';
  currency?: Maybe<Scalars['String']['output']>;
  domainName?: Maybe<Scalars['String']['output']>;
  faviconUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isInMaintenanceMode?: Maybe<Scalars['Boolean']['output']>;
  logoUrl?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

/** All store settings grouped by type. Each field is a JSON string — clients parse with JSON.parse(). */
export type StoreSettings = {
  __typename?: 'StoreSettings';
  /** About page content for your store (JSON) */
  about?: Maybe<Scalars['String']['output']>;
  /** Contact information displayed on your store (JSON) */
  contact?: Maybe<Scalars['String']['output']>;
  /** Environment variables for the template (JSON) */
  environment?: Maybe<Scalars['String']['output']>;
  /** Social media profiles for your store (JSON) */
  social?: Maybe<Scalars['String']['output']>;
};

export type UpdateCategoryInput = {
  id: Scalars['String']['input'];
  image?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  parentId?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  visibility?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCouponInput = {
  appliesToType?: InputMaybe<Scalars['String']['input']>;
  categoryIds?: InputMaybe<Array<Scalars['String']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  expiresAt?: InputMaybe<Scalars['String']['input']>;
  firstTimeBuyersOnly?: InputMaybe<Scalars['Boolean']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  maxUses?: InputMaybe<Scalars['Int']['input']>;
  maxUsesPerUser?: InputMaybe<Scalars['Int']['input']>;
  minOrderAmount?: InputMaybe<Scalars['Float']['input']>;
  minProductQuantity?: InputMaybe<Scalars['Int']['input']>;
  productIds?: InputMaybe<Array<Scalars['String']['input']>>;
  stackable?: InputMaybe<Scalars['Boolean']['input']>;
  startsAt?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['Float']['input']>;
  visibility?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateGenericSettingsInput = {
  content: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type UpdateReviewInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  media?: InputMaybe<Array<ReviewMediaInput>>;
  productId: Scalars['String']['input'];
  rating?: InputMaybe<Scalars['Int']['input']>;
  reviewId: Scalars['String']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type ValidateCouponInput = {
  code: Scalars['String']['input'];
  customerId?: InputMaybe<Scalars['String']['input']>;
  orderTotal: Scalars['Float']['input'];
};

export type ValidateCouponResult = {
  __typename?: 'ValidateCouponResult';
  code?: Maybe<Scalars['String']['output']>;
  couponId?: Maybe<Scalars['String']['output']>;
  discountAmount: Scalars['Float']['output'];
  error?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  valid: Scalars['Boolean']['output'];
};

export type Wishlist = {
  __typename?: 'Wishlist';
  id: Scalars['String']['output'];
  items: Array<WishlistItem>;
};

export type WishlistInput = {
  items?: InputMaybe<Array<WishlistItemInput>>;
};

export type WishlistItem = {
  __typename?: 'WishlistItem';
  id: Scalars['String']['output'];
  productId: Scalars['String']['output'];
};

export type WishlistItemInput = {
  productId: Scalars['String']['input'];
};
