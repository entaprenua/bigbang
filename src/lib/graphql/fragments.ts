export const PRODUCT_FIELDS = `
  fragment ProductFields on Product {
    id
    name
    slug
    description
    visibility
    allowBackorder
    trackInventory
    stockStatus
    averageRating
    reviewCount
    brand
    vendor
    productType
    priceRange { min max }
    media { id url type mimeType alt displayOrder }
    variants {
      id
      price
      compareToPrice
      image
      sku
      stockQuantity
      weight
    }
    metadata
  }
`

export const CATEGORY_FIELDS = `
  fragment CategoryFields on Category {
    id
    name
    slug
    image
    level
    parentId
    path
    children {
      id
      name
      slug
      image
      level
      parentId
      path
    }
  }
`

export const CART_FIELDS = `
  fragment CartFields on Cart {
    id
    subtotal
    total
    cartToken
    email
    items {
      id
      productId
      quantity
      selected
      price
      subtotal
    }
  }
`

export const HERO_FIELDS = `
  fragment HeroFields on Hero {
    id
    name
    displayType
    autoplay
    autoplayInterval
    showIndicators
    showNavigation
    aspectRatio
    maxHeight
    gap
    isActive
    visibility
    startsAt
    endsAt
    metadata
    items {
      id
      sortOrder
      backgroundType
      backgroundImageUrl
      backgroundImageAlt
      backgroundVideoUrl
      backgroundColor
      backgroundGradient
      overlayColor
      overlayOpacity
      title
      titleColor
      subtitle
      subtitleColor
      description
      descriptionColor
      contentPosition
      textAlignment
      ctaText
      ctaUrl
      ctaStyle
      ctaTarget
      ctaTextColor
      ctaBackgroundColor
      ctaSecondaryText
      ctaSecondaryUrl
      ctaSecondaryStyle
      ctaSecondaryTarget
      mobileBackgroundImageUrl
      mobileContentPosition
      hideOnMobile
      hideOnDesktop
      startsAt
      endsAt
      isActive
      metadata
    }
  }
`

export const ORDER_FIELDS = `
  fragment OrderFields on Order {
    id
    orderNumber
    status
    total
    currency
    paid
    trackingNumber
    items {
      productName
      quantity
      price
      subtotal
    }
  }
`

export const REVIEW_FIELDS = `
  fragment ReviewFields on Review {
    id
    rating
    comment
    authorName
    createdAt
    media {
      id
      url
      type
      mimeType
      alt
      displayOrder
    }
  }
`
export const REVIEW_STATS_FIELDS = `
  fragment ReviewStatsFields on ReviewStats {
    averageRating
    totalCount
  }
`

export const WISHLIST_FIELDS = `
  fragment WishlistFields on Wishlist {
    id
    items {
      id
      productId
    }
  }
`

export const STORE_FIELDS = `
  fragment StoreFields on Store {
    id
    name
    currency
    domainName
    description
    isInMaintenanceMode
  }
`
