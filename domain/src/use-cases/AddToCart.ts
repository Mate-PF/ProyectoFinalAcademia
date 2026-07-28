import { Cart } from "../entities/Cart";
import type { CartRepository } from "../services/CartRepository";
import type { MenuItemRepository } from "../services/MenuItemRepository";
import type { IdGenerator } from "../services/IdGenerator";

export interface AddToCartInput {
  customerId: string;
  menuItemId: string;
  quantity?: number;
}

/**
 * Caso de uso: agregar un ítem al carrito del cliente.
 * - Si no tiene carrito, se crea uno para el restaurante del ítem.
 * - Un carrito es de un solo restaurante: agregar de otro se rechaza.
 * La entidad `Cart` valida disponibilidad y mismo restaurante.
 */
export class AddToCart {
  constructor(
    private readonly carts: CartRepository,
    private readonly menuItems: MenuItemRepository,
    private readonly ids: IdGenerator,
  ) {}

  async execute(input: AddToCartInput): Promise<Cart> {
    const menuItem = await this.menuItems.findById(input.menuItemId);
    if (menuItem === null) {
      throw new Error("El ítem no existe");
    }

    let cart = await this.carts.findByCustomer(input.customerId);
    if (cart === null) {
      cart = Cart.create({
        id: this.ids.next(),
        customerId: input.customerId,
        restaurantId: menuItem.restaurantId,
      });
    } else if (cart.restaurantId !== menuItem.restaurantId) {
      throw new Error("Ya tenés un carrito de otro restaurante; vacialo antes de agregar de otro");
    }

    cart.addItem(menuItem, input.quantity ?? 1);
    await this.carts.save(cart);
    return cart;
  }
}
