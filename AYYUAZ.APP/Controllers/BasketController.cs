using AYYUAZ.APP.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AYYUAZ.APP.Controllers
{
    [ApiController]
    [Route("api/basket")]
    public class BasketController : ControllerBase
    {
        private readonly IBasketService _basketService;

        public BasketController(IBasketService basketService)
        {
            _basketService = basketService;
        }

        // GET /api/basket
        [HttpGet]
        public async Task<IActionResult> GetBasket()
        {
            var basket = await _basketService.GetBasketItemsAsync();
            return Ok(basket);
        }

        // POST /api/basket/add/5
        [HttpPost("add/{productId}")]
        public async Task<IActionResult> AddToBasket(int productId)
        {
            await _basketService.AddToBasketAsync(productId);
            return Ok(new { message = "Product added to basket." });
        }

        // POST /api/basket/increase/5
        [HttpPost("increase/{productId}")]
        public async Task<IActionResult> Increase(int productId)
        {
            await _basketService.Increase(productId);
            return Ok(new { message = "Product quantity increased." });
        }

        // POST /api/basket/decrease/5
        [HttpPost("decrease/{productId}")]
        public async Task<IActionResult> Decrease(int productId)
        {
            await _basketService.Decrase(productId);
            return Ok(new { message = "Product quantity decreased." });
        }

        // DELETE /api/basket/remove/5
        [HttpDelete("remove/{productId}")]
        public async Task<IActionResult> RemoveFromBasket(int productId)
        {
            await _basketService.RemoveFromBasketAsync(productId);
            return Ok(new { message = "Product removed from basket." });
        }

        // POST /api/basket/clear
        [HttpPost("clear")]
        public async Task<IActionResult> Clear()
        {
            await _basketService.Clear();
            return Ok(new { message = "Basket cleared." });
        }
    }

}
