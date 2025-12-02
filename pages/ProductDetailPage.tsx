
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Product, ProductSize } from '../types';
import { MOCK_PRODUCTS } from '../data/mockData';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // const { addToCart } = useCart(); // Removed for static site
  
  // Use mock data directly
  const product = MOCK_PRODUCTS.find(p => p.id === id || p._id === id);
  const loading = false;
  const error = !product ? 'Product not found' : null;

  /*
  // API fetching removed for static site
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  */

  const [selectedColor, setSelectedColor] = useState(product?.variants[0]?.color || '');
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(product?.variants[0]?.imageIndex || 0);

  /*
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      try {
        const data = await fetchProductById(id);
        setProduct(data);
        if (data.variants.length > 0) {
          setSelectedColor(data.variants[0].color);
          setActiveImageIndex(data.variants[0].imageIndex);
        }
      } catch (err) {
        setError('Failed to load product');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);
  */

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return <div className="text-center py-20 text-red-500">{error || 'Product not found.'}</div>;
  }

  const selectedVariant = product.variants.find(v => v.color === selectedColor);
  
  /*
  const handleAddToCart = () => {
    if (!selectedSize) {
      setNotification('Please select a size.');
      setTimeout(() => setNotification(''), 3000);
      return;
    }
    if (!selectedColor) {
      setNotification('Please select a color.');
       setTimeout(() => setNotification(''), 3000);
      return;
    }
    
    addToCart(product, selectedSize, selectedColor, quantity);
    setNotification(`${product.name} added to cart!`);
    setTimeout(() => {
        setNotification('');
    }, 3000);
  };
  */

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div>
          <div className="aspect-square bg-gray-900 rounded-lg overflow-hidden">
            <img src={product.images[activeImageIndex]} alt={`${product.name} - Image ${activeImageIndex + 1}`} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {product.images.map((img, index) => (
                <div 
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`aspect-square bg-gray-800 rounded-md overflow-hidden cursor-pointer ${activeImageIndex === index ? 'ring-2 ring-white' : ''}`}>
                 <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover"/>
                </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">{product.name}</h1>
          <p className="text-2xl mt-4">${product.price.toFixed(2)}</p>
          <p className="mt-6 text-gray-300">{product.description}</p>
          
          <div className="mt-8">
            {/* Color Selector */}
            <div>
              <h3 className="text-sm font-medium text-gray-400">Color: <span className="text-white font-semibold">{selectedColor}</span></h3>
              <div className="flex items-center space-x-3 mt-2">
                {product.variants.map(variant => (
                  <button
                    key={variant.color}
                    onClick={() => { 
                      setSelectedColor(variant.color); 
                      setSelectedSize(null);
                      setActiveImageIndex(variant.imageIndex);
                    }}
                    className={`h-8 w-8 rounded-full border-2 transition-all ${selectedColor === variant.color ? 'border-white' : 'border-transparent'}`}
                    style={{ backgroundColor: variant.colorHex }}
                    title={variant.color}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-400">Size</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedVariant?.sizes.map(({ size, stock }) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    disabled={stock === 0}
                    className={`px-5 py-2.5 text-sm rounded-md border transition-colors relative ${selectedSize === size ? 'bg-white text-black border-white' : 'bg-transparent border-gray-600 hover:border-white'} ${stock === 0 ? 'border-gray-700 text-gray-700 cursor-not-allowed' : ''}`}
                  >
                    {size}
                    {stock === 0 && <span className="absolute inset-0 flex items-center justify-center text-xs text-gray-500 transform -rotate-12">Sold Out</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Add to Cart Button Removed */}
          {/* 
          <div className="mt-8">
             <button
              onClick={handleAddToCart}
              className="w-full bg-white text-black py-4 px-8 text-lg font-semibold rounded-md hover:bg-gray-200 transition-all duration-300 disabled:bg-gray-500"
              disabled={!selectedSize}
            >
              Add to Cart
            </button>
          </div>
          */}
          
          {/* Contact for Purchase */}
          <div className="mt-8">
            <p className="text-gray-400 mb-4">Interested in this product?</p>
             <a
              href="/#/contact"
              className="block w-full text-center bg-white text-black py-4 px-8 text-lg font-semibold rounded-md hover:bg-gray-200 transition-all duration-300"
            >
              Contact Us to Order
            </a>
          </div>
            {notification && (
                <div className="mt-4 text-center text-green-400">{notification}</div>
            )}
            
            <div className="mt-10">
                <h3 className="text-lg font-semibold">Details</h3>
                <p className="mt-2 text-gray-400">Material: {product.details.material}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
