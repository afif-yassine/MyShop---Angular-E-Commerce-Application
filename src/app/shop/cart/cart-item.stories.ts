import type { Meta, StoryObj } from '@storybook/angular';
import { CartItemComponent } from './cart-item.component';
import { CartItem } from '../../state/cart/cart.actions';
import { Product } from '../../../mocks/data';

const sampleProduct: Product = {
  id: 1,
  name: 'Stylo Bleu',
  price: 2.5,
  created_at: '2025-01-10T10:00:00Z',
  owner_id: 10,
  ratings: [{ user_id: 2, value: 4 }],
};

const sampleCartItem: CartItem = {
  product: sampleProduct,
  quantity: 2,
};

const meta: Meta<CartItemComponent> = {
  title: 'Shop/CartItem',
  component: CartItemComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    item: {
      control: 'object',
      description: 'Cart item with product and quantity',
    },
  },
};

export default meta;
type Story = StoryObj<CartItemComponent>;

export const Default: Story = {
  args: {
    item: sampleCartItem,
  },
};

export const SingleQuantity: Story = {
  args: {
    item: {
      product: sampleProduct,
      quantity: 1,
    },
  },
};

export const MultipleQuantity: Story = {
  args: {
    item: {
      product: {
        ...sampleProduct,
        name: 'Cahier A5',
        price: 3.9,
      },
      quantity: 5,
    },
  },
};

export const ExpensiveItem: Story = {
  args: {
    item: {
      product: {
        ...sampleProduct,
        name: 'Palette Aquarelle',
        price: 9.5,
      },
      quantity: 2,
    },
  },
};

