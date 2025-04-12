
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import { Icons } from "@/components/shared/Icons";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { mapCompanyToDbCompany } from "@/utils/supabaseAdapters";

const AddCompany: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [company, setCompany] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    employeeCount: "",
    status: "",
  });
  
  const updateCompany = (field: string, value: string) => {
    setCompany({ ...company, [field]: value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!company.name) {
      toast({
        title: "Error",
        description: "Company name is required",
        variant: "destructive",
      });
      return;
    }
    
    if (!company.status) {
      toast({
        title: "Error",
        description: "Company status is required",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Prepare data for Supabase
      const dbCompany = mapCompanyToDbCompany({
        id: "",
        name: company.name,
        email: company.email,
        phone: company.phone,
        website: company.website,
        address: company.address,
        employeeCount: company.employeeCount ? parseInt(company.employeeCount) : 0,
        status: company.status as "active" | "inactive" | "suspended",
        createdAt: new Date().toISOString(),
      });
      
      // Insert into Supabase
      const { error } = await supabase
        .from('companies')
        .insert(dbCompany);
      
      if (error) throw error;
      
      // Success notification
      toast({
        title: "Success",
        description: "Company created successfully",
      });
      
      // Navigate back to companies page
      navigate('/companies');
    } catch (error) {
      console.error("Error creating company:", error);
      toast({
        title: "Error",
        description: "Failed to create company",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-7xl mx-auto px-4">
      <PageHeader
        title="Add New Company"
        description="Create a new company profile"
        icon={<Icons.building className="h-6 w-6" />}
      />
      
      <Card className="mt-6">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                placeholder="Enter company name"
                value={company.name}
                onChange={(e) => updateCompany("name", e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="company@example.com"
                  value={company.email}
                  onChange={(e) => updateCompany("email", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="+1 (555) 000-0000"
                  value={company.phone}
                  onChange={(e) => updateCompany("phone", e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="https://example.com"
                  value={company.website}
                  onChange={(e) => updateCompany("website", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="employeeCount">Number of Employees</Label>
                <Input
                  id="employeeCount"
                  type="number"
                  placeholder="10"
                  value={company.employeeCount}
                  onChange={(e) => updateCompany("employeeCount", e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="Enter company address"
                value={company.address}
                onChange={(e) => updateCompany("address", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={company.status} 
                onValueChange={(value) => updateCompany("status", value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => navigate('/companies')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Company"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCompany;
