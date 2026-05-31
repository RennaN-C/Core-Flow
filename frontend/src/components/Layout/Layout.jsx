import Header from './Header';
import Sidebar, { MobileNav } from './Sidebar';
import { TenantProfileProvider } from '../../context/TenantProfileProvider';

const Layout = ({ children }) => (
  <TenantProfileProvider>
    <div className="app-shell">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header />
        <main className="app-main">{children}</main>
      </div>
      <MobileNav />
    </div>
  </TenantProfileProvider>
);

export default Layout;
