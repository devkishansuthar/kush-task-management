
import React from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Icons } from "@/components/shared/Icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockCompanies } from "@/services/mockData";

const Companies: React.FC = () => {
  return (
    <div className="container max-w-7xl mx-auto px-4">
      <PageHeader
        title="Companies"
        description="Manage companies on the platform"
        icon={<Icons.building className="h-6 w-6" />}
        action={{
          label: "Add Company",
          onClick: () => {},
          icon: <Icons.add className="mr-2 h-4 w-4" />,
        }}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {mockCompanies.map((company) => (
          <Card key={company.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center mr-3">
                    {company.logo ? (
                      <img src={company.logo} alt={company.name} className="w-6 h-6" />
                    ) : (
                      <Icons.building className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{company.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {company.employeeCount} employees
                    </p>
                  </div>
                </div>
                <Badge
                  variant={
                    company.status === "active"
                      ? "default"
                      : company.status === "inactive"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {company.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{company.email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">{company.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Website</p>
                  <p className="text-sm font-medium">{company.website || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="text-sm font-medium">{company.createdAt}</p>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm">
                  <Icons.edit className="h-3.5 w-3.5 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <Icons.view className="h-3.5 w-3.5 mr-1" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Companies;
