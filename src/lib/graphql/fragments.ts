export const PRODUCT_BASIC_FIELDS = `
  fragment ProductBasicFields on Product {
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
    image
    sku
    price
    compareToPrice
    stockQuantity
    reservedQuantity
    weight
    lowStockThreshold
    outOfStockThreshold
  }
`

export const PRODUCT_DETAIL_FIELDS = `
  fragment ProductDetailFields on Product {
    ...ProductBasicFields
    options
    optionValues
    priceRange { min max }
    reviewStats { averageRating totalCount }
    media { id url type mimeType alt displayOrder }
    metadata
    variants {
      id
      parentId
      price
      compareToPrice
      image
      sku
      stockQuantity
      reservedQuantity
      weight
      optionValues
    }
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
      edges {
        node {
          id
          name
          slug
          image
          level
          parentId
          path
        }
      }
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
      metadata
      product {
        id
        parentId
        slug
        description 
        sku 
        name
        image
        options
        priceRange { min max }
        price
        compareToPrice
        sku
        stockQuantity
        weight
        optionValues
      }
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
    customerId
    orderNumber
    status
    total
    currency
    paid
    trackingNumber
    deliveryMethod
    deliveryLocation
    deliveryZone
    email
    name
    items {
      productName
      quantity
      price
      subtotal
      productSku
      metadata
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
    isInMaintenanceMode
    logoUrl
    faviconUrl
  }
`
