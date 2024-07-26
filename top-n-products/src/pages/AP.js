import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AP = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    company: 'AMZ',
    category: 'Laptop',
    minPrice: 1,
    maxPrice: 10000,
    top: 10,
  });

  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://20.244.56.144/test/companies/${filters.company}/categories/${filters.category}/products`, {
          params: {
            top: filters.top,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
          },
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const filteredProducts = products.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div>
      <h1>Top Products</h1>
      <div>
        <label>
          Company:
          <select name="company" onChange={handleFilterChange}>
            <option value="AMZ">AMZ</option>
            <option value="FLP">FLP</option>
            <option value="SNP">SNP</option>
            <option value="HYN">HYN</option>
            <option value="AZO">AZO</option>
          </select>
        </label>
        <label>
          Category:
          <select name="category" onChange={handleFilterChange}>
            <option value="Laptop">Laptop</option>
            <option value="Phone">Phone</option>
            <option value="TV">TV</option>
            <option value="Earphone">Earphone</option>
            {/* Add more categories as needed */}
          </select>
        </label>
        <label>
          Min Price:
          <input type="number" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} />
        </label>
        <label>
          Max Price:
          <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} />
        </label>
      </div>
      <div>
        {filteredProducts.map((product) => (
          <div key={product.productId}>
            <h2>{product.productName}</h2>
            <p>Price: {product.price}</p>
            <p>Rating: {product.rating}</p>
            <p>Discount: {product.discount}%</p>
            <p>Availability: {product.availability}</p>
            <a href={`/product/${product.productId}`}>View Details</a>
          </div>
        ))}
      </div>
      <div>
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>Previous</button>
        <button onClick={() => setPage((prev) => prev + 1)}>Next</button>
      </div>
    </div>
  );
};

export default AP;
