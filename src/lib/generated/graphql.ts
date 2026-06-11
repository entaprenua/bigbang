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

export type AddMemberInput = {
  email: Scalars['String']['input'];
  role: Scalars['String']['input'];
};

export type AddressInput = {
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  street?: InputMaybe<Scalars['String']['input']>;
  zip?: InputMaybe<Scalars['String']['input']>;
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
  id?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['String']['output']>;
  product?: Maybe<Product>;
  productId?: Maybe<Scalars['String']['output']>;
  quantity: Scalars['Int']['output'];
  selected: Scalars['Boolean']['output'];
  subtotal?: Maybe<Scalars['String']['output']>;
  variantId: Scalars['String']['output'];
};

export type CartItemInput = {
  quantity: Scalars['Int']['input'];
  variantId: Scalars['String']['input'];
};

export type Category = {
  __typename?: 'Category';
  children: Array<Category>;
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  level: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  parentId?: Maybe<Scalars['String']['output']>;
  path?: Maybe<Scalars['String']['output']>;
  products?: Maybe<ProductConnection>;
  slug?: Maybe<Scalars['String']['output']>;
  visibility?: Maybe<Scalars['String']['output']>;
};


export type CategoryProductsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

export type CategoryFiltersInput = {
  level?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['String']['input']>;
  root?: InputMaybe<Scalars['Boolean']['input']>;
  tree?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Flattened delivery data for the storefront checkout */
export type CheckoutData = {
  __typename?: 'CheckoutData';
  /** Cities grouped by country (JSON string) */
  citiesByCountry?: Maybe<Scalars['String']['output']>;
  /** Countries available for delivery */
  countries: Array<Scalars['String']['output']>;
  /** Available delivery types with pricing */
  deliveryTypes: Array<DeliveryType>;
};

export type CheckoutInput = {
  billingAddress?: InputMaybe<AddressInput>;
  currency: Scalars['String']['input'];
  customerEmail?: InputMaybe<Scalars['String']['input']>;
  deliveryCity?: InputMaybe<Scalars['String']['input']>;
  deliveryCountry?: InputMaybe<Scalars['String']['input']>;
  deliveryMethod?: InputMaybe<Scalars['String']['input']>;
  deliveryMethodId?: InputMaybe<Scalars['String']['input']>;
  deliveryZoneId?: InputMaybe<Scalars['String']['input']>;
  discount?: InputMaybe<Scalars['String']['input']>;
  guestEmail?: InputMaybe<Scalars['String']['input']>;
  items: Array<CheckoutItemInput>;
  name?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  paymentPhone?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  provider: Scalars['String']['input'];
  shippingAddress?: InputMaybe<AddressInput>;
  shippingCost?: InputMaybe<Scalars['String']['input']>;
  subtotal: Scalars['String']['input'];
  tax?: InputMaybe<Scalars['String']['input']>;
  total: Scalars['String']['input'];
};

export type CheckoutItemInput = {
  price: Scalars['String']['input'];
  productId: Scalars['String']['input'];
  productName: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
  subtotal: Scalars['String']['input'];
  variantId?: InputMaybe<Scalars['String']['input']>;
  variantOptions?: InputMaybe<Scalars['String']['input']>;
  variantSku?: InputMaybe<Scalars['String']['input']>;
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

export type ClassPriceEntryInput = {
  classId: Scalars['String']['input'];
  methodId: Scalars['String']['input'];
  price: Scalars['Float']['input'];
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

export type CreateApiKeyResult = {
  __typename?: 'CreateApiKeyResult';
  apiKey: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  prefix: Scalars['String']['output'];
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

export type CreateDeliveryZoneInput = {
  locations?: InputMaybe<Array<DeliveryZoneLocationInput>>;
  methods?: InputMaybe<Array<DeliveryZoneMethodInput>>;
  name: Scalars['String']['input'];
  position: Scalars['Int']['input'];
};

export type CreateProductInput = {
  allowBackorder: Scalars['Boolean']['input'];
  brand?: InputMaybe<Scalars['String']['input']>;
  deliveryZoneIds?: InputMaybe<Array<Scalars['String']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  lowStockThreshold: Scalars['Int']['input'];
  media?: InputMaybe<Array<ProductMediaGraphQlInput>>;
  metadata?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  options?: InputMaybe<Array<ProductOptionGraphQlInput>>;
  outOfStockThreshold: Scalars['Int']['input'];
  productType?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  trackInventory: Scalars['Boolean']['input'];
  variants?: InputMaybe<Array<ProductVariantGraphQlInput>>;
  vendor?: InputMaybe<Scalars['String']['input']>;
  visibility?: InputMaybe<Scalars['String']['input']>;
};

export type CreateReviewInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  media?: InputMaybe<Array<ReviewMediaInput>>;
  productId: Scalars['String']['input'];
  rating: Scalars['Int']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type CreateShippingClassInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  position: Scalars['Int']['input'];
};

/** Delivery settings for checkout — shipping classes */
export type DeliverySettings = {
  __typename?: 'DeliverySettings';
  /** Shipping classes available for this store */
  shippingClasses: Array<ShippingClass>;
};

/** A delivery method option available at checkout */
export type DeliveryType = {
  __typename?: 'DeliveryType';
  /** Base price for this method */
  basePrice: Scalars['Float']['output'];
  /** Class-specific price overrides (JSON string) */
  classPrices?: Maybe<Scalars['String']['output']>;
  /** Conditions for this method (JSON string) */
  conditions?: Maybe<Scalars['String']['output']>;
  /** Estimated maximum delivery days */
  estMaxDays?: Maybe<Scalars['Int']['output']>;
  /** Estimated minimum delivery days */
  estMinDays?: Maybe<Scalars['Int']['output']>;
  /** Display label for the method */
  label: Scalars['String']['output'];
  /** Method type identifier (e.g. 'standard', 'express') */
  methodId: Scalars['String']['output'];
  /** The delivery zone this method belongs to */
  zoneId: Scalars['String']['output'];
};

/** A delivery zone with its locations, shipping methods, and class-specific pricing */
export type DeliveryZone = {
  __typename?: 'DeliveryZone';
  /** Unique identifier for the zone */
  id: Scalars['String']['output'];
  /** Geographic locations covered by this zone */
  locations: Array<DeliveryZoneLocation>;
  /** Shipping methods available in this zone */
  methods: Array<DeliveryZoneMethod>;
  /** Display name for the zone */
  name: Scalars['String']['output'];
  /** Sort order position */
  position: Scalars['Int']['output'];
};

/** A geographic location (country + cities) within a delivery zone */
export type DeliveryZoneLocation = {
  __typename?: 'DeliveryZoneLocation';
  /** Cities within this country covered by the zone */
  cities: Array<Scalars['String']['output']>;
  /** Country name */
  country: Scalars['String']['output'];
  /** Unique identifier */
  id: Scalars['String']['output'];
};

export type DeliveryZoneLocationInput = {
  cities?: InputMaybe<Array<Scalars['String']['input']>>;
  country: Scalars['String']['input'];
};

/** A shipping method (e.g. Standard, Express) within a delivery zone */
export type DeliveryZoneMethod = {
  __typename?: 'DeliveryZoneMethod';
  /** Base price for this method */
  basePrice: Scalars['Float']['output'];
  /** Class-specific price overrides */
  classPrices: Array<DeliveryZoneMethodClassPrice>;
  /** Conditions as JSON string, e.g. {"minAmount":"50"} */
  conditions?: Maybe<Scalars['String']['output']>;
  /** Estimated maximum delivery days */
  estMaxDays?: Maybe<Scalars['Int']['output']>;
  /** Estimated minimum delivery days */
  estMinDays?: Maybe<Scalars['Int']['output']>;
  /** Unique identifier */
  id: Scalars['String']['output'];
  /** Display label for the method */
  label: Scalars['String']['output'];
  /** Method type identifier (e.g. 'standard', 'express') */
  methodId: Scalars['String']['output'];
};

/** A shipping class price override for a specific delivery method */
export type DeliveryZoneMethodClassPrice = {
  __typename?: 'DeliveryZoneMethodClassPrice';
  /** Shipping class identifier */
  classId: Scalars['String']['output'];
  /** Price for this class with this method */
  price: Scalars['Float']['output'];
};

export type DeliveryZoneMethodInput = {
  conditions?: InputMaybe<Scalars['String']['input']>;
  estMaxDays?: InputMaybe<Scalars['Int']['input']>;
  estMinDays?: InputMaybe<Scalars['Int']['input']>;
  label: Scalars['String']['input'];
  methodId: Scalars['String']['input'];
  price: Scalars['Float']['input'];
};

export type GeneratePresignedInput = {
  contentType?: InputMaybe<Scalars['String']['input']>;
  fileName: Scalars['String']['input'];
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

export type InviteViaEmailInput = {
  email: Scalars['String']['input'];
  role: Scalars['String']['input'];
};

export type Media = {
  __typename?: 'Media';
  fileName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  insertedAt: Scalars['String']['output'];
  mimeType?: Maybe<Scalars['String']['output']>;
  objectKey: Scalars['String']['output'];
  size?: Maybe<Scalars['Int']['output']>;
  storeId: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type MediaConnection = {
  __typename?: 'MediaConnection';
  edges: Array<MediaEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type MediaEdge = {
  __typename?: 'MediaEdge';
  cursor: Scalars['String']['output'];
  node: Media;
};

export type MediaStats = {
  __typename?: 'MediaStats';
  totalFiles: Scalars['Int']['output'];
  totalSizeBytes: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addCategoryChildren: Scalars['Boolean']['output'];
  addCategoryProducts: Scalars['Boolean']['output'];
  addFavorite: Scalars['Boolean']['output'];
  addMember: Scalars['Boolean']['output'];
  addToCart: Cart;
  addToWishlist: Scalars['Boolean']['output'];
  cancelInvitation: Scalars['Boolean']['output'];
  checkout: CheckoutResult;
  clearCart: Scalars['Boolean']['output'];
  clearSelectedCartItems: Scalars['Boolean']['output'];
  confirmPayment: PaymentConfirmationResult;
  createApiKey: CreateApiKeyResult;
  createCategory: Category;
  createCoupon: Coupon;
  createDeliveryZone: Scalars['Boolean']['output'];
  createProduct: Product;
  createReview: Review;
  createShippingClass: Scalars['Boolean']['output'];
  deleteApiKey: Scalars['Boolean']['output'];
  deleteCategory: Scalars['Boolean']['output'];
  deleteCoupon: Scalars['Boolean']['output'];
  deleteDeliveryZone: Scalars['Boolean']['output'];
  deleteHero: Scalars['Boolean']['output'];
  deleteHeroItem: Scalars['Boolean']['output'];
  deleteMedia: Scalars['Boolean']['output'];
  deleteNotificationTemplate: Scalars['Boolean']['output'];
  deleteOrder: Scalars['Boolean']['output'];
  deleteProduct: Scalars['Boolean']['output'];
  deleteReview: Scalars['Boolean']['output'];
  deleteShippingClass: Scalars['Boolean']['output'];
  deleteStore: Scalars['Boolean']['output'];
  generatePresignedUrl: PresignedMedia;
  inviteViaEmail: Scalars['Boolean']['output'];
  registerMedia: Media;
  removeCartItem: Scalars['Boolean']['output'];
  removeCategoryChildren: Scalars['Boolean']['output'];
  removeCategoryProducts: Scalars['Boolean']['output'];
  removeFavorite: Scalars['Boolean']['output'];
  removeFromWishlist: Scalars['Boolean']['output'];
  removeMember: Scalars['Boolean']['output'];
  replaceZoneClassPrices: Scalars['Boolean']['output'];
  saveHero: Hero;
  saveHeroItem: HeroItem;
  saveOrder: Order;
  trackProductView: Scalars['Boolean']['output'];
  updateCartItem: Cart;
  updateCategory?: Maybe<Category>;
  updateCoupon?: Maybe<Coupon>;
  updateDeliveryZone: Scalars['Boolean']['output'];
  updateGenericSettings: Scalars['Boolean']['output'];
  updateHeroItem: HeroItem;
  updateMemberRole: Scalars['Boolean']['output'];
  updateNotificationTemplate: Scalars['Boolean']['output'];
  updateOrderStatus: Order;
  updateProduct: Product;
  updateReview: Review;
  updateShippingClass: Scalars['Boolean']['output'];
  updateStore: Store;
};


export type MutationAddCategoryChildrenArgs = {
  categoryId: Scalars['String']['input'];
  childIds: Array<Scalars['String']['input']>;
};


export type MutationAddCategoryProductsArgs = {
  categoryId: Scalars['String']['input'];
  productIds: Array<Scalars['String']['input']>;
};


export type MutationAddFavoriteArgs = {
  productId: Scalars['String']['input'];
};


export type MutationAddMemberArgs = {
  input: AddMemberInput;
};


export type MutationAddToCartArgs = {
  input: CartItemInput;
};


export type MutationAddToWishlistArgs = {
  input: WishlistInput;
};


export type MutationCancelInvitationArgs = {
  id: Scalars['String']['input'];
};


export type MutationCheckoutArgs = {
  input: CheckoutInput;
};


export type MutationConfirmPaymentArgs = {
  input: PaymentConfirmationInput;
};


export type MutationCreateApiKeyArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateCategoryArgs = {
  input: CreateCategoryInput;
};


export type MutationCreateCouponArgs = {
  input: CreateCouponInput;
};


export type MutationCreateDeliveryZoneArgs = {
  input: CreateDeliveryZoneInput;
};


export type MutationCreateProductArgs = {
  input: CreateProductInput;
};


export type MutationCreateReviewArgs = {
  input: CreateReviewInput;
};


export type MutationCreateShippingClassArgs = {
  input: CreateShippingClassInput;
};


export type MutationDeleteApiKeyArgs = {
  id: Scalars['String']['input'];
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


export type MutationDeleteMediaArgs = {
  id: Scalars['String']['input'];
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


export type MutationDeleteShippingClassArgs = {
  id: Scalars['String']['input'];
};


export type MutationGeneratePresignedUrlArgs = {
  input: GeneratePresignedInput;
};


export type MutationInviteViaEmailArgs = {
  input: InviteViaEmailInput;
};


export type MutationRegisterMediaArgs = {
  input: RegisterMediaInput;
};


export type MutationRemoveCartItemArgs = {
  variantId: Scalars['String']['input'];
};


export type MutationRemoveCategoryChildrenArgs = {
  categoryId: Scalars['String']['input'];
  childIds: Array<Scalars['String']['input']>;
};


export type MutationRemoveCategoryProductsArgs = {
  categoryId: Scalars['String']['input'];
  productIds: Array<Scalars['String']['input']>;
};


export type MutationRemoveFavoriteArgs = {
  productId: Scalars['String']['input'];
};


export type MutationRemoveFromWishlistArgs = {
  wishlistId: Scalars['String']['input'];
};


export type MutationRemoveMemberArgs = {
  id: Scalars['String']['input'];
};


export type MutationReplaceZoneClassPricesArgs = {
  input: ReplaceZoneClassPricesInput;
};


export type MutationSaveHeroArgs = {
  input: SaveHeroInput;
};


export type MutationSaveHeroItemArgs = {
  input: SaveHeroItemInput;
};


export type MutationSaveOrderArgs = {
  input: SaveOrderInput;
};


export type MutationTrackProductViewArgs = {
  productId: Scalars['String']['input'];
  sessionId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateCartItemArgs = {
  quantity?: InputMaybe<Scalars['Int']['input']>;
  selected?: InputMaybe<Scalars['Boolean']['input']>;
  variantId: Scalars['String']['input'];
};


export type MutationUpdateCategoryArgs = {
  input: UpdateCategoryInput;
};


export type MutationUpdateCouponArgs = {
  id: Scalars['String']['input'];
  input: UpdateCouponInput;
};


export type MutationUpdateDeliveryZoneArgs = {
  input: UpdateDeliveryZoneInput;
};


export type MutationUpdateGenericSettingsArgs = {
  input: UpdateGenericSettingsInput;
};


export type MutationUpdateHeroItemArgs = {
  input: SaveHeroItemInput;
  itemId: Scalars['String']['input'];
};


export type MutationUpdateMemberRoleArgs = {
  id: Scalars['String']['input'];
  role: Scalars['String']['input'];
};


export type MutationUpdateNotificationTemplateArgs = {
  input: UpdateNotificationTemplateInput;
};


export type MutationUpdateOrderStatusArgs = {
  id: Scalars['String']['input'];
  status: Scalars['String']['input'];
};


export type MutationUpdateProductArgs = {
  input: UpdateProductInput;
};


export type MutationUpdateReviewArgs = {
  input: UpdateReviewInput;
};


export type MutationUpdateShippingClassArgs = {
  input: UpdateShippingClassInput;
};


export type MutationUpdateStoreArgs = {
  input: UpdateStoreInput;
};

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

export type NotificationTemplateContentInput = {
  bodyHtml?: InputMaybe<Scalars['String']['input']>;
  bodyText?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  subject?: InputMaybe<Scalars['String']['input']>;
};

export type Order = {
  __typename?: 'Order';
  billingAddress?: Maybe<Scalars['String']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  customerId?: Maybe<Scalars['String']['output']>;
  deliveryCity?: Maybe<Scalars['String']['output']>;
  deliveryCountry?: Maybe<Scalars['String']['output']>;
  deliveryMethod?: Maybe<Scalars['String']['output']>;
  deliveryMethodId?: Maybe<Scalars['String']['output']>;
  deliveryZoneId?: Maybe<Scalars['String']['output']>;
  discount?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  insertedAt?: Maybe<Scalars['String']['output']>;
  items: Array<OrderItem>;
  name?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  orderNumber: Scalars['String']['output'];
  paid: Scalars['Boolean']['output'];
  phone?: Maybe<Scalars['String']['output']>;
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

export type OrderEvent = {
  __typename?: 'OrderEvent';
  currency: Scalars['String']['output'];
  orderId: Scalars['String']['output'];
  orderNumber: Scalars['String']['output'];
  status: Scalars['String']['output'];
  storeId: Scalars['String']['output'];
  timestamp: Scalars['String']['output'];
  total: Scalars['String']['output'];
  type: OrderEventTypeGraphQl;
};

export type OrderEventTypeGraphQl =
  | 'ORDER_CREATED'
  | 'ORDER_STATUS_CHANGED'
  | 'PAYMENT_RECEIVED';

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
  price?: Maybe<Scalars['String']['output']>;
  productId?: Maybe<Scalars['String']['output']>;
  productName?: Maybe<Scalars['String']['output']>;
  quantity: Scalars['Int']['output'];
  subtotal?: Maybe<Scalars['String']['output']>;
  variantId?: Maybe<Scalars['String']['output']>;
  variantOptions?: Maybe<Scalars['String']['output']>;
  variantSku?: Maybe<Scalars['String']['output']>;
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
  customerEmail?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  insertedAt?: Maybe<Scalars['String']['output']>;
  metadata?: Maybe<Scalars['String']['output']>;
  orderId: Scalars['String']['output'];
  processedAt?: Maybe<Scalars['String']['output']>;
  provider?: Maybe<Scalars['String']['output']>;
  refundReason?: Maybe<Scalars['String']['output']>;
  refundedAt?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  storeCustomerId?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type PaymentConfirmationInput = {
  metadata?: InputMaybe<Scalars['String']['input']>;
  paymentId: Scalars['String']['input'];
  status: Scalars['String']['input'];
};

export type PaymentConfirmationResult = {
  __typename?: 'PaymentConfirmationResult';
  orderStatus?: Maybe<Scalars['String']['output']>;
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

export type PresignedMedia = {
  __typename?: 'PresignedMedia';
  objectKey: Scalars['String']['output'];
  publicUrl: Scalars['String']['output'];
  uploadUrl: Scalars['String']['output'];
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
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  media?: Maybe<Array<ProductMedia>>;
  metadata?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  options?: Maybe<Array<ProductOption>>;
  priceRange?: Maybe<PriceRange>;
  productType?: Maybe<Scalars['String']['output']>;
  relatedProducts: ProductConnection;
  reviewCount: Scalars['Int']['output'];
  reviewStats?: Maybe<ReviewStats>;
  reviews: ReviewConnection;
  shippingClass?: Maybe<ShippingClass>;
  slug?: Maybe<Scalars['String']['output']>;
  stockStatus: Scalars['String']['output'];
  trackInventory: Scalars['Boolean']['output'];
  variants?: Maybe<Array<ProductVariant>>;
  vendor?: Maybe<Scalars['String']['output']>;
  visibility?: Maybe<Scalars['String']['output']>;
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

export type ProductMedia = {
  __typename?: 'ProductMedia';
  alt?: Maybe<Scalars['String']['output']>;
  displayOrder: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  mimeType?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type ProductMediaGraphQlInput = {
  alt?: InputMaybe<Scalars['String']['input']>;
  displayOrder: Scalars['Int']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  mimeType?: InputMaybe<Scalars['String']['input']>;
  type: Scalars['String']['input'];
  url: Scalars['String']['input'];
};

export type ProductOption = {
  __typename?: 'ProductOption';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  position: Scalars['Int']['output'];
};

export type ProductOptionGraphQlInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  position: Scalars['Int']['input'];
};

export type ProductVariant = {
  __typename?: 'ProductVariant';
  compareToPrice?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  media?: Maybe<Array<ProductMedia>>;
  optionValues?: Maybe<Array<VariantOptionValue>>;
  price?: Maybe<Scalars['String']['output']>;
  sku?: Maybe<Scalars['String']['output']>;
  stockQuantity: Scalars['Int']['output'];
  weight?: Maybe<Scalars['Float']['output']>;
};

export type ProductVariantGraphQlInput = {
  compareToPrice?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  media?: InputMaybe<Array<ProductMediaGraphQlInput>>;
  optionValues?: InputMaybe<Array<VariantOptionValueGraphQlInput>>;
  price?: InputMaybe<Scalars['String']['input']>;
  shippingClassId?: InputMaybe<Scalars['String']['input']>;
  sku?: InputMaybe<Scalars['String']['input']>;
  stockQuantity: Scalars['Int']['input'];
  weight?: InputMaybe<Scalars['Float']['input']>;
};

export type Query = {
  __typename?: 'Query';
  apiKeys: Array<StoreApiKey>;
  cart?: Maybe<Cart>;
  categories: Array<Category>;
  category?: Maybe<Category>;
  checkoutData: CheckoutData;
  coupon?: Maybe<Coupon>;
  couponUsages: Array<CouponUsage>;
  coupons: Array<Coupon>;
  deliveryZone?: Maybe<DeliveryZone>;
  deliveryZones: Array<DeliveryZone>;
  hero?: Maybe<Hero>;
  invitations: Array<StoreInvitation>;
  media: MediaConnection;
  mediaStats: MediaStats;
  members: Array<StoreMember>;
  notificationTemplates: Array<NotificationTemplate>;
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


export type QueryMediaArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryNotificationTemplatesArgs = {
  eventType?: InputMaybe<Scalars['String']['input']>;
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
  limit?: InputMaybe<Scalars['Int']['input']>;
  sessionId?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type RegisterMediaInput = {
  fileName: Scalars['String']['input'];
  mimeType?: InputMaybe<Scalars['String']['input']>;
  objectKey: Scalars['String']['input'];
  size?: InputMaybe<Scalars['Int']['input']>;
  url: Scalars['String']['input'];
};

export type ReplaceZoneClassPricesInput = {
  prices: Array<ClassPriceEntryInput>;
  zoneId: Scalars['String']['input'];
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

export type SaveOrderInput = {
  billingAddress?: InputMaybe<Scalars['String']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  customerId?: InputMaybe<Scalars['String']['input']>;
  deliveryCity?: InputMaybe<Scalars['String']['input']>;
  deliveryCountry?: InputMaybe<Scalars['String']['input']>;
  deliveryMethod?: InputMaybe<Scalars['String']['input']>;
  deliveryMethodId?: InputMaybe<Scalars['String']['input']>;
  discount?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  items?: InputMaybe<Array<SaveOrderItemInput>>;
  name?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  orderNumber?: InputMaybe<Scalars['String']['input']>;
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
  price: Scalars['String']['input'];
  productId: Scalars['String']['input'];
  productName: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
  subtotal: Scalars['String']['input'];
  variantId?: InputMaybe<Scalars['String']['input']>;
  variantOptions?: InputMaybe<Scalars['String']['input']>;
  variantSku?: InputMaybe<Scalars['String']['input']>;
};

export type ShippingClass = {
  __typename?: 'ShippingClass';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type Store = {
  __typename?: 'Store';
  currency?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  domainName?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isInMaintenanceMode?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
};

export type StoreApiKey = {
  __typename?: 'StoreApiKey';
  createdAt?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  prefix: Scalars['String']['output'];
};

export type StoreInvitation = {
  __typename?: 'StoreInvitation';
  createdAt?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  expiresAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
  role: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type StoreMember = {
  __typename?: 'StoreMember';
  acceptedAt?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  invitedAt?: Maybe<Scalars['String']['output']>;
  role: Scalars['String']['output'];
  username?: Maybe<Scalars['String']['output']>;
};

/** All store settings grouped by type. Each JSON string field maps to a settings schema defined on the backend — clients parse with JSON.parse(). */
export type StoreSettings = {
  __typename?: 'StoreSettings';
  /** About page content for your store (JSON) */
  about?: Maybe<Scalars['String']['output']>;
  /** Contact information displayed on your store (JSON) */
  contact?: Maybe<Scalars['String']['output']>;
  /** Configure which currencies customers can view prices in (JSON) */
  currencies?: Maybe<Scalars['String']['output']>;
  /** Delivery settings for checkout (shipping classes) */
  delivery?: Maybe<DeliverySettings>;
  /** Email configuration for storefront customer authentication (JSON) */
  email?: Maybe<Scalars['String']['output']>;
  /** Social media profiles for your store (JSON) */
  social?: Maybe<Scalars['String']['output']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  orderEvents: OrderEvent;
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

export type UpdateDeliveryZoneInput = {
  id: Scalars['String']['input'];
  locations?: InputMaybe<Array<DeliveryZoneLocationInput>>;
  methods?: InputMaybe<Array<DeliveryZoneMethodInput>>;
  name?: InputMaybe<Scalars['String']['input']>;
  position?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateGenericSettingsInput = {
  content: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type UpdateNotificationTemplateInput = {
  channel: Scalars['String']['input'];
  content: NotificationTemplateContentInput;
  eventType: Scalars['String']['input'];
};

export type UpdateProductInput = {
  allowBackorder?: InputMaybe<Scalars['Boolean']['input']>;
  brand?: InputMaybe<Scalars['String']['input']>;
  deliveryZoneIds?: InputMaybe<Array<Scalars['String']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  lowStockThreshold?: InputMaybe<Scalars['Int']['input']>;
  media?: InputMaybe<Array<ProductMediaGraphQlInput>>;
  metadata?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  options?: InputMaybe<Array<ProductOptionGraphQlInput>>;
  outOfStockThreshold?: InputMaybe<Scalars['Int']['input']>;
  productType?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  trackInventory?: InputMaybe<Scalars['Boolean']['input']>;
  variants?: InputMaybe<Array<ProductVariantGraphQlInput>>;
  vendor?: InputMaybe<Scalars['String']['input']>;
  visibility?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateReviewInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  media?: InputMaybe<Array<ReviewMediaInput>>;
  productId: Scalars['String']['input'];
  rating?: InputMaybe<Scalars['Int']['input']>;
  reviewId: Scalars['String']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateShippingClassInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  position?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateStoreInput = {
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  domain?: InputMaybe<Scalars['String']['input']>;
  isInMaintenanceMode?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  visibility?: InputMaybe<Scalars['String']['input']>;
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

export type VariantOptionValue = {
  __typename?: 'VariantOptionValue';
  optionId: Scalars['String']['output'];
  optionName: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type VariantOptionValueGraphQlInput = {
  optionId: Scalars['String']['input'];
  value: Scalars['String']['input'];
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
