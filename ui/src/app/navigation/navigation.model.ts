import { FuseNavigationModelInterface } from '../core/components/navigation/navigation.model';

export class FuseNavigationModel implements FuseNavigationModelInterface
{
    public model: any[];

    constructor()
    {
        this.model = [
            {
                'id'      : 'applications',
                'title'   : 'Applications',
                'translate': 'NAV.APPLICATIONS',
                'type'    : 'group',
                'children': [
                    {
                        'id'   : 'home',
                        'title': 'Home',
                        'translate': 'NAV.HOME.TITLE',
                        'type' : 'item',
                        'icon' : 'email',
                        'url'  : '/home',
                        'badge': {
                            'title': 25,
                            'translate': 'NAV.HOME.BADGE',
                            'bg'   : '#F44336',
                            'fg'   : '#FFFFFF'
                        }
                    }
                ]
            },
            {
              'id'   : 'dashboard',
              'title': 'Dashboard',
              'type' : 'item',
              'url'  : '/dashboard'
            },
            {
              'id'        : 'products',
              'title'     : 'Products',
              'type'      : 'item',
              'url'       : '/products',
              'exactMatch': true
            },
            {
              'id'        : 'productDetail',
              'title'     : 'Product Detail',
              'type'      : 'item',
              'url'       : '/products/1/printed-dress',
              'exactMatch': true
            },
            {
              'id'        : 'orders',
              'title'     : 'Orders',
              'type'      : 'item',
              'url'       : '/orders',
              'exactMatch': true
            },
            {
              'id'        : 'orderDetail',
              'title'     : 'Order Detail',
              'type'      : 'item',
              'url'       : '/orders/1',
              'exactMatch': true
            }
        ];
    }
}
