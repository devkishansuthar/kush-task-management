
import React from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { Icons } from "./Icons";
import { Link } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  icon,
  breadcrumbs,
  action,
}) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="flex flex-col space-y-2 py-4 md:py-6">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="flex items-center text-sm text-muted-foreground mb-1">
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="mx-2">/</span>}
              <Link
                to={item.href}
                className={index === breadcrumbs.length - 1 ? "font-medium text-foreground" : "hover:text-foreground"}
              >
                {item.label}
              </Link>
            </React.Fragment>
          ))}
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
            {description && (
              <p className="text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? (
              <Icons.moon className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Icons.sun className="h-[1.2rem] w-[1.2rem]" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            title="Notifications"
          >
            <Icons.notification className="h-[1.2rem] w-[1.2rem]" />
          </Button>
          {action && (
            <Button onClick={action.onClick}>
              {action.icon}
              {action.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
