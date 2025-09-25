import { Link, Outlet } from "react-router-dom";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Member", href: "/member" },
  { name: "Profile", href: "/profile" },
  { name: "Team", href: "/team" },
];
const DashboardLayout = () => {
  return (
    <div className="h-screen flex">
      <div className="flex flex-col h-full bg-blue-700 w-64">
        {navLinks.map((link) => (
          <Link key={link.name} to={link.href}>
            {link.name}
          </Link>
        ))}
      </div>
      <div className="flex flex-col flex-1">
        <div className="bg-yellow-700">
          <h1>hello</h1>
          <h1>hello</h1>
        </div>
        <div className="bg-green-700 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
