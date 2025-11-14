import React, { useState, useEffect } from 'react';
import { MOCK_PRODUCTS, MOCK_UPI_DETAILS } from '../data/mockData';
import { Order, Product, PaymentStatus, OrderStatus } from '../types';
import { downloadInvoice } from '../utils/invoiceGenerator';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

type AdminView = 'dashboard' | 'products' | 'orders' | 'settings' | 'analytics' | 'add-product';

const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
};

// --- Sub-components for Admin Page ---

const DashboardView: React.FC<{ orders: Order[], products: Product[] }> = ({ orders, products }) => {
    const totalSales = orders.filter(o => o.paymentStatus === 'Paid').reduce((sum, o) => sum + o.total, 0);
    const pendingOrders = orders.filter(o => o.orderStatus !== 'Delivered').length;
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.variants.some(v => v.sizes.some(s => s.stock < 5))).length;
    
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-gray-400 text-sm font-medium">Total Sales</h3>
                    <p className="text-3xl font-bold mt-2 text-green-400">${totalSales.toFixed(2)}</p>
                </div>
                <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-gray-400 text-sm font-medium">Total Orders</h3>
                    <p className="text-3xl font-bold mt-2">{orders.length}</p>
                </div>
                <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-gray-400 text-sm font-medium">Products</h3>
                    <p className="text-3xl font-bold mt-2">{totalProducts}</p>
                </div>
                <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-gray-400 text-sm font-medium">Low Stock</h3>
                    <p className="text-3xl font-bold mt-2 text-red-400">{lowStockProducts}</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Sales Chart */}
                <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-semibold mb-4">Monthly Sales</h3>
                    <div className="h-64">
                        <Bar
                            data={{
                                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                                datasets: [{
                                    label: 'Sales ($)',
                                    data: [
                                        orders.filter(o => new Date(o.createdAt).getMonth() === 0 && o.paymentStatus === 'Paid').reduce((sum, o) => sum + o.total, 0),
                                        orders.filter(o => new Date(o.createdAt).getMonth() === 1 && o.paymentStatus === 'Paid').reduce((sum, o) => sum + o.total, 0),
                                        orders.filter(o => new Date(o.createdAt).getMonth() === 2 && o.paymentStatus === 'Paid').reduce((sum, o) => sum + o.total, 0),
                                        orders.filter(o => new Date(o.createdAt).getMonth() === 3 && o.paymentStatus === 'Paid').reduce((sum, o) => sum + o.total, 0),
                                        orders.filter(o => new Date(o.createdAt).getMonth() === 4 && o.paymentStatus === 'Paid').reduce((sum, o) => sum + o.total, 0),
                                        orders.filter(o => new Date(o.createdAt).getMonth() === 5 && o.paymentStatus === 'Paid').reduce((sum, o) => sum + o.total, 0)
                                    ],
                                    backgroundColor: 'rgba(34, 197, 94, 0.8)',
                                    borderColor: 'rgba(34, 197, 94, 1)',
                                    borderWidth: 1
                                }]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { labels: { color: '#fff' } } },
                                scales: {
                                    x: { ticks: { color: '#9CA3AF' }, grid: { color: '#374151' } },
                                    y: { ticks: { color: '#9CA3AF' }, grid: { color: '#374151' } }
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Payment Status Chart */}
                <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-semibold mb-4">Payment Status</h3>
                    <div className="h-64">
                        <Doughnut
                            data={{
                                labels: ['Paid', 'Awaiting', 'Failed'],
                                datasets: [{
                                    data: [
                                        orders.filter(o => o.paymentStatus === 'Paid').length,
                                        orders.filter(o => o.paymentStatus === 'Awaiting Confirmation').length,
                                        orders.filter(o => o.paymentStatus === 'Failed').length
                                    ],
                                    backgroundColor: ['#22C55E', '#F59E0B', '#EF4444'],
                                    borderColor: ['#16A34A', '#D97706', '#DC2626'],
                                    borderWidth: 2
                                }]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'bottom',
                                        labels: { color: '#fff', padding: 20 }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                    <div className="space-y-3">
                        {orders.slice(0, 5).map(order => (
                            <div key={order.id} className="flex justify-between items-center py-2 border-b border-gray-700">
                                <div>
                                    <p className="font-medium">{order.customer.customerName}</p>
                                    <p className="text-sm text-gray-400">{order.id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">${order.total.toFixed(2)}</p>
                                    <p className={`text-sm ${order.paymentStatus === 'Paid' ? 'text-green-400' : 'text-yellow-400'}`}>
                                        {order.paymentStatus}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-semibold mb-4">Top Products</h3>
                    <div className="space-y-3">
                        {products.slice(0, 5).map(product => (
                            <div key={product.id} className="flex justify-between items-center py-2 border-b border-gray-700">
                                <div>
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-sm text-gray-400">{product.category}</p>
                                </div>
                                <p className="font-medium">${product.price.toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProductsView: React.FC<{ products: Product[], setProducts: (p: Product[]) => void, setActiveView: (v: AdminView) => void }> = ({ products, setProducts, setActiveView }) => {
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [editPrice, setEditPrice] = useState('');

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            const updatedProducts = products.filter(p => p.id !== id);
            setProducts(updatedProducts);
            
            // Auto-sync to database
            try {
                const product = products.find(p => p.id === id);
                if (product) {
                    await fetch(`http://localhost:3001/api/products/${product._id || id}`, {
                        method: 'DELETE'
                    });
                    console.log('Product deleted from database');
                }
            } catch (error) {
                console.error('Failed to delete product from database:', error);
            }
        }
    }
    
    const handleEditPrice = (product: Product) => {
        setEditingProduct(product);
        setEditPrice(product.price.toString());
    }
    
    const savePrice = async () => {
        if (editingProduct) {
            const updatedProducts = products.map(p => 
                p.id === editingProduct.id ? {...p, price: parseFloat(editPrice)} : p
            );
            setProducts(updatedProducts);
            
            // Auto-sync to database
            try {
                await fetch('http://localhost:3001/api/sync-data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ products: updatedProducts, orders: [] })
                });
                console.log('Product price updated in database');
            } catch (error) {
                console.error('Failed to sync product to database:', error);
            }
            
            setEditingProduct(null);
        }
    }
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Product Management</h2>
                <button 
                    onClick={() => setActiveView('add-product')}
                    className="bg-white text-black px-6 py-2 rounded-md font-semibold hover:bg-gray-200"
                >
                    Add New Product
                </button>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-700/50 border-b border-gray-600">
                        <tr>
                            <th className="p-4 font-semibold">Product</th>
                            <th className="p-4 font-semibold">Category</th>
                            <th className="p-4 font-semibold">Price</th>
                            <th className="p-4 font-semibold">Stock</th>
                            <th className="p-4 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => {
                            const totalStock = product.variants.reduce((sum, v) => 
                                sum + v.sizes.reduce((sizeSum, s) => sizeSum + s.stock, 0), 0
                            );
                            
                            return (
                                <tr key={product.id} className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700/30">
                                    <td className="p-4">
                                        <div className="flex items-center">
                                            <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded mr-3" />
                                            <div>
                                                <p className="font-medium">{product.name}</p>
                                                <p className="text-sm text-gray-400">{product.variants.length} variants</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 capitalize">{product.category}</td>
                                    <td className="p-4">
                                        {editingProduct?.id === product.id ? (
                                            <div className="flex items-center space-x-2">
                                                <input 
                                                    type="number" 
                                                    value={editPrice} 
                                                    onChange={(e) => setEditPrice(e.target.value)}
                                                    className="w-20 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                                                />
                                                <button onClick={savePrice} className="text-green-400 text-sm">Save</button>
                                                <button onClick={() => setEditingProduct(null)} className="text-red-400 text-sm">Cancel</button>
                                            </div>
                                        ) : (
                                            <span>${product.price.toFixed(2)}</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <span className={`${totalStock < 10 ? 'text-red-400' : 'text-green-400'}`}>
                                            {totalStock} units
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button onClick={() => handleEditPrice(product)} className="text-blue-400 hover:underline mr-4 text-sm">Edit Price</button>
                                        <button onClick={() => handleDelete(product.id)} className="text-red-400 hover:underline text-sm">Delete</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const AddProductView: React.FC<{ products: Product[], setProducts: (p: Product[]) => void, setActiveView: (v: AdminView) => void }> = ({ products, setProducts, setActiveView }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: 'boxers' as ProductCategory,
        price: '',
        description: '',
        material: '',
        images: ['', '', '', ''],
        variants: [{
            color: '',
            colorHex: '#000000',
            imageIndex: 0,
            sizes: [
                { size: 'S' as ProductSize, stock: 0 },
                { size: 'M' as ProductSize, stock: 0 },
                { size: 'L' as ProductSize, stock: 0 },
                { size: 'XL' as ProductSize, stock: 0 },
                { size: 'XXL' as ProductSize, stock: 0 }
            ]
        }]
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newProduct: Product = {
            id: `product-${Date.now()}`,
            name: formData.name,
            category: formData.category,
            price: parseFloat(formData.price),
            images: formData.images.filter(img => img.trim() !== ''),
            description: formData.description,
            details: { material: formData.material },
            variants: formData.variants
        };
        
        const updatedProducts = [...products, newProduct];
        setProducts(updatedProducts);
        
        // Auto-sync to database
        try {
            await fetch('http://localhost:3001/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct)
            });
            console.log('New product synced to database');
        } catch (error) {
            console.error('Failed to sync product to database:', error);
        }
        
        setActiveView('products');
    };

    return (
        <div>
            <div className="flex items-center mb-6">
                <button onClick={() => setActiveView('products')} className="text-gray-400 hover:text-white mr-4">
                    ← Back to Products
                </button>
                <h2 className="text-2xl font-bold">Add New Product</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Product Name</label>
                        <input 
                            type="text" 
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                        <select 
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value as ProductCategory})}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                        >
                            <option value="boxers">Boxers</option>
                            <option value="briefs">Briefs</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Price ($)</label>
                        <input 
                            type="number" 
                            step="0.01"
                            required
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Material</label>
                        <input 
                            type="text" 
                            required
                            value={formData.material}
                            onChange={(e) => setFormData({...formData, material: e.target.value})}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                        />
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <textarea 
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 h-24"
                    />
                </div>
                
                <div className="flex justify-end space-x-4">
                    <button type="button" onClick={() => setActiveView('products')} className="px-6 py-2 border border-gray-600 rounded-md hover:bg-gray-700">
                        Cancel
                    </button>
                    <button type="submit" className="bg-white text-black px-6 py-2 rounded-md font-semibold hover:bg-gray-200">
                        Add Product
                    </button>
                </div>
            </form>
        </div>
    );
};

const AnalyticsView: React.FC<{ orders: Order[], products: Product[] }> = ({ orders, products }) => {
    const salesByMonth = orders.reduce((acc, order) => {
        const month = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        acc[month] = (acc[month] || 0) + (order.paymentStatus === 'Paid' ? order.total : 0);
        return acc;
    }, {} as Record<string, number>);
    
    const productSales = products.map(product => {
        const sales = orders.filter(o => o.items.some(item => item.productId === product.id)).length;
        return { name: product.name, sales, revenue: sales * product.price };
    }).sort((a, b) => b.sales - a.sales);

    const categoryData = products.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Analytics & Reports</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Revenue Trend */}
                <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
                    <div className="h-64">
                        <Line
                            data={{
                                labels: Object.keys(salesByMonth),
                                datasets: [{
                                    label: 'Revenue ($)',
                                    data: Object.values(salesByMonth),
                                    borderColor: 'rgba(59, 130, 246, 1)',
                                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                    borderWidth: 3,
                                    fill: true,
                                    tension: 0.4
                                }]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { labels: { color: '#fff' } } },
                                scales: {
                                    x: { ticks: { color: '#9CA3AF' }, grid: { color: '#374151' } },
                                    y: { ticks: { color: '#9CA3AF' }, grid: { color: '#374151' } }
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Product Categories */}
                <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-semibold mb-4">Product Categories</h3>
                    <div className="h-64">
                        <Doughnut
                            data={{
                                labels: Object.keys(categoryData).map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)),
                                datasets: [{
                                    data: Object.values(categoryData),
                                    backgroundColor: ['#8B5CF6', '#06B6D4', '#F59E0B', '#EF4444'],
                                    borderColor: ['#7C3AED', '#0891B2', '#D97706', '#DC2626'],
                                    borderWidth: 2
                                }]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'bottom',
                                        labels: { color: '#fff', padding: 20 }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products Bar Chart */}
                <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-semibold mb-4">Top Products Sales</h3>
                    <div className="h-64">
                        <Bar
                            data={{
                                labels: productSales.slice(0, 5).map(p => p.name.split(' ').slice(0, 2).join(' ')),
                                datasets: [{
                                    label: 'Orders',
                                    data: productSales.slice(0, 5).map(p => p.sales),
                                    backgroundColor: 'rgba(168, 85, 247, 0.8)',
                                    borderColor: 'rgba(168, 85, 247, 1)',
                                    borderWidth: 1
                                }]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { labels: { color: '#fff' } } },
                                scales: {
                                    x: { ticks: { color: '#9CA3AF' }, grid: { color: '#374151' } },
                                    y: { ticks: { color: '#9CA3AF' }, grid: { color: '#374151' } }
                                }
                            }}
                        />
                    </div>
                </div>
                
                <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-semibold mb-4">Product Performance</h3>
                    <div className="space-y-3">
                        {productSales.slice(0, 5).map(product => (
                            <div key={product.name} className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-sm text-gray-400">{product.sales} orders</p>
                                </div>
                                <span className="font-semibold">${product.revenue.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const OrdersView: React.FC<{ orders: Order[], setOrders: (o: Order[]) => void }> = ({ orders, setOrders }) => {
    
    const updateOrderStatus = async (id: string, status: OrderStatus) => {
        const updatedOrders = orders.map(o => o.id === id ? {...o, orderStatus: status} : o);
        setOrders(updatedOrders);
        
        // Auto-sync to database
        try {
            await fetch('http://localhost:3001/api/sync-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ products: [], orders: updatedOrders })
            });
            console.log('Order status updated in database');
        } catch (error) {
            console.error('Failed to sync order status to database:', error);
        }
    }

    const updatePaymentStatus = async (id: string, status: PaymentStatus) => {
        const updatedOrders = orders.map(o => o.id === id ? {...o, paymentStatus: status} : o);
        setOrders(updatedOrders);
        
        // Auto-sync to database
        try {
            await fetch('http://localhost:3001/api/sync-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ products: [], orders: updatedOrders })
            });
            console.log('Payment status updated in database');
        } catch (error) {
            console.error('Failed to sync payment status to database:', error);
        }
    }

    const viewInvoice = (order: Order) => {
        downloadInvoice(order);
    };

    const paymentStatusClasses: Record<PaymentStatus, string> = {
        'Awaiting Confirmation': 'bg-yellow-600/20 text-yellow-400',
        'Paid': 'bg-green-600/20 text-green-400',
        'Failed': 'bg-red-600/20 text-red-400'
    };
    
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Order Management</h2>
            <div className="bg-gray-800/50 rounded-lg overflow-x-auto">
                 <table className="w-full text-left min-w-[1000px]">
                    <thead className="border-b border-gray-700">
                        <tr>
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Payment Status</th>
                            <th className="p-4">Order Status</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(order => (
                            <tr key={order.id} className="border-b border-gray-700 last:border-b-0">
                                <td className="p-4 font-mono text-sm">{order.id}</td>
                                <td className="p-4">{order.customer.customerName}</td>
                                <td className="p-4">${order.total.toFixed(2)}</td>
                                <td className="p-4">
                                    <select value={order.paymentStatus} onChange={(e) => updatePaymentStatus(order.id, e.target.value as PaymentStatus)} className={`rounded-md p-1 bg-transparent border-0 focus:ring-0 ${paymentStatusClasses[order.paymentStatus]}`}>
                                        <option value="Awaiting Confirmation">Awaiting</option>
                                        <option value="Paid">Paid</option>
                                        <option value="Failed">Failed</option>
                                    </select>
                                </td>
                                <td className="p-4">
                                    <select value={order.orderStatus} onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)} className="rounded-md p-1 bg-gray-700 border-gray-600">
                                        <option value="Processing">Processing</option>
                                        <option value="Packed">Packed</option>
                                        <option value="Out for Delivery">Out for Delivery</option>
                                        <option value="Delivered">Delivered</option>
                                    </select>
                                </td>
                                <td className="p-4">
                                    <button 
                                        onClick={() => viewInvoice(order)}
                                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 mr-2"
                                    >
                                        View Invoice
                                    </button>
                                    <span className="text-xs text-gray-400 block mt-1">
                                        Ref: {order.id}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const SettingsView: React.FC = () => {
    const [upiDetails, setUpiDetails] = useLocalStorage('renisUpiDetails', MOCK_UPI_DETAILS);
    
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        // The useLocalStorage hook already saves on change, but this provides explicit save confirmation
        alert("Settings saved!");
    }
    
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">UPI QR Management</h2>
            <form onSubmit={handleSave} className="max-w-lg space-y-6">
                <div>
                    <label htmlFor="upiId" className="block text-sm font-medium text-gray-300">UPI ID</label>
                    <input type="text" name="upiId" value={upiDetails.upiId} onChange={(e) => setUpiDetails({...upiDetails, upiId: e.target.value})} className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm py-2 px-3" />
                </div>
                 <div>
                    <label htmlFor="qrCodeUrl" className="block text-sm font-medium text-gray-300">UPI QR Code Image URL</label>
                    <input type="text" name="qrCodeUrl" value={upiDetails.qrCodeUrl} onChange={(e) => setUpiDetails({...upiDetails, qrCodeUrl: e.target.value})} className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm py-2 px-3" />
                    <img src={upiDetails.qrCodeUrl} alt="QR Preview" className="mt-4 w-40 h-40 rounded-lg"/>
                </div>
                 <button type="submit" className="bg-white text-black px-6 py-2 rounded-md font-semibold">Save Settings</button>
            </form>
        </div>
    );
};


// --- Main Admin Page Component ---

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage('renisAdminAuth', false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState<AdminView>('dashboard');

  const [products, setProducts] = useLocalStorage<Product[]>('renisProducts', MOCK_PRODUCTS);
  const [orders, setOrders] = useLocalStorage<Order[]>('renisOrders', []);
  
  // Sync local storage data to database
  const syncToDatabase = async () => {
    try {
      const localProducts = JSON.parse(localStorage.getItem('renisProducts') || '[]');
      const localOrders = JSON.parse(localStorage.getItem('renisOrders') || '[]');
      
      const response = await fetch('http://localhost:3001/api/sync-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: localProducts, orders: localOrders })
      });
      
      if (response.ok) {
        alert('Data synced to database successfully!');
      } else {
        alert('Failed to sync data to database');
      }
    } catch (error) {
      console.error('Sync error:', error);
      alert('Error syncing data to database');
    }
  };

  const [username, setUsername] = useState('');
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple hardcoded credentials for this mock setup
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gradient-to-b from-[#111111] to-black min-h-screen flex items-center justify-center">
        <div className="w-full max-w-sm p-8 bg-black/50 rounded-lg shadow-2xl backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-center mb-1">Admin Login</h1>
          <h2 className="text-center text-gray-400 mb-6">Renis Store</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username-admin" className="sr-only">Username</label>
              <input 
                id="username-admin"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                className="w-full bg-gray-800 text-white rounded-md p-3 border border-gray-700 focus:ring-1 focus:ring-white"
              />
            </div>
            <div>
              <label htmlFor="password-admin" className="sr-only">Password</label>
              <input 
                id="password-admin"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full bg-gray-800 text-white rounded-md p-3 border border-gray-700 focus:ring-1 focus:ring-white"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-white text-black py-3 rounded-md font-bold hover:bg-gray-200 transition">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  const NavItem: React.FC<{ view: AdminView, label: string }> = ({ view, label }) => (
     <button onClick={() => setActiveView(view)} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeView === view ? 'bg-white text-black' : 'text-gray-300 hover:bg-gray-700'}`}>
        {label}
    </button>
  );

  return (
    <div className="text-white min-h-screen flex">
      <aside className="w-64 bg-black/50 p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-10">RENIS ADMIN</h1>
        <nav className="flex flex-col space-y-2">
            <NavItem view="dashboard" label="Dashboard" />
            <NavItem view="products" label="Products" />
            <NavItem view="analytics" label="Analytics" />
            <NavItem view="orders" label="Orders" />
            <NavItem view="settings" label="Settings" />
        </nav>
        <div className="mt-6 pt-6 border-t border-gray-700">
            <button 
                onClick={syncToDatabase}
                className="w-full text-left px-4 py-2 rounded-md text-sm font-medium text-blue-400 hover:bg-gray-700"
            >
                Sync to Database
            </button>
        </div>
      </aside>
      <main className="flex-1 bg-gradient-to-b from-[#111111] to-black">
        <div className="flex justify-end p-4">
          <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors">
            Logout
          </button>
        </div>
        <div className="p-8 pt-0">
          {activeView === 'dashboard' && <DashboardView orders={orders} products={products} />}
          {activeView === 'products' && <ProductsView products={products} setProducts={setProducts} setActiveView={setActiveView} />}
          {activeView === 'add-product' && <AddProductView products={products} setProducts={setProducts} setActiveView={setActiveView} />}
          {activeView === 'analytics' && <AnalyticsView orders={orders} products={products} />}
          {activeView === 'orders' && <OrdersView orders={orders} setOrders={setOrders} />}
          {activeView === 'settings' && <SettingsView />}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;