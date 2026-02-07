'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useState, useRef } from 'react';
import { Loader2, UploadCloud, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Item name is required.' }),
  description: z.string().min(1, { message: 'Description is required.' }),
  location: z.string().min(1, { message: 'Location is required.' }),
  itemType: z.enum(['Water Bottle', 'ID Card', 'Bag', 'Book', 'Gadget', 'Other']),
  photo: z.any().refine((files) => files?.length === 1, 'Photo is required.'),
});

type ReportItemFormProps = {
  itemType: 'lost' | 'found';
};

export function ReportItemForm({ itemType }: ReportItemFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      location: '',
      itemType: 'Other',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue('photo', event.target.files);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    form.resetField('photo');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log({ ...values, type: itemType });
    // Simulate API call to report item
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: `Item Reported as ${itemType}`,
        description: "Thank you! Your report has been submitted.",
      });
      // In a real app, you'd get the new item ID and redirect
      router.push('/dashboard/my-items');
    }, 1500);
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photo of the item</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      {preview ? (
                        <div className="relative">
                          <Image
                            src={preview}
                            alt="Item preview"
                            width={128}
                            height={128}
                            className="rounded-md object-cover h-32 w-32"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                            onClick={handleRemoveImage}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-32 h-32 rounded-md border-2 border-dashed border-input bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer">
                          <UploadCloud className="h-8 w-8 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground mt-2">Upload</span>
                          <Input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                          />
                        </label>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    A clear photo will help us find a match faster.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Blue Hydro Flask" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="itemType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Water Bottle">Water Bottle</SelectItem>
                      <SelectItem value="ID Card">ID Card</SelectItem>
                      <SelectItem value="Bag">Bag</SelectItem>
                      <SelectItem value="Book">Book</SelectItem>
                      <SelectItem value="Gadget">Gadget</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the item in detail. Include color, brand, and any unique features."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Known/Found Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Library Entrance" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                `Submit ${itemType === 'lost' ? 'Lost' : 'Found'} Item Report`
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
