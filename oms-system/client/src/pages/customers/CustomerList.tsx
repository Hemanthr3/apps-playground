import { useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCustomers, uploadProfilePhoto } from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CustomerList() {
  const queryClient = useQueryClient();
  // One hidden file input, reused for every row via a ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Tracks which customer's upload button was clicked
  const activeCustomerIdRef = useRef<number | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers,
  });

  const uploadMutation = useMutation({
    mutationFn: ({ customerId, file }: { customerId: number; file: File }) =>
      uploadProfilePhoto(customerId, file),
    // After a successful upload, refetch customers so the new presigned URL appears
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customers'] }),
  });

  const handleUploadClick = (customerId: number) => {
    activeCustomerIdRef.current = customerId;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const customerId = activeCustomerIdRef.current;
    if (!file || !customerId) return;
    uploadMutation.mutate({ customerId, file });
    // Reset so the same file can be re-selected next time
    e.target.value = '';
  };

  if (isLoading) return <div>Loading customers...</div>;
  if (error) return <div>Error loading customers</div>;

  const customers = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
      </div>

      {/* Hidden file input shared across all rows */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer: any) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    {customer.profilePhotoUrl ? (
                      <img
                        src={customer.profilePhotoUrl}
                        alt={customer.firstName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                        {customer.firstName?.[0]}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">#{customer.id}</TableCell>
                  <TableCell>{customer.firstName} {customer.lastName}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone || '-'}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUploadClick(customer.id)}
                      disabled={uploadMutation.isPending && activeCustomerIdRef.current === customer.id}
                    >
                      {uploadMutation.isPending && activeCustomerIdRef.current === customer.id
                        ? 'Uploading...'
                        : 'Upload Photo'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
