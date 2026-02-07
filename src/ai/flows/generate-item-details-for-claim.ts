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
    .optional()
    .describe(
      "A photo of the lost item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'. This is optional."
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
  confidenceScore: z
    .number()
    .min(0)
    .max(1)
    .describe(
      'A score from 0.0 to 1.0 indicating the confidence that the claimant is the true owner. 1.0 is a certain match, 0.0 is a certain mismatch.'
    ),
  reasoning: z
    .string()
    .describe(
      'A detailed analysis comparing the lost and found items. Explain your reasoning for the confidence score by highlighting similarities and discrepancies in features like color, brand, unique markings, and contents.'
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
  prompt: `You are a security expert specializing in verifying ownership of lost and found items. Your task is to analyze the details provided by the claimant and compare them against the item found by staff.

Carefully examine both descriptions and, if available, both photos. Pay close attention to:
- **Color, Brand, Model:** Are they an exact match?
- **Unique Markings:** Does the claimant mention any scratches, dents, stickers, or other unique identifiers? Are these visible on the found item?
- **Contents (for bags/containers):** Does the claimant accurately describe items that were inside?
- **Uniqueness of Description:** Did the claimant provide specific details that only the true owner would know?

Based on your analysis, provide a confidence score and a detailed reasoning.

**Found Item Details:**
- Description: {{{foundItemDescription}}}
- Photo: {{media url=foundItemPhotoDataUri}}

**Claimant's Details:**
- Description: {{{lostItemDescription}}}
{{#if lostItemPhotoDataUri}}
- Photo: {{media url=lostItemPhotoDataUri}}
{{/if}}
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
