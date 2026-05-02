import LoginPage from '../pages/login/login-page';
import RegisterPage from '../pages/register/register-page';
import HomePage from '../pages/home/home-page';
import AddStoryPage from '../pages/add-story/add-story-page';

const routes = {
  '/': { page: HomePage, auth: true },
  '/login': { page: LoginPage, auth: false },
  '/register': { page: RegisterPage, auth: false },
  '/add-story': { page: AddStoryPage, auth: true },
};

export function resolveRoute(pathname) {
  const config = routes[pathname];
  if (!config) return { page: null, needsAuth: false };
  return { page: config.page, needsAuth: config.auth };
}

export default routes;
