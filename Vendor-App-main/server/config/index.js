const dotenv = require("dotenv");
dotenv.config();
const dev = process.env.NODE_ENV !== "production";
if (dev) {
  global.SHOPIFY_API_SECRET_KEY = process.env.DEV_SHOPIFY_API_SECRET_KEY;
  global.SHOPIFY_API_KEY = process.env.DEV_SHOPIFY_API_KEY;
  global.SHOPIFY_REDIRECT_URI = process.env.DEV_SHOPIFY_REDIRECT_URI;
  global.SHOPIFY_WEBHOOK_URI = process.env.DEV_SHOPIFY_WEBHOOK_URI;
  global.MONGODB_URI = process.env.DEV_MONGODB_URI;
} else {
  global.SHOPIFY_API_SECRET_KEY = process.env.PROD_SHOPIFY_API_SECRET_KEY;
  global.SHOPIFY_API_KEY = process.env.PROD_SHOPIFY_API_KEY;
  global.SHOPIFY_REDIRECT_URI = process.env.PROD_SHOPIFY_REDIRECT_URI;
  global.SHOPIFY_WEBHOOK_URI = process.env.PROD_SHOPIFY_WEBHOOK_URI;
  global.MONGODB_URI = process.env.PROD_MONGODB_URI;
}
global.API_VERSION = "2022-10";
global.SCOPES =
  "write_products,read_products, write_customers,write_draft_orders,write_orders,read_orders,read_customers,read_products,read_fulfillments,write_fulfillments,write_third_party_fulfillment_orders,write_merchant_managed_fulfillment_orders,read_merchant_managed_fulfillment_orders,read_third_party_fulfillment_orders,read_assigned_fulfillment_orders,write_assigned_fulfillment_orders,read_all_orders";
