'use server';
/**
 * @fileOverview Extracts contact information from an image of a handwritten contact card.
 *
 * - extractContactData - A function that handles the contact information extraction process.
 * - ExtractContactDataInput - The input type for the extractContactData function.
 * - ExtractContactDataOutput - The return type for the extractContactData function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const ExtractContactDataInputSchema = z.object({
  photoUrl: z.string().describe('The URL of the contact card photo.'),
});
export type ExtractContactDataInput = z.infer<typeof ExtractContactDataInputSchema>;

const ExtractContactDataOutputSchema = z.object({
  senderName: z.string().describe("The sender's name.").optional(),
  senderPhoneNumber: z.string().describe("The sender's phone number.").optional(),
  receiverName: z.string().describe("The receiver's name.").optional(),
  receiverPhoneNumber: z.string().describe("The receiver's phone number.").optional(),
  receiverAddress: z.string().describe("The receiver's address.").optional(),
});
export type ExtractContactDataOutput = z.infer<typeof ExtractContactDataOutputSchema>;

export async function extractContactData(input: ExtractContactDataInput): Promise<ExtractContactDataOutput> {
  return extractContactDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractContactDataPrompt',
  input: {
    schema: z.object({
      photoUrl: z.string().describe('The URL of the contact card photo.'),
    }),
  },
  output: {
    schema: z.object({
      senderName: z.string().describe("The sender's name.").optional(),
      senderPhoneNumber: z.string().describe("The sender's phone number.").optional(),
      receiverName: z.string().describe("The receiver's name.").optional(),
      receiverPhoneNumber: z.string().describe("The receiver's phone number.").optional(),
      receiverAddress: z.string().describe("The receiver's address.").optional(),
    }),
  },
  prompt: `You are an expert AI assistant specializing in extracting contact information from images of handwritten contact cards. Analyze the image provided and extract the following information, if available:

- Sender's Name
- Sender's Phone Number
- Receiver's Name
- Receiver's Phone Number
- Receiver's Address

Image: {{media url=photoUrl}}

Provide the extracted information in the specified output format. If a field cannot be determined from the image, leave it blank.
`,
});

const extractContactDataFlow = ai.defineFlow<
  typeof ExtractContactDataInputSchema,
  typeof ExtractContactDataOutputSchema
>({
  name: 'extractContactDataFlow',
  inputSchema: ExtractContactDataInputSchema,
  outputSchema: ExtractContactDataOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
