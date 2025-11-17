import type { Meta, StoryObj } from '@storybook/angular';
import { ProductsListComponent } from './products-list.component';
import { Product } from '../../../mocks/data';

const sampleProducts: Product[] = [
  {
    id: 1,
    name: 'Stylo Bleu',
    price: 2.5,
    created_at: '2025-01-10T10:00:00Z',
    owner_id: 10,
    ratings: [{ user_id: 2, value: 4 }],
  },
  {
    id: 2,
    name: 'Cahier A5',
    price: 3.9,
    created_at: '2025-02-01T09:30:00Z',
    owner_id: 11,
    ratings: [{ user_id: 3, value: 5 }],
  },
  {
    id: 3,
    name: 'Classeur Rouge',
    price: 4.5,
    created_at: '2025-02-12T12:00:00Z',
    owner_id: 12,
    ratings: [{ user_id: 4, value: 3 }],
  },
  {
    id: 4,
    name: 'Crayon HB',
    price: 1.2,
    created_at: '2025-03-01T08:45:00Z',
    owner_id: 13,
    ratings: [{ user_id: 2, value: 5 }],
  },
  {
    id: 5,
    name: 'Règle 30cm',
    price: 1.5,
    created_at: '2025-03-05T07:20:00Z',
    owner_id: 14,
    ratings: [{ user_id: 1, value: 4 }],
  },
];

const meta: Meta<ProductsListComponent> = {
  title: 'Shop/ProductsList',
  component: ProductsListComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    products: {
      control: 'object',
      description: 'Array of products to display',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
    },
    error: {
      control: 'text',
      description: 'Error message (null if no error)',
    },
  },
};

export default meta;
type Story = StoryObj<ProductsListComponent>;

export const Default: Story = {
  args: {
    products: sampleProducts,
    loading: false,
    error: null,
  },
};

export const Loading: Story = {
  args: {
    products: [],
    loading: true,
    error: null,
  },
};

export const Error: Story = {
  args: {
    products: [],
    loading: false,
    error: 'Failed to load products',
  },
};

export const Empty: Story = {
  args: {
    products: [],
    loading: false,
    error: null,
  },
};

export const SingleProduct: Story = {
  args: {
    products: [sampleProducts[0]],
    loading: false,
    error: null,
  },
};

