const fetch = require('node-fetch');

module.exports = {
  name: 'طعام',
  description: 'عرض معلومات عن منتج غذائي من Open Food Facts',
  hasPermission: 0,
  usage: 'معلومات_طعام [اسم المنتج]',
  execute: async (api, event) => {
    const productName = event.body.split(' ')[1];

    if (!productName) {
      api.sendMessage('الرجاء إدخال اسم منتج غذائي للبحث عن معلوماته.', event.threadID, event.messageID);
      return;
    }

    try {
      const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(productName)}&json=1`);
      const data = await response.json();

      if (data.products.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.products.length);
        const product = data.products[randomIndex];

        let message = `المنتج: ${product.product_name}\n`;
        if (product.brands_tags && product.brands_tags.length > 0) {
          message += `العلامة التجارية: ${product.brands_tags.join(', ')}\n`;
        }
        if (product.countries && product.countries_tags.length > 0) {
          message += `الدولة المصنعة: ${product.countries_tags.join(', ')}\n`;
        }
        if (product.ingredients_text) {
          message += `المكونات: ${product.ingredients_text}\n`;
        }
        if (product.nutriments) {
          message += `القيم الغذائية (100 جرام):\n`;
          for (let key in product.nutriments) {
            message += `${key}: ${product.nutriments[key]}\n`;
          }
        }

        api.sendMessage(message, event.threadID, event.messageID);
      } else {
        api.sendMessage('لا توجد نتائج لهذا المنتج.', event.threadID, event.messageID);
      }
    } catch (error) {
      console.error(error);
      api.sendMessage('حدث خطأ أثناء جلب البيانات.', event.threadID, event.messageID);
    }
  }
};