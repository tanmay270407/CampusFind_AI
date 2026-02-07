'use server';

/**
 * @fileOverview Implements the FindSimilarItems flow, which uses AI to find visually similar items based on an uploaded image and description.
 *
 * - findSimilarItems - The main function that initiates the process of finding similar items.
 * - FindSimilarItemsInput - The input type for the findSimilarItems function, including an image data URI and item description.
 * - FindSimilarItemsOutput - The output type, providing a list of potential matches with similarity scores.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { items } from '@/lib/data';

const FindSimilarItemsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('A detailed description of the item, including color, brand, and any unique features.'),
});
export type FindSimilarItemsInput = z.infer<typeof FindSimilarItemsInputSchema>;

const FindSimilarItemsOutputSchema = z.array(
  z.object({
    itemId: z.string().describe('The ID of the potential matching item.'),
    similarityScore: z.number().describe('A score indicating the similarity between the uploaded item and the potential match (0-1).'),
    imageUrl: z.string().describe('URL of the image of the matching item.'),
    itemDescription: z.string().describe('Description of the potential matching item.'),
    locationFound: z.string().describe('The location where the matching item was found.'),
  })
);
export type FindSimilarItemsOutput = z.infer<typeof FindSimilarItemsOutputSchema>;

export async function findSimilarItems(input: FindSimilarItemsInput): Promise<FindSimilarItemsOutput> {
  return findSimilarItemsFlow(input);
}

const findSimilarItemsPrompt = ai.definePrompt({
  name: 'findSimilarItemsPrompt',
  input: {schema: FindSimilarItemsInputSchema},
  output: {schema: FindSimilarItemsOutputSchema},
  prompt: `You are an AI assistant designed to find similar items based on an uploaded image and description.

  Analyze the following item description and image to find potential matches from a database of found items. Provide a list of potential matches, ranked by similarity score.

  Item Description: {{{description}}}
  Item Image: {{media url=photoDataUri}}

  Format the output as a JSON array of objects, where each object represents a potential match and includes the itemId, similarityScore, imageUrl, itemDescription and locationFound.
`,
});

const findSimilarItemsFlow = ai.defineFlow(
  {
    name: 'findSimilarItemsFlow',
    inputSchema: FindSimilarItemsInputSchema,
    outputSchema: FindSimilarItemsOutputSchema,
  },
  async (input): Promise<FindSimilarItemsOutput> => {
    // This is a mock implementation for demo purposes.
    // In a real application, the AI would perform a vector search based on the input image and description.
    
    // Simulate a delay to mimic AI processing time.
    await new Promise(resolve => setTimeout(resolve, 1500));

    const foundItems = items.filter(i => i.type === 'found' && i.status === 'open');

    // For this demo, we'll just return a couple of found items with a mock similarity score.
    // A real implementation would use the AI's analysis of the input to determine similarity.
    const mockResults: FindSimilarItemsOutput = foundItems.slice(0, 3).map((item, index) => ({
      itemId: item.id,
      similarityScore: parseFloat((0.92 - index * 0.15).toFixed(2)),
      imageUrl: item.imageUrl,
      itemDescription: item.description,
      locationFound: item.location,
    })).filter(item => item.similarityScore > 0);

    return mockResults;
  }
);
