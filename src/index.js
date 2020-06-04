const axios = require("axios");
const baseUrl = "http://wp8m3he1wt.s3-website-ap-southeast-2.amazonaws.com";
const productsUrl = "/api/products/1";
const productCategory = "Air Conditioners";
var totalSumCubicWeight = 0;
var totalProducts = 0;

const cubicWeight = (total, current) =>
  total +
  (current.size.width / 100) *
    (current.size.length / 100) *
    (current.size.height / 100) *
    250;

function filterProducts(data) {
  const products = data.objects.filter(
    item => item.category === productCategory
  );
  const partialSumCubicWeight = products.reduce(cubicWeight, 0);
  const partialItems = products.length;
  totalSumCubicWeight += partialSumCubicWeight;
  totalProducts += partialItems;
}

async function fetchProducts(productUrl) {
  try {
    const response = await axios.get(baseUrl + productUrl);
    const data = response.data;

    filterProducts(data);

    if (data.next !== null) {
      fetchProducts(data.next);
    } else {
      const averageCubicWeight = totalSumCubicWeight / totalProducts;
      console.log(
        `The average Cubic Weight of products belonging to ${productCategory} category is ${averageCubicWeight}kg.`
      );
    }
  } catch (err) {
    console.error(err);
  }
}

fetchProducts(productsUrl);
