// Helper rout to retrieve Amazon product metadata.
const express = require('express');

const router = new express.Router();

router.all('/product-api', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');

  console.log('ASIN ID', req.query.asin);
  // Amazon Product API Integration
  const amazon = require('amazon-product-api');
  const client = amazon.createClient({
    awsId: process.env.AWS_ID,
    awsSecret: process.env.AWS_SECRET,
    awsTag: process.env.AWS_TAG,
  });
  await client.itemLookup({
    idType: 'ASIN',
    itemId: req.query.asin,
    responseGroup: 'ItemAttributes,Offers,Images'
  }).then((results) => {
    Object.keys(results).forEach((key) => {
      res.send({
        image: results[key].LargeImage[0].URL[0],
        title: results[key].ItemAttributes[0].Title[0],
        price: results[key].ItemAttributes[0].ListPrice[0].FormattedPrice[0],
      });
    });
  }).catch((err) => {
    console.log(err);
  });
});

module.exports = router;
