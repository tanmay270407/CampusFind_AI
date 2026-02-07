'use server';
/**
 * @fileOverview Generates item details for claim verification based on found and reported items.
 *
 * - generateItemDetailsForClaim - A function that generates item details for claim verification.
 * - GenerateItemDetailsForClaimInput - The input type for the generateItemDetailsForClaim function.
 * - GenerateItemDetailsForClaimOutput - The return type for the generateItemDetailsForClaim function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateItemDetailsForClaimInputSchema = z.object({
  lostItemDescription: z
    .string()
    .describe('The description of the lost item provided by the user.'),
  lostItemPhotoDataUri: z
    .string()
    .describe(
      "A photo of the lost item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  foundItemDescription: z
    .string()
    .describe('The description of the found item provided by the staff.'),
  foundItemPhotoDataUri: z
    .string()
    .describe(
      "A photo of the found item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

export type GenerateItemDetailsForClaimInput = z.infer<
  typeof GenerateItemDetailsForClaimInputSchema
>;

const GenerateItemDetailsForClaimOutputSchema = z.object({
  itemDetails: z
    .string()
    .describe(
      'A detailed description of the lost and found items, highlighting similarities and differences to assist in claim verification.'
    ),
});

export type GenerateItemDetailsForClaimOutput = z.infer<
  typeof GenerateItemDetailsForClaimOutputSchema
>;

export async function generateItemDetailsForClaim(
  input: GenerateItemDetailsForClaimInput
): Promise<GenerateItemDetailsForClaimOutput> {
  return generateItemDetailsForClaimFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateItemDetailsForClaimPrompt',
  input: {schema: GenerateItemDetailsForClaimInputSchema},
  output: {schema: GenerateItemDetailsForClaimOutputSchema},
  prompt: `You are an AI assistant helping to verify claims for lost and found items.
  Based on the descriptions and photos of both the lost and found items, generate a detailed description highlighting key similarities and differences that would help an admin verify the claim.

  Lost Item Description: {{{lostItemDescription}}}
  Lost Item Photo: {{media url=lostItemPhotoDataUri}}

  Found Item Description: {{{foundItemDescription}}}
  Found Item Photo: {{media url=foundItemPhotoDataUri}}
  `,
});

const generateItemDetailsForClaimFlow = ai.defineFlow(
  {
    name: 'generateItemDetailsForClaimFlow',
    inputSchema: GenerateItemDetailsForClaimInputSchema,
    outputSchema: GenerateItemDetailsForClaimOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
