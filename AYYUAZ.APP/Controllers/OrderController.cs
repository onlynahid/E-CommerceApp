using AYYUAZ.APP.Application.Dtos;
using AYYUAZ.APP.Application.Interfaces;
using AYYUAZ.APP.Attributes;
using AYYUAZ.APP.Domain.Entities;
using AYYUAZ.APP.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Mvc;

namespace AYYUAZ.APP.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly IBasketService _basketService;
        private readonly AppDbContext _context;

        public OrderController(IOrderService orderService, IBasketService basketService, AppDbContext context)
        {
            _orderService = orderService;
            _basketService = basketService;
            _context = context;

        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetAllOrders()
        {
            var orders = await _orderService.GetAllOrdersAsync();
            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetOrderById(int id)
        {
            var order = await _orderService.GetOrderByIdAsync(id);
            if (order == null)
            {
                return NotFound($"Order with ID {id} not found.");
            }
            return Ok(order);
        }
        //[HttpPost]
        //public async Task<ActionResult<OrderDto>> CreateOrder([FromBody] CreateOrderDto createOrderDto)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    try
        //    {
        //        var order = await _orderService.CreateOrderAsync(createOrderDto);
        //        return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, order);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new { message = ex.Message });
        //    }
        //}

        [HttpPut("{id}")]
        public async Task<ActionResult<OrderDto>> UpdateOrder(int id, [FromBody] UpdateOrderDto updateOrderDto)
        {
            if (id != updateOrderDto.Id)
            {
                return BadRequest("Order ID mismatch.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var order = await _orderService.UpdateOrderAsync(updateOrderDto);
                if (order == null)
                {
                    return NotFound($"Order with ID {id} not found.");
                }
                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteOrder(int id)
        {
            var result = await _orderService.DeleteOrderAsync(id);
            if (!result)
            {
                return NotFound($"Order with ID {id} not found.");
            }
            return NoContent();
        }
        [HttpPost("{id}/reject")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<OrderDto>> RejectOrder(int id, [FromBody] string rejectedReason = null)
        {
            try
            {
                var order = await _orderService.RejectedOrderAsync(id, rejectedReason);
                if (order == null)
                {
                    return NotFound($"Order with ID {id} not found.");
                }
                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("{id}/accept")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<OrderDto>> AcceptOrder(int id)
        {
            var order = await _orderService.AcceptedOrderAsync(id);
            if (order == null)
            {
                return NotFound($"Order with ID {id} not found.");
            }
            return Ok(order);
        }
        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout(CheckOutDto checkOutDto)
        {
            var basket = await _basketService.GetBasketItemsAsync();
            if (basket == null || !basket.Any())
            {
                return BadRequest("Basket is empty.");
            }
            var order = new Order
            {
                FullName = checkOutDto.FullName,
                Address = checkOutDto.Address,
                Email = checkOutDto.Email,
                PhoneNumber = checkOutDto.PhoneNumber,
                Notes = checkOutDto.Notes,
                CreatedAt = DateTime.UtcNow,
                OrderItems = new List<OrderItem>()

            };
            foreach (var item in basket)
            {
                var product = await _context.Products.FindAsync(item.ProductId);
                if (product == null)
                {
                    continue;
                }
                order.OrderItems.Add(new OrderItem
                {
                    ProductId = product.Id,
                    Quantity = item.Quantity,
                    UnitPrice = product.Price
                });


            }
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            await _basketService.Clear();

            return Ok(new { message = "Created Order", orderId = order.Id });



        }


    }
}


