import { InMemoryDbService } from 'angular-in-memory-web-api';

import { ProjectDashboardDb } from './dashboard-project';
import { AnalyticsDashboardDb } from './dashboard-analytics';
import { ECommerceFakeDb } from './e-commerce';

export class FuseFakeDbService implements InMemoryDbService
{
    createDb()
    {
        return {
            // Dashboards
            'project-dashboard-projects' : ProjectDashboardDb.projects,
            'project-dashboard-widgets'  : ProjectDashboardDb.widgets,
            'analytics-dashboard-widgets': AnalyticsDashboardDb.widgets,

            // E-Commerce
            'e-commerce-dashboard': ECommerceFakeDb.dashboard,
            'e-commerce-products' : ECommerceFakeDb.products,
            'e-commerce-orders'   : ECommerceFakeDb.orders
        };
    }
}
