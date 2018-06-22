import { FuseNavigationModelInterface } from '../core/components/navigation/navigation.model';

export class FuseNavigationModel implements FuseNavigationModelInterface
{
    public model: any[];

    constructor()
    {
        this.model = [
          {
            'id'      : 'landing',
            'title'   : 'Inicio',
            'type'    : 'item',
            'url'     : 'landing'
          },
          {
            'id'      : 'players',
            'title'   : 'Jugadores',
            'type'    : 'item',
            'url'     : 'players'
          },
          {
            'id'      : 'teams',
            'title'   : 'Equipos',
            'type'    : 'collapse',
            'children' : [
              {
                'id'       : 'create',
                'title'    : 'Crear Equipo',
                'type'     : 'item',
                'url'      : 'team/create'
              },
              {
                'id'       : 'my_teams',
                'title'    : 'Mis Equipos',
                'type'     : 'item',
                'url'      : 'team/general'
              },
              {
                'id'       : 'search-team',
                'title'    : 'Buscar equipo',
                'type'     : 'item',
                'url'      : 'team/search'
              }
            ]
          },
          {
            'id'      : 'matches',
            'title'   : 'Partidos',
            'type'    : 'collapse',
            'children' : [
              {
                'id'       : 'challenge',
                'title'    : 'Desafiar equipo',
                'type'     : 'item',
                'url'      : 'match/challenge'
              },
              {
                'id'       : 'active_challenges',
                'title'    : 'Partidos confirmados',
                'type'     : 'item',
                'url'      : 'match/active'
              },
              {
                'id'       : 'history',
                'title'    : 'Historial',
                'type'     : 'item',
                'url'      : 'match/history'
              }
            ]
          },
        ];
    }
}
