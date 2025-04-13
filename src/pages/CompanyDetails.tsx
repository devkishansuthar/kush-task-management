
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PageHeader from "@/components/shared/PageHeader";
import { Icons } from "@/components/shared/Icons";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Company } from "@/types/company";
import { supabase } from "@/integrations/supabase/client";
import { mapDbCompanyToCompany } from "@/utils/supabaseAdapters";
import TeamSection from "@/components/company/TeamSection";

const CompanyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCompany(id);
    }
  }, [id]);

  const fetchCompany = async (companyId: string) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setCompany(mapDbCompanyToCompany(data));
      }
    } catch (error) {
      console.error("Error fetching company:", error);
      toast.error("Failed to load company details");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (company) {
      navigate(`/companies/${company.id}/edit`);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Company not found</h2>
          <p className="mt-2 text-muted-foreground">
            The company you are looking for does not exist or has been removed.
          </p>
          <Button
            className="mt-4"
            onClick={() => navigate('/companies')}
          >
            Back to Companies
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <PageHeader
        title={company.name}
        description="Company details and information"
        icon={<Icons.building2 className="h-6 w-6" />}
        breadcrumbs={[
          { label: "Companies", href: "/companies" },
          { label: company.name, href: `/companies/${company.id}` },
        ]}
        action={{
          label: "Edit Company",
          onClick: handleEdit,
          icon: <Icons.edit className="mr-2 h-4 w-4" />,
        }}
      />

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0 flex items-center justify-center">
                    <Avatar className="h-28 w-28">
                      {company.logo ? (
                        <AvatarImage src={company.logo} alt={company.name} />
                      ) : (
                        <AvatarFallback className="text-2xl">
                          {company.name.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </div>
                  <div className="flex-grow space-y-4">
                    <div>
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        {company.name}
                        <Badge variant={company.status === "active" ? "default" : "destructive"}>
                          {company.status}
                        </Badge>
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {company.employeeCount} employees
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {company.website && (
                        <div>
                          <p className="text-sm font-medium">Website</p>
                          <p className="text-sm">
                            <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              {company.website}
                            </a>
                          </p>
                        </div>
                      )}
                      
                      {company.email && (
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-sm">
                            <a href={`mailto:${company.email}`} className="text-primary hover:underline">
                              {company.email}
                            </a>
                          </p>
                        </div>
                      )}
                      
                      {company.phone && (
                        <div>
                          <p className="text-sm font-medium">Phone</p>
                          <p className="text-sm">{company.phone}</p>
                        </div>
                      )}
                      
                      {company.address && (
                        <div>
                          <p className="text-sm font-medium">Address</p>
                          <p className="text-sm">{company.address}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Company Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="text-2xl font-bold capitalize">{company.status}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">Employees</p>
                    <p className="text-2xl font-bold">{company.employeeCount}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="text-sm">
                      {new Date(company.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="teams" className="mt-6">
          <TeamSection companyId={company.id} companyName={company.name} />
        </TabsContent>

        <TabsContent value="tasks" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>Tasks associated with this company</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                No tasks found for this company
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyDetails;
