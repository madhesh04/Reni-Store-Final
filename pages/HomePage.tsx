import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MOCK_CAROUSEL_IMAGES, MOCK_PRODUCTS } from "../data/mockData";
import { Product } from "../types";
import Carousel from "../components/Carousel";

import aboutComfortImage from '../src/assets/images/about-comfort.png';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
  <Link
    to={`/product/${product.id}`}
    className="group block overflow-hidden w-full"
  >
    <div className="relative h-[450px]">
      <img
        src={product.images[0]}
        alt={product.name}
        className="absolute inset-0 h-full w-full object-cover opacity-100 transition-opacity group-hover:opacity-70"
      />
    </div>
    <div className="relative bg-transparent pt-3">
      <h3 className="text-sm text-gray-200 group-hover:underline group-hover:underline-offset-4">
        {product.name}
      </h3>
      <p className="mt-1.5 tracking-wide text-white">
        ${product.price.toFixed(2)}
      </p>
    </div>
  </Link>
);

const HomePage: React.FC = () => {
  // Use mock data directly
  const products = MOCK_PRODUCTS;
  const loading = false;
  const error = null;

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

  const trendingProducts = useMemo(() => products.slice(0, 4), [products]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] text-white">
        <Carousel images={MOCK_CAROUSEL_IMAGES} />
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-center">
          <div className="p-4">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-wider text-white">
              RENIS
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-300">
              Premium Comfort</p>
            <Link
              to="/products"
              className="mt-10 inline-block bg-white text-black px-10 py-4 text-lg font-semibold rounded-md hover:bg-gray-300 transition-all duration-300"
            >
              Shop Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Now Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Trending Now
            </h2>
            <p className="mt-2 text-lg text-gray-400">
              Our most popular styles, chosen by you.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">
                <p>{error}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                {trendingProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="bg-gray-900/50 py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Crafted for Comfort
              </h2>
              <p className="mt-4 text-lg text-gray-400">
                Since 2018, Renis has been dedicated to one simple mission:
                creating premium innerwear that doesn't compromise on comfort or
                style. We believe that what you wear closest to your skin should
                be exceptionally made.
              </p>
              <Link
                to="/about"
                className="mt-8 inline-block text-white font-semibold border-b-2 border-white pb-1 hover:text-gray-300 hover:border-gray-300 transition"
              >
                Learn More About Us
              </Link>
            </div>
            <div>
              <img
                src={aboutComfortImage}
                alt="Comfortable fabric"
                className="rounded-lg shadow-2xl object-cover h-80 w-full"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
