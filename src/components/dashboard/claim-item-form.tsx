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
import { useToast } from '@/hooks/use-toast';
import { useState, useRef } from 'react';
import { Loader2, UploadCloud, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import type { Item } from '@/lib/types';
// import { generateItemDetailsForClaim } from '@/ai/flows/generate-item-details-for-claim';


const formSchema = z.object({
  description: z.string().min(20, { message: 'Please provide a detailed description (at least 20 characters) to help us verify your claim.' }),
  photo: z.any().optional(),
});

type ClaimItemFormProps = {
  foundItem: Item;
};

export function ClaimItemForm({ foundItem }: ClaimItemFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        form.setValue('photo', event.target.files);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = () => {
    setPreview(null);
    form.resetField('photo');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    // In a real app, you would call the AI flow here.
    // For now, we simulate the process.
    console.log('Claim submitted for item:', foundItem.id);
    console.log('Claim details:', values);
    console.log('Photo preview (data URI):', preview);
    
    /*
    // Example of how you might call the AI flow
    try {
        const aiResponse = await generateItemDetailsForClaim({
            lostItemDescription: values.description,
            lostItemPhotoDataUri: preview || '',
            foundItemDescription: foundItem.description,
            foundItemPhotoDataUri: foundItem.imageUrl, // In a real app, this might need to be a data URI too
        });
        console.log("AI Verification Details:", aiResponse.itemDetails);
        // You would then save this to the claim record in your database
    } catch (error) {
        console.error("AI Flow failed:", error);
        toast({
            variant: "destructive",
            title: "AI Verification Failed",
            description: "We couldn't process the AI verification at this time. Please try again.",
        });
        setIsLoading(false);
        return;
    }
    */


    // Simulate API call to submit claim
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Claim Submitted",
        description: "Your claim has been submitted for review. You will be notified of the outcome.",
      });
      // In a real app, you'd redirect to a page showing the status of their claims
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Describe your lost item</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      placeholder="To verify your claim, please describe the item you lost in detail. Mention any unique marks, scratches, or contents."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photo of your item (optional)</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      {preview ? (
                        <div className="relative">
                          <Image
                            src={preview}
                            alt="Your item preview"
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
                    If you have a photo of your item, it can significantly speed up the verification process.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                'Submit Claim'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
