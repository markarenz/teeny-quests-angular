import { MenuItem } from './user-menu-data';

export const mainMenuData: MenuItem[] = [
  {
    id: 1,
    label: 'Home',
    href: '/',
  },
  // {
  //   id: 2,
  //   label: 'Games',
  //   href: '/game',
  // },
  {
    id: 3,
    label: 'About',
    href: '/about',
  },
  {
    id: 4,
    label: 'Game Editor',
    href: '/editor',
    isLoggedInOnly: true,
  },
  // {
  //   id: 5,
  //   label: 'Profile',
  //   href: '/profile',
  //   isLoggedInOnly: true,
  // },
  {
    id: 6,
    label: 'More Nonsense',
    href: 'https://www.ridiculopathy.com',
  },
];
