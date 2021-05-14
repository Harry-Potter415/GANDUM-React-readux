import gql from "graphql-tag";

const PRODUCT_TILE_DATA = gql`
  fragment ProductTile on Product {
    id
    name
    url
    categoryId {
      id
      name
      parentId
      url
      description
      image
      meta
      date
      updated
    }
    brand {
      id
      name
      url
      brand_logo
      meta
      date
      updated
    }
    short_description
    description
    sku
    quantity
    pricing
    feature_image
    gallery_image
    status
    featured_product
    product_type
    shipping
    tax_class
    meta
    custom_field
    attribute
    variant
    variation_master {
      id
      product_id
      combination
      price
      quantity
      sku
      image
      createdAt
      updatedAt
    }
    date
    updated
  }
`;

const GET_CATEGORIES = gql`
  {
    productCategories {
      id
      name
      parentId
      url
      description
      image
      meta
      date
      updated
    }
  }
`;

const GET_CATEGORY = gql`
  query($id: ID!) {
    productCategory(id: $id) {
      id
      name
      parentId
      url
      description
      image
      meta
      date
      updated
    }
  }
`;

const ADD_CATEGORY = gql`
  mutation(
    $name: String
    $parentId: ID
    $url: String
    $description: String
    $image: Upload
    $meta: customObject
  ) {
    addProductCategory(
      name: $name
      parentId: $parentId
      url: $url
      description: $description
      image: $image
      meta: $meta
    ) {
      id
      name
      parentId
      url
      description
      image
      meta
      date
      updated
    }
  }
`;

const UPDATE_CATEGORY = gql`
  mutation(
    $id: ID!
    $name: String
    $parentId: ID
    $url: String
    $description: String
    $update_image: Upload
    $meta: customObject
  ) {
    updateProductCategory(
      id: $id
      name: $name
      parentId: $parentId
      url: $url
      description: $description
      update_image: $update_image
      meta: $meta
    ) {
      id
      name
      parentId
      url
      description
      image
      meta
      date
      updated
    }
  }
`;

const DELETE_CATEGORY = gql`
  mutation($id: ID!) {
    deleteProductCategory(id: $id) {
      id
      name
      parentId
      url
      description
      image
      meta
      date
      updated
    }
  }
`;

const GET_PRODUCTS = gql`
  {
    products {
      ...ProductTile
    }
  }
  ${PRODUCT_TILE_DATA}
`;

const GET_PRODUCT = gql`
  query($id: ID!) {
    product(id: $id) {
      ...ProductTile
    }
  }
  ${PRODUCT_TILE_DATA}
`;

const ADD_PRODUCTS_MANY = gql`
  mutation($products: customArray) {
    ...ProductTile
  }
  ${PRODUCT_TILE_DATA}
`;

const ADD_PRODUCT = gql`
  mutation(
    $name: String
    $url: String
    $categoryId: customArray
    $brand: ID
    $short_description: String
    $description: String
    $sku: String
    $quantity: String
    $pricing: customObject
    $feature_image: Upload
    $gallery_image: Upload
    $status: String
    $featured_product: Boolean
    $product_type: customObject
    $shipping: customObject
    $tax_class: String
    $meta: customObject
    $custom_field: [customObject]
    $attribute: [customObject]
    $variant: customArray
    $combinations: [customObject]
  ) {
    addProduct(
      name: $name
      url: $url
      categoryId: $categoryId
      brand: $brand
      short_description: $short_description
      description: $description
      sku: $sku
      quantity: $quantity
      pricing: $pricing
      feature_image: $feature_image
      gallery_image: $gallery_image
      status: $status
      featured_product: $featured_product
      product_type: $product_type
      shipping: $shipping
      tax_class: $tax_class
      meta: $meta
      custom_field: $custom_field
      attribute: $attribute
      variant: $variant
      combinations: $combinations
    ) {
      ...ProductTile
    }
  }
  ${PRODUCT_TILE_DATA}
`;

const UPDATE_PRODUCT = gql`
  mutation(
    $id: ID!
    $name: String
    $url: String
    $categoryId: customArray
    $brand: ID
    $short_description: String
    $description: String
    $sku: String
    $quantity: String
    $pricing: customObject
    $update_feature_image: Upload
    $update_gallery_image: Upload
    $removed_image: customArray
    $status: String
    $featured_product: Boolean
    $product_type: customObject
    $shipping: customObject
    $tax_class: String
    $meta: customObject
    $custom_field: [customObject]
    $attribute: [customObject]
    $variant: customArray
    $combinations: [customObject]
  ) {
    updateProduct(
      id: $id
      name: $name
      url: $url
      categoryId: $categoryId
      brand: $brand
      short_description: $short_description
      description: $description
      sku: $sku
      quantity: $quantity
      pricing: $pricing
      update_feature_image: $update_feature_image
      update_gallery_image: $update_gallery_image
      removed_image: $removed_image
      status: $status
      featured_product: $featured_product
      product_type: $product_type
      shipping: $shipping
      tax_class: $tax_class
      meta: $meta
      custom_field: $custom_field
      attribute: $attribute
      variant: $variant
      combinations: $combinations
    ) {
      ...ProductTile
    }
  }
  ${PRODUCT_TILE_DATA}
`;

const DELETE_PRODUCT = gql`
  mutation($id: ID!) {
    deleteProduct(id: $id) {
      ...ProductTile
    }
  }
  ${PRODUCT_TILE_DATA}
`;

const DELETE_PRODUCTS_MANY = gql`
  mutation($id: customArray!) {
    deleteProductsMany(ids: $id) {
      id
    }
  }
`;

export {
  GET_CATEGORIES,
  DELETE_PRODUCTS_MANY,
  GET_CATEGORY,
  ADD_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
  GET_PRODUCTS,
  GET_PRODUCT,
  ADD_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
};
