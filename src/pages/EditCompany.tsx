
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/shared/PageHeader";
import { Icons } from "@/components/shared/Icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mapDbCompanyToCompany, mapCompanyToDbCompany } from "@/utils/supabaseAdapters";
import { Company } from "@/types/company";

const formSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  status: z.enum(["active", "inactive", "suspended"]),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  employeeCount: z.coerce.number().int().min(0, "Employee count cannot be negative").optional(),
});

type FormValues = z.infer<typeof formSchema>;

const EditCompany: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      status: "active",
      email: "",
      phone: "",
      address: "",
      website: "",
      employeeCount: 0,
    },
  });

  useEffect(() => {
    if (id) {
      fetchCompany(id);
    }
  }, [id]);

  const fetchCompany = async (companyId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();

      if (error) throw error;

      if (data) {
        const company = mapDbCompanyToCompany(data);
        form.reset({
          name: company.name,
          status: company.status,
          email: company.email || "",
          phone: company.phone || "",
          address: company.address || "",
          website: company.website || "",
          employeeCount: company.employeeCount,
        });
      }
    } catch (error) {
      console.error("Error fetching company:", error);
      toast.error("Failed to load company details");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!id) return;

    try {
      setLoading(true);
      
      const companyData: Company = {
        id,
        name: data.name,
        status: data.status,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
        website: data.website || null,
        employeeCount: data.employeeCount || 0,
        logo: "",
        createdAt: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from('companies')
        .update(mapCompanyToDbCompany(companyData))
        .eq('id', id);

      if (error) throw error;

      toast.success("Company updated successfully");
      navigate(`/companies/${id}`);
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("Failed to update company");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <PageHeader
        title="Edit Company"
        description="Update company information"
        icon={<Icons.building2 className="h-6 w-6" />}
        breadcrumbs={[
          { label: "Companies", href: "/companies" },
          { label: form.watch("name") || "Edit Company", href: `/companies/${id}/edit` },
        ]}
      />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter website URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employeeCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee Count</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter company address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/companies/${id}`)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCompany;
