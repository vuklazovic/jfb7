import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
    }}>
      <Sidebar />
      <main style={{
        flex: 1,
        marginLeft: 260,
        padding: '32px 40px',
        maxWidth: 'calc(100vw - 260px)',
        overflowX: 'hidden',
      }}>
        <Outlet />
      </main>
    </div>
  );
}
