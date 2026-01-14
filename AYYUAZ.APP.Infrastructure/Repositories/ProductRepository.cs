using AYYUAZ.APP.Domain.Entities;
using AYYUAZ.APP.Domain.Interfaces;
using AYYUAZ.APP.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AYYUAZ.APP.Infrastructure.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _context;
        public ProductRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task AddProductAsync(Product product)
        {
            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();
        }
        public async Task DeleteProductAsync(int productId)
        {
          var product= await _context.Products.FindAsync(productId);
            if(product != null)
            {
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<IEnumerable<Product>> GetAllProductsAsync()
        {
         return await _context.Products
                .Include(c=>c.Category)
                .ToListAsync();  
        }

        public async Task<IEnumerable<Product>> GetByPriceRangeAsync(decimal minPrice, decimal maxPrice)
        {
            return await _context.Products
           .Where(p => p.Price >= minPrice && p.Price <= maxPrice)
            .ToListAsync();
        }

        public async Task<IEnumerable<Product>> GetPagedAsync(int page, int pageSize)
        {
              return await _context.Products
             .OrderBy(p => p.Id)       
             .Skip((page - 1) * pageSize)
              .Take(pageSize)
              .ToListAsync();
        }

        public async Task<Product> GetProductByIdAsync(int productId)
        {
            return await _context.Products
                .Include(c => c.Category)
                .FirstOrDefaultAsync(p => p.Id == productId);
            
        }
        public async Task UpdateProductAsync(Product product)
        {
             _context.Products.Update(product);
            await _context.SaveChangesAsync();
        }
    }
}
