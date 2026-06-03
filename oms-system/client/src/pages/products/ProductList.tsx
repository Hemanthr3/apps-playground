import { useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, importProducts, importProductsXlsx } from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ProductList() {
  const queryClient = useQueryClient();
  const csvInputRef = useRef<HTMLInputElement>(null);
  const xlsxInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const onSuccess = (result: any) => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
    alert(`Successfully imported ${result.inserted} products`);
  };

  const onError = (error: any) => {
    alert(`Import failed: ${error.response?.data?.message || error.message}`);
  };

  const csvMutation = useMutation({ mutationFn: importProducts, onSuccess, onError });
  const xlsxMutation = useMutation({ mutationFn: importProductsXlsx, onSuccess, onError });

  const handleCsvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    csvMutation.mutate(file);
    e.target.value = '';
  };

  const handleXlsxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    xlsxMutation.mutate(file);
    e.target.value = '';
  };

  if (isLoading) return <div>Loading products...</div>;
  if (error) return <div>Error loading products</div>;

  const products = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => csvInputRef.current?.click()}
            disabled={csvMutation.isPending}
          >
            {csvMutation.isPending ? 'Importing...' : 'Import CSV'}
          </Button>
          <Button
            onClick={() => xlsxInputRef.current?.click()}
            disabled={xlsxMutation.isPending}
          >
            {xlsxMutation.isPending ? 'Importing...' : 'Import XLSX'}
          </Button>
        </div>
      </div>

      <input ref={csvInputRef} type="file" accept=".csv" className="hidden" onChange={handleCsvChange} />
      <input ref={xlsxInputRef} type="file" accept=".xlsx" className="hidden" onChange={handleXlsxChange} />

      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product: any) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">#{product.id}</TableCell>
                  <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{product.description}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={product.stockQuantity > 10 ? 'default' : 'destructive'}>
                      {product.stockQuantity} in stock
                    </Badge>
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
