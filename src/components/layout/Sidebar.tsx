import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Trophy,
  LogOut,
  Activity,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout, isCoach } = useAuth();
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const confirmLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/athletes", icon: Users, label: "Athletes" },

    ...(isCoach
      ? [{ to: "/athletes/add", icon: UserPlus, label: "Add Athlete" }]
      : []),

    ...(isCoach
      ? [{ to: "/tests", icon: Activity, label: "Test Scores" }]
      : []),

    { to: "/leaderboard", icon: Trophy, label: "Leaderboard" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md">
            <h3 className="text-lg font-semibold mb-2">Confirm Logout</h3>

            <p className="text-muted-foreground mb-6">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </Button>

              <Button variant="destructive" onClick={confirmLogout}>
                Yes, Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 bg-sidebar text-sidebar-foreground transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <Activity className="w-6 h-6 text-accent-foreground" />
              </div>

              <div>
                <h1 className="font-display font-bold text-lg">AthleteTrack</h1>
                <p className="text-xs text-sidebar-foreground/70">
                  Performance Hub
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User info */}
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-sidebar-accent">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <span className="text-accent-foreground font-bold">
                  {user?.name?.charAt(0) || "U"}
                </span>
              </div>

              <div>
                <p className="font-medium text-sm">
                  {user?.name
                    ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
                    : ""}
                </p>

                <p className="text-xs text-sidebar-foreground/70">
                  {user?.role
                    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                    : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                end={item.to === "/athletes"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-accent text-accent-foreground shadow-md"
                      : "hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground"
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-sidebar-border">
            <Button
              variant="ghost"
              onClick={() => setShowLogoutModal(true)}
              className="w-full justify-start gap-3 text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
