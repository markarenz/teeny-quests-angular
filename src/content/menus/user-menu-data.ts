export type MenuItem = {
  id: number;
  label: string;
  href?: string;
  action?: string;
};

export type MenuData = { [key: string]: MenuItem[] };

export const userMenuData: MenuData = {
  loggedIn: [
    {
      id: 1,
      label: 'Profile',
      href: '/profile',
    },
    {
      id: 2,
      label: 'Log Out',
      action: 'signOut',
    },
  ],
  loggedOut: [
    {
      id: 1,
      label: 'Log In',
      action: 'signIn',
    },
  ],
};
