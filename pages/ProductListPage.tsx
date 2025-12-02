import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Product, ProductSize, ProductCategory } from '../types';
import { MOCK_PRODUCTS } from '../data/mockData';

const ALL_SIZES: ProductSize[] = ['S', 'M', 'L', 'XL', 'XXL'];
const ALL_CATEGORIES: ProductCategory[] = ['boxers', 'briefs'];

const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
  <Link to={`/product/${product.id}`} className="group block overflow-hidden">
    <div className="relative h-[350px] sm:h-[450px]">
      <img
        src={product.images[0]}
        alt={product.name}
        className="absolute inset-0 h-full w-full object-cover opacity-100 transition-opacity group-hover:opacity-70"
      />
    </div>
    <div className="relative bg-black pt-3">
      <h3 className="text-base text-gray-200 group-hover:underline group-hover:underline-offset-4">
        {product.name}
      </h3>
      <p className="mt-1.5 tracking-wide text-white font-medium">${product.price.toFixed(2)}</p>
    </div>
  </Link>
);


const ProductListPage: React.FC = () => {
  // Use mock data directly
  const products = MOCK_PRODUCTS;
  const loading = false;
  const error = null;

  const [selectedCategories, setSelectedCategories] = useState<Set<ProductCategory>>(new Set());
  const [selectedSizes, setSelectedSizes] = useState<Set<ProductSize>>(new Set());
  const [selectedColors, setSelectedColors] = useState<Set<string>>(new Set());
  const [priceRange, setPriceRange] = useState<number>(100);

  /*
  // API fetching removed for static site
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);
  */

  const allColors = useMemo(() => {
    return Array.from(new Set(products.flatMap(p => p.variants.map(v => v.color))));
  }, [products]);

  const handleCategoryChange = (category: ProductCategory) => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const handleSizeChange = (size: ProductSize) => {
    setSelectedSizes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(size)) {
        newSet.delete(size);
      } else {
        newSet.add(size);
      }
      return newSet;
    });
  };
  
  const handleColorChange = (color: string) => {
    setSelectedColors(prev => {
      const newSet = new Set(prev);
      if (newSet.has(color)) {
        newSet.delete(color);
      } else {
        newSet.add(color);
      }
      return newSet;
    });
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const categoryMatch = selectedCategories.size === 0 || selectedCategories.has(product.category);
      const sizeMatch = selectedSizes.size === 0 || product.variants.some(v => v.sizes.some(s => selectedSizes.has(s.size) && s.stock > 0));
      const colorMatch = selectedColors.size === 0 || product.variants.some(v => selectedColors.has(v.color));
      const priceMatch = product.price <= priceRange;
      return categoryMatch && sizeMatch && colorMatch && priceMatch;
    });
  }, [products, selectedCategories, selectedSizes, selectedColors, priceRange]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Our Collection</h1>
        <p className="mt-2 text-lg text-gray-400">Uncompromising comfort, designed for the modern man.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters */}
        <aside className="lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <div className="space-y-6">
            {/* Category Filter */}
            <div>
              <h3 className="font-medium mb-2">Category</h3>
              <div className="flex flex-wrap gap-2">
                {ALL_CATEGORIES.map(category => (
                  <button key={category} onClick={() => handleCategoryChange(category)} className={`px-4 py-2 text-sm rounded-full border transition-colors capitalize ${selectedCategories.has(category) ? 'bg-white text-black border-white' : 'bg-transparent border-gray-600 hover:border-white'}`}>
                    {category}
                  </button>
                ))}
              </div>
            </div>
            {/* Size Filter */}
            <div>
              <h3 className="font-medium mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {ALL_SIZES.map(size => (
                  <button key={size} onClick={() => handleSizeChange(size)} className={`px-4 py-2 text-sm rounded-full border transition-colors ${selectedSizes.has(size) ? 'bg-white text-black border-white' : 'bg-transparent border-gray-600 hover:border-white'}`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>
            {/* Color Filter */}
            <div>
              <h3 className="font-medium mb-2">Color</h3>
              <div className="flex flex-wrap gap-2">
                 {allColors.map(color => (
                  <button key={color} onClick={() => handleColorChange(color)} className={`px-4 py-2 text-sm rounded-full border transition-colors ${selectedColors.has(color) ? 'bg-white text-black border-white' : 'bg-transparent border-gray-600 hover:border-white'}`}>
                    {color}
                  </button>
                ))}
              </div>
            </div>
             {/* Price Filter */}
            <div>
              <h3 className="font-medium mb-2">Price</h3>
              <input type="range" min="10" max="100" value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
              <div className="text-right text-sm text-gray-400 mt-1">Up to ${priceRange}</div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">
              <p>{error}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
               {filteredProducts.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-xl text-gray-400">No products match your criteria.</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductListPage;
