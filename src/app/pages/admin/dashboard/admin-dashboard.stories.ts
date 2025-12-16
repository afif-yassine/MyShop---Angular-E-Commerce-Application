import { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideStore } from '@ngrx/store';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { adminReducer } from '../../../state/admin/admin.reducer';

const meta: Meta<AdminDashboardComponent> = {
  title: 'Admin/Dashboard',
  component: AdminDashboardComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [
        provideStore({ admin: adminReducer }),
        provideAnimations()
      ],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<AdminDashboardComponent>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Admin dashboard showing overall statistics, top products, and recent orders.',
      },
    },
  },
};

export const Loading: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Dashboard in loading state while fetching data.',
      },
    },
  },
};
