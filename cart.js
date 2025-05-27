document.addEventListener('DOMContentLoaded', () => {
  console.log('Cart system loading...');
  
  // Cart functionality
  const cartItemsList = document.getElementById('cartItemsList');
  const totalAmount = document.getElementById('totalAmount');
  const clearCartBtn = document.getElementById('clearCart');
  const checkoutFormWrapper = document.getElementById('checkoutFormWrapper');
  const showCheckoutFormBtn = document.getElementById('showCheckoutForm');
  const paymentForm = document.getElementById('paymentForm');
  const gcashQRContainer = document.getElementById('gcashQRContainer');
  
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Update cart display
  function updateCartPage() {
    cartItemsList.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
      cartItemsList.innerHTML = `
        <div class="empty-cart">
          <h3>Your cart is empty</h3>
          <p>Add some items to get started</p>
          <button onclick="window.location.href='index.html'" class="btn-primary">
            Continue Shopping
          </button>
        </div>
      `;
      totalAmount.textContent = '0';
      return;
    }

    cart.forEach((item, index) => {
      const li = document.createElement('li');
      li.classList.add('cart-item');
      
      // Get image path
      const imagePath = getImagePath(item.name, item.image);
      
      li.innerHTML = `
        <div class="cart-item-content">
          <div class="item-image">
            <img src="${imagePath}" 
                 alt="${item.name}" 
                 onerror="handleProductImageError(this, '${item.name.replace(/'/g, "\\'")}', '${(item.image || "").replace(/'/g, "\\'")}', ${index})">
            <div style="width:100px;height:100px;background:#444;display:none;align-items:center;justify-content:center;border-radius:8px;color:#888;text-align:center;font-size:12px;padding:5px;">
              ${item.name}
            </div>
          </div>
          <div class="item-details">
            <h3>${item.name}</h3>
            <p class="item-specs">Size: ${item.size || 'N/A'} | Color: ${item.color || 'N/A'}</p>
            <p class="item-price">₱${item.price.toLocaleString()}</p>
          </div>
          <div class="item-controls">
            <div class="quantity-controls">
              <button onclick="updateQuantity(${index}, ${item.qty - 1})" class="qty-btn">-</button>
              <span class="quantity">${item.qty}</span>
              <button onclick="updateQuantity(${index}, ${item.qty + 1})" class="qty-btn">+</button>
            </div>
            <button onclick="window.removeItem(${index})" class="remove-btn">Remove</button>
          </div>
        </div>
      `;

      cartItemsList.appendChild(li);
      total += item.price * item.qty;
    });

    totalAmount.textContent = total.toLocaleString();
    
    // Update cart counter
    const cartCounter = document.getElementById('cartCounter');
    if (cartCounter) {
      cartCounter.textContent = cart.length;
      cartCounter.style.display = cart.length > 0 ? 'flex' : 'none';
    }
  }

  // Enhanced image mapping function with comprehensive fallbacks
function getImagePath(productName, originalImage) {
  // Comprehensive image mapping with multiple variations and fallbacks
  const imageMap = {
    // Merrel variations
    'Merrel': ['image.png', 'merrel.jpg', 'merrel.webp', 'merrel.png'],
    'merrel': ['image.png', 'merrel.jpg', 'merrel.webp'],

    // Vans variations
    'Old Scool Vans': ['old skul.webp', 'old-school-vans.jpg', 'vans-old-school.webp', 'vans.jpg'],
    'Old School Vans': ['old skul.webp', 'old-school-vans.jpg', 'vans.jpg'],
    'Vans Old School': ['old skul.webp', 'vans-old-school.webp', 'vans.jpg'],
    'vans': ['old skul.webp', 'vans.jpg', 'vans.webp'],

    // Adidas variations
    'Continental 80': ['kiw.png', 'continental-80.jpg', 'adidas-continental.webp', 'continental.jpg'],
    'Stan smith': ['oo.jpg', 'stan-smith.jpg', 'adidas-stan-smith.webp', 'stansmith.jpg'],
    'Stan Smith': ['oo.jpg', 'stan-smith.jpg', 'stansmith.jpg'],
    'VL court 3.0': ['VL court 3.0.jpg', 'vl-court.jpg', 'adidas-vl-court.webp', 'vlcourt.jpg'],
    'VL Court 3.0': ['VL court 3.0.jpg', 'vl-court.jpg', 'vlcourt.jpg'],

    // Converse variations
    'Converse pro blaze': ['converse.jpg', 'converse-pro-blaze.jpg', 'converse-pro.webp', 'pro-blaze.jpg'],
    'Converse Pro Blaze': ['converse.jpg', 'converse-pro-blaze.jpg', 'pro-blaze.jpg'],
    'Converse All Star': ['converse.jpg', 'converse-all-star.jpg', 'all-star.webp', 'allstar.jpg'],
    'converse': ['converse.jpg', 'converse-classic.jpg', 'converse.webp'],

    // Nike variations
    'Nike Airforce 1': ['nike airforce 1.jpg', 'nike-airforce-1.jpg', 'airforce-1.webp', 'af1.jpg'],
    'Nike Air Force 1': ['nike airforce 1.jpg', 'nike-airforce-1.jpg', 'af1.jpg'],
    'Air Force 1': ['nike airforce 1.jpg', 'airforce-1.jpg', 'af1.jpg'],
    'Cortez': ['cortez.jpg', 'nike-cortez.jpg', 'cortez.webp', 'nike-cortez.webp'],
    'Nike Cortez': ['cortez.jpg', 'nike-cortez.jpg', 'nike-cortez.webp'],

    // Jordan variations
    'Jordan 1': ['Jordan 1.jpg', 'jordan-1.jpg', 'air-jordan-1.webp', 'jordan1.jpg'],
    'Air Jordan 1': ['Jordan 1.jpg', 'jordan-1.jpg', 'jordan1.jpg'],
    'jordan': ['Jordan 1.jpg', 'jordan.jpg', 'jordan.webp'],

    // Under Armour variations
    'Charge Pursuit 3': ['Charged pursuit 3.jpg', 'charge-pursuit-3.jpg', 'ua-charge.webp', 'pursuit3.jpg'],
    'Charged Pursuit 3': ['Charged pursuit 3.jpg', 'charge-pursuit-3.jpg', 'pursuit3.jpg'],

    // Onitsuka Tiger variations
    'Onitsuka tiger mexico 66': [
      'Onitsuka tiger mexico 67.jpg',
      'onitsuka-mexico-66.jpg',
      'tiger-mexico.webp',
      'mexico66.jpg',
    ],
    'Onitsuka Tiger Mexico 66': ['Onitsuka tiger mexico 67.jpg', 'onitsuka-mexico-66.jpg', 'mexico66.jpg'],
    'Mexico 66': ['Onitsuka tiger mexico 67.jpg', 'mexico-66.jpg', 'mexico66.jpg'],

    // Fred Perry variations
    'Fred Perry Mens': ['Fred Perry Mens B721.jpg', 'fred-perry-mens.jpg', 'fred-perry.webp', 'fredperry.jpg'],
    "Fred Perry Men's": ['Fred Perry Mens B721.jpg', 'fred-perry-mens.jpg', 'fredperry.jpg'],
    'Fred Perry': ['Fred Perry Mens B721.jpg', 'fred-perry.jpg', 'fredperry.jpg'],

    // New Balance variations
    'New Balance': ['New Balance.jpg', 'new-balance.jpg', 'nb.webp', 'newbalance.jpg'],
    'new balance': ['New Balance.jpg', 'new-balance.jpg', 'newbalance.jpg'],

    // Lakai variations
    'Lakai Cambridge': ['Lakai Cambridge.webp', 'lakai-cambridge.jpg', 'lakai.webp', 'cambridge.jpg'],
    'lakai': ['Lakai Cambridge.webp', 'lakai.jpg', 'lakai.webp'],

    // Generic/Brand variations
    'Korean Black Sports': ['Korean Black Sports.webp', 'korean-sports.jpg', 'black-sports.webp', 'korean-black.jpg'],
    'Rubber Sneakers': ['Rubber Sneakers.webp', 'rubber-sneakers.jpg', 'sneakers.webp', 'rubber.jpg'],
    'Corolla': ['Corolla.webp', 'corolla.jpg', 'corolla.png', 'corolla.jpeg'],
    'Sole Rubber Sneaker': ['Sole Rubber Sneaker.webp', 'sole-rubber.jpg', 'rubber-sole.webp', 'sole-sneaker.jpg'],
    'YOTO New 2024': ['YOTO New 2024.webp', 'yoto-2024.jpg', 'yoto.webp', 'yoto2024.jpg'],
    'Camel Sports': ['Camel Sports.webp', 'camel-sports.jpg', 'camel.webp', 'camel.jpg'],
    'GT Cut Cross': ['images/GT Cut Cross.webp', 'gt-cut-cross.jpg', 'gt-cut.webp', 'gtcut.jpg'],
    'Sabrina 2': ['Sabrina 2.webp', 'sabrina-2.jpg', 'sabrina.webp', 'sabrina2.jpg'],
  };

  // First try exact match
  if (imageMap[productName]) {
    return imageMap[productName][0];
  }

  // Try case-insensitive match
  const lowerProductName = productName.toLowerCase();
  for (const [key, value] of Object.entries(imageMap)) {
    if (key.toLowerCase() === lowerProductName) {
      return value[0];
    }
  }

  // Try partial match (contains)
  for (const [key, value] of Object.entries(imageMap)) {
    if (key.toLowerCase().includes(lowerProductName) || lowerProductName.includes(key.toLowerCase())) {
      return value[0];
    }
  }

  // Return original image or placeholder
  return originalImage || 'placeholder.jpg';
}

// Enhanced image error handler with multiple fallbacks
window.handleProductImageError = (img, productName, originalImage, itemIndex) => {
  console.log(`Image failed for product: ${productName}`);

  // Get all possible image paths for this product
  const allPossibleImages = getAllImagePaths(productName, originalImage);

  // Try next image in the list
  const currentSrc = img.src.split("/").pop(); // Get filename only
  let currentIndex = allPossibleImages.findIndex((path) => path.includes(currentSrc));

  // If current image not found in list, start from beginning
  if (currentIndex === -1) currentIndex = 0;

  const nextIndex = currentIndex + 1;

  if (nextIndex < allPossibleImages.length) {
    console.log(`Trying fallback image: ${allPossibleImages[nextIndex]}`);
    img.src = allPossibleImages[nextIndex];

    // Set up error handler for next attempt
    img.onerror = function () {
      window.handleProductImageError(this, productName, originalImage, itemIndex);
    };
  } else {
    // All images failed, show fallback
    console.log(`All images failed for: ${productName}. Tried: ${allPossibleImages.join(", ")}`);
    img.style.display = "none";
    const fallback = img.nextElementSibling;
    if (fallback && fallback.style) {
      fallback.style.display = "flex";
    }
  }
};

// Get all possible image paths for a product
function getAllImagePaths(productName, originalImage) {
  const imageMap = {
    'Merrel': ['image.png', 'merrel.jpg', 'merrel.webp', 'merrel.png'],
    'Old Scool Vans': ['old skul.webp', 'old-school-vans.jpg', 'vans-old-school.webp', 'vans.jpg'],
    'Continental 80': ['kiw.png', 'continental-80.jpg', 'adidas-continental.webp', 'continental.jpg'],
    'Stan smith': ['oo.jpg', 'stan-smith.jpg', 'adidas-stan-smith.webp', 'stansmith.jpg'],
    'Converse pro blaze': ['converse.jpg', 'converse-pro-blaze.jpg', 'converse-pro.webp', 'pro-blaze.jpg'],
    'Nike Airforce 1': ['nike airforce 1.jpg', 'nike-airforce-1.jpg', 'airforce-1.webp', 'af1.jpg'],
    'Cortez': ['cortez.jpg', 'nike-cortez.jpg', 'cortez.webp', 'nike-cortez.webp'],
    'Jordan 1': ['Jordan 1.jpg', 'jordan-1.jpg', 'air-jordan-1.webp', 'jordan1.jpg'],
    'VL court 3.0': ['VL court 3.0.jpg', 'vl-court.jpg', 'adidas-vl-court.webp', 'vlcourt.jpg'],
    'Charge Pursuit 3': ['Charged pursuit 3.jpg', 'charge-pursuit-3.jpg', 'ua-charge.webp', 'pursuit3.jpg'],
    'Onitsuka tiger mexico 66': [
      'Onitsuka tiger mexico 67.jpg',
      'onitsuka-mexico-66.jpg',
      'tiger-mexico.webp',
      'mexico66.jpg',
    ],
    'Fred Perry Mens': ['Fred Perry Mens B721.jpg', 'fred-perry-mens.jpg', 'fred-perry.webp', 'fredperry.jpg'],
    'New Balance': ['New Balance.jpg', 'new-balance.jpg', 'nb.webp', 'newbalance.jpg'],
    'Lakai Cambridge': ['Lakai Cambridge.webp', 'lakai-cambridge.jpg', 'lakai.webp', 'cambridge.jpg'],
    'Converse All Star': ['converse.jpg', 'converse-all-star.jpg', 'all-star.webp', 'allstar.jpg'],
    'Korean Black Sports': ['Korean Black Sports.webp', 'korean-sports.jpg', 'black-sports.webp', 'korean-black.jpg'],
    'Rubber Sneakers': ['Rubber Sneakers.webp', 'rubber-sneakers.jpg', 'sneakers.webp', 'rubber.jpg'],
    'Corolla': ['Corolla.webp', 'corolla.jpg', 'corolla.png', 'corolla.jpeg'],
    'Sole Rubber Sneaker': ['Sole Rubber Sneaker.webp', 'sole-rubber.jpg', 'rubber-sole.webp', 'sole-sneaker.jpg'],
    'YOTO New 2024': ['YOTO New 2024.webp', 'yoto-2024.jpg', 'yoto.webp', 'yoto2024.jpg'],
    'Camel Sports': ['Camel Sports.webp', 'camel-sports.jpg', 'camel.webp', 'camel.jpg'],
    'GT Cut Cross': ['images/GT Cut Cross.webp', 'gt-cut-cross.jpg', 'gt-cut.webp', 'gtcut.jpg'],
    'Sabrina 2': ['Sabrina 2.webp', 'sabrina-2.jpg', 'sabrina.webp', 'sabrina2.jpg'],
  };

  // Get images for this product
  let images = imageMap[productName] || [];

  // Try case-insensitive match if exact match fails
  if (images.length === 0) {
    const lowerProductName = productName.toLowerCase();
    for (const [key, value] of Object.entries(imageMap)) {
      if (key.toLowerCase() === lowerProductName) {
        images = [...value];
        break;
      }
    }
  }

  // Try partial match if still no images
  if (images.length === 0) {
    const lowerProductName = productName.toLowerCase();
    for (const [key, value] of Object.entries(imageMap)) {
      if (key.toLowerCase().includes(lowerProductName) || lowerProductName.includes(key.toLowerCase())) {
        images = [...value];
        break;
      }
    }
  }

  // Add original image if provided
  if (originalImage && !images.includes(originalImage)) {
    images.unshift(originalImage);
  }

  // Add generic fallbacks
  images.push('placeholder.jpg', 'no-image.png', 'default-shoe.jpg', 'shoe-placeholder.webp');

  return images;
}

  // Cart functions
  window.updateQuantity = function(index, newQty) {
    if (newQty <= 0) {
      window.removeItem(index);
      return;
    }
    cart[index].qty = newQty;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartPage();
  };

  // Declare removeItem function globally
  window.removeItem = function(index) {
    if (confirm('Remove this item from cart?')) {
      cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartPage();
    }
  };

  // Clear cart button
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Cart is already empty');
        return;
      }
      
      if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartPage();
      }
    });
  }

  // Show checkout form button
  if (showCheckoutFormBtn && checkoutFormWrapper) {
    showCheckoutFormBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
      }
      checkoutFormWrapper.style.display = "block";
      showCheckoutFormBtn.style.display = "none";
    });
  }

  // Payment form submission
  if (paymentForm) {
    paymentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log('Payment form submitted');
      
      const formData = new FormData(paymentForm);
      const selectedMethod = formData.get('payment');
      
      console.log('Selected payment method:', selectedMethod);

      if (!selectedMethod) {
        alert('Please select a payment method');
        return;
      }

      const total = totalAmount.textContent || '0';
      console.log('Total amount:', total);

      // Process payment based on method
      switch (selectedMethod) {
        case 'gcash':
          showQRCode('GCash', 'Gcash-BMA-QRcode.jpg', '#007bff', total);
          break;
        case 'paymaya':
          showQRCode('PayMaya', 'paymayaqrcode.png', '#00d4aa', total);
          break;
        case 'credit-card':
          showQRCode('Credit Card', 'creditQR.png', '#6f42c1', total);
          break;
        case 'debit-card':
          showQRCode('Debit Card', 'debitqr.webp', '#fd7e14', total);
          break;
        case 'cod':
          console.log('COD selected');
          showCODOption(total);
          break;
        default:
          alert('Payment method not supported yet');
      }
    });
  }

  // QR Code display function
  function showQRCode(label, imgSrc, color, total) {
    console.log(`Showing QR for ${label}`);
    
    if (gcashQRContainer) {
      gcashQRContainer.style.display = 'block';
      gcashQRContainer.innerHTML = `
        <div style="text-align: center; padding: 20px; background: white; border-radius: 12px; border: 3px solid ${color}; margin: 20px 0; color: black;">
          <div style="background: ${color}; color: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 20px; font-weight: bold;">
            🔍 Scan ${label} QR Code
          </div>
          
          <div style="margin: 20px 0;">
            <img src="${imgSrc}" alt="${label} QR Code" style="width: 250px; height: 250px; object-fit: contain; border: 3px solid ${color}; border-radius: 12px; background: white; padding: 15px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div style="display: none; width: 250px; height: 250px; background: #f8f9fa; border: 3px dashed ${color}; border-radius: 12px; margin: 0 auto; align-items: center; justify-content: center; flex-direction: column; color: ${color}; font-weight: bold;">
              <div style="font-size: 24px; margin-bottom: 10px;">📱</div>
              <div style="font-size: 16px; margin-bottom: 5px;">${label}</div>
              <div style="font-size: 14px; color: #666;">QR Code Not Found</div>
            </div>
          </div>

          <div style="background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 20px; border-radius: 10px; margin: 20px 0; font-size: 20px; font-weight: bold;">
            💰 Amount to Pay: ₱${total}
          </div>

          <div style="margin-top: 20px;">
            <button onclick="completePayment('${label}')" style="background: linear-gradient(135deg, #28a745, #20c997); color: white; border: none; padding: 15px 30px; border-radius: 8px; margin: 8px; cursor: pointer; font-size: 16px; font-weight: bold;">
              ✅ Payment Completed
            </button>
            <button onclick="cancelPayment()" style="background: linear-gradient(135deg, #6c757d, #495057); color: white; border: none; padding: 15px 30px; border-radius: 8px; margin: 8px; cursor: pointer; font-size: 16px; font-weight: bold;">
              ❌ Cancel Payment
            </button>
          </div>
        </div>
      `;
    }
    
    alert(`Please scan the ${label} QR code to complete your payment of ₱${total}`);
  }

  // COD Option display function
  function showCODOption(total) {
    console.log('Showing COD option for total:', total);
    
    const codFee = 50;
    const numericTotal = parseFloat(total.replace(/,/g, '')) || 0;
    const totalWithCOD = numericTotal + codFee;

    if (gcashQRContainer) {
      gcashQRContainer.style.display = 'block';
      gcashQRContainer.innerHTML = `
        <div style="text-align: center; padding: 25px; background: linear-gradient(135deg, #fff3cd, #ffeaa7); border-radius: 15px; border: 3px solid #ffc107; margin: 20px 0; color: #212529;">
          <!-- COD Header -->
          <div style="background: linear-gradient(135deg, #ffc107, #ffb300); color: #212529; padding: 20px; border-radius: 10px; margin-bottom: 25px; font-size: 22px; font-weight: bold;">
            💵 Cash on Delivery (COD)
          </div>
          
          <!-- Amount Breakdown -->
          <div style="background: white; padding: 20px; border-radius: 12px; margin: 20px 0; border: 2px solid #ffc107;">
            <div style="color: #495057; font-size: 16px; line-height: 1.8;">
              <div style="display: flex; justify-content: space-between; margin: 12px 0; padding: 8px 0;">
                <span style="font-weight: 500;">Subtotal:</span>
                <strong style="color: #28a745; font-size: 18px;">₱${total}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin: 12px 0; padding: 8px 0;">
                <span style="font-weight: 500;">COD Fee:</span>
                <strong style="color: #ffc107; font-size: 18px;">₱${codFee}</strong>
              </div>
              <hr style="border: 2px solid #ffc107; margin: 15px 0;">
              <div style="display: flex; justify-content: space-between; margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; border: 2px solid #28a745;">
                <span style="font-size: 20px; font-weight: bold; color: #212529;">Total Amount:</span>
                <strong style="font-size: 24px; color: #28a745;">₱${totalWithCOD.toLocaleString()}</strong>
              </div>
            </div>
          </div>

          <!-- COD Instructions -->
          <div style="background: white; padding: 20px; border-radius: 12px; margin: 20px 0; text-align: left; border: 2px solid #e9ecef;">
            <h4 style="margin: 0 0 15px 0; color: #212529; font-size: 18px; text-align: center; padding-bottom: 10px; border-bottom: 2px solid #ffc107;">
              📋 COD Instructions:
            </h4>
            <ul style="margin: 0; padding-left: 25px; color: #495057; line-height: 1.8; font-size: 15px;">
              <li style="margin-bottom: 10px;"><strong style="color: #28a745;">✅ Prepare exact amount:</strong> ₱${totalWithCOD.toLocaleString()} for faster transaction</li>
              <li style="margin-bottom: 10px;"><strong style="color: #007bff;">🚚 Delivery time:</strong> 3-5 business days</li>
              <li style="margin-bottom: 10px;"><strong style="color: #ffc107;">💵 Payment accepted:</strong> Cash only (no cards)</li>
              <li style="margin-bottom: 10px;"><strong style="color: #17a2b8;">📞 Contact:</strong> Our rider will call you before delivery</li>
              <li style="margin-bottom: 10px;"><strong style="color: #6f42c1;">📦 Inspection:</strong> Check your items before payment</li>
            </ul>
          </div>

          <!-- Agreement Checkbox -->
          <div style="background: #e7f3ff; padding: 20px; border-radius: 12px; margin: 20px 0; border: 2px solid #007bff;">
            <label style="display: flex; align-items: center; justify-content: center; cursor: pointer; color: #212529; font-size: 16px; font-weight: 500;">
              <input type="checkbox" id="codAgree" style="margin-right: 12px; transform: scale(1.3); accent-color: #007bff;">
              <span>I agree to pay <strong style="color: #28a745; font-size: 18px;">₱${totalWithCOD.toLocaleString()}</strong> upon delivery</span>
            </label>
          </div>

          <!-- COD Action Buttons -->
          <div style="margin-top: 25px;">
            <button onclick="confirmCOD(${totalWithCOD})" style="background: linear-gradient(135deg, #ffc107, #ffb300); color: #212529; border: none; padding: 15px 30px; border-radius: 8px; margin: 8px; cursor: pointer; font-size: 16px; font-weight: bold;">
              ✅ Confirm COD Order
            </button>
            <button onclick="cancelPayment()" style="background: linear-gradient(135deg, #6c757d, #495057); color: white; border: none; padding: 15px 30px; border-radius: 8px; margin: 8px; cursor: pointer; font-size: 16px; font-weight: bold;">
              ❌ Cancel Order
            </button>
          </div>
        </div>
      `;
    }
    
    alert(`Cash on Delivery selected!\nTotal: ₱${totalWithCOD.toLocaleString()} (including ₱${codFee} COD fee)`);
  }

  // Global functions for payment buttons
  window.completePayment = function(paymentMethod) {
    const transactionId = paymentMethod.replace(/\s+/g, '').toUpperCase().substring(0, 3) + Date.now();
    alert(`✅ ${paymentMethod} payment completed successfully!\n\nTransaction ID: ${transactionId}\nThank you for your payment!`);
    
    // Clear cart and reset
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartPage();
    
    // Hide containers
    if (gcashQRContainer) gcashQRContainer.style.display = 'none';
    if (checkoutFormWrapper) checkoutFormWrapper.style.display = 'none';
    if (showCheckoutFormBtn) showCheckoutFormBtn.style.display = 'block';
  };

  window.confirmCOD = function(totalAmount) {
    const codAgree = document.getElementById('codAgree');
    
    if (!codAgree || !codAgree.checked) {
      alert('❌ Please agree to the COD terms before confirming your order.');
      return;
    }

    const orderNumber = 'COD' + Date.now();
    alert(`✅ COD Order Confirmed!\n\nOrder Number: ${orderNumber}\nTotal Amount: ₱${totalAmount.toLocaleString()}\nDelivery: 3-5 business days\n\nThank you for your order!\nOur rider will contact you soon.`);
    
    // Clear cart and reset
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartPage();
    
    // Hide containers
    if (gcashQRContainer) gcashQRContainer.style.display = 'none';
    if (checkoutFormWrapper) checkoutFormWrapper.style.display = 'none';
    if (showCheckoutFormBtn) showCheckoutFormBtn.style.display = 'block';
  };

  window.cancelPayment = function() {
    if (gcashQRContainer) gcashQRContainer.style.display = 'none';
    alert('❌ Payment cancelled. You can select a different payment method or try again.');
  };

  // Initialize the cart page
  updateCartPage();
  
  console.log('Cart system loaded successfully');
});