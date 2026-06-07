import { useRef, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, importProducts, importProductsXlsx, getJobStatus } from '@/lib/api';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ProductList() {
  const queryClient = useQueryClient();
  const csvInputRef = useRef<HTMLInputElement>(null);
  const xlsxInputRef = useRef<HTMLInputElement>(null);

  // jobId is set after a successful XLSX upload — triggers polling
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  // Poll job status every 2 seconds while activeJobId is set
  const { data: jobData } = useQuery({
    queryKey: ['job', activeJobId],
    queryFn: () => getJobStatus(activeJobId!),
    enabled: !!activeJobId,
    refetchInterval: (query) => {
      const state = query.state.data?.state;
      if (state === 'completed' || state === 'failed') return false;
      return 2000;
    },
  });

  // React to job completion — side effects belong in useEffect, not select
  useEffect(() => {
    if (!jobData) return;
    if (jobData.state === 'completed') {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setActiveJobId(null);
      alert(`Import complete — ${jobData.result?.inserted ?? 0} products inserted`);
    }
    if (jobData.state === 'failed') {
      setActiveJobId(null);
      alert(`Import failed: ${jobData.error}`);
    }
  }, [jobData?.state]);

  const csvMutation = useMutation({
    mutationFn: importProducts,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      alert(`Successfully imported ${result.inserted} products`);
    },
    onError: (error: any) => {
      alert(`Import failed: ${error.response?.data?.message || error.message}`);
    },
  });

  const xlsxMutation = useMutation({
    mutationFn: importProductsXlsx,
    onSuccess: (result) => {
      // Don't refresh immediately — wait for the job to complete via polling
      setActiveJobId(result.jobId);
    },
    onError: (error: any) => {
      alert(`Import failed: ${error.response?.data?.message || error.message}`);
    },
  });

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

  const jobState = jobData?.state;
  const isJobRunning = !!activeJobId && jobState !== 'completed' && jobState !== 'failed';

  if (isLoading) return <div>Loading products...</div>;
  if (error) return <div>Error loading products</div>;

  const products = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <div className="flex items-center gap-2">
          {/* Job progress indicator */}
          {isJobRunning && (
            <div className="flex items-center gap-2 min-w-48">
              <Progress value={typeof jobData?.progress === 'number' ? jobData.progress : 0} className="h-2" />
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {typeof jobData?.progress === 'number' ? jobData.progress : 0}%
              </span>
            </div>
          )}
          <Button
            variant="outline"
            onClick={() => csvInputRef.current?.click()}
            disabled={csvMutation.isPending}
          >
            {csvMutation.isPending ? 'Importing...' : 'Import CSV'}
          </Button>
          <Button
            onClick={() => xlsxInputRef.current?.click()}
            disabled={xlsxMutation.isPending || isJobRunning}
          >
            {xlsxMutation.isPending ? 'Queuing...' : isJobRunning ? 'Processing...' : 'Import XLSX'}
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
