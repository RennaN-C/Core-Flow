import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        {}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-zinc-950 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;