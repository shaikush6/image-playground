import Anthropic from '@anthropic-ai/sdk';

export interface PaletteEntry {
  hex: string;
  name: string;
  suggested_role: string;
}

export interface PaletteOutput {
  mood_description: string;
  palette: PaletteEntry[];
}

export class AnthropicService {
  private static detectImageMimeType(base64Data: string): string {
    // Check first few characters of base64 to detect image type
    if (base64Data.startsWith('/9j/')) return 'image/jpeg';
    if (base64Data.startsWith('iVBORw0K')) return 'image/png';
    if (base64Data.startsWith('UklGR')) return 'image/webp';
    if (base64Data.startsWith('R0lGOD')) return 'image/gif';
    
    // Default to JPEG if can't detect
    console.log('⚠️ Could not detect image type, defaulting to JPEG');
    return 'image/jpeg';
  }
  static async extractPalette(imageBase64: string, swatches: number = 5): Promise<PaletteOutput | null> {
    try {
      console.log('🔑 Checking Anthropic API key...');
      if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error('Missing ANTHROPIC_API_KEY environment variable');
      } else {
        console.log(`✅ Found API Key starting with: ${process.env.ANTHROPIC_API_KEY.substring(0, 5)}...`);
      }

      console.log('🤖 Initializing Anthropic client...');
      const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });

      const mimeType = this.detectImageMimeType(imageBase64);
      console.log(`🖼️ Sending image to Anthropic (${imageBase64.length} chars base64, type: ${mimeType})...`);
      
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mimeType,
                  data: imageBase64,
                },
              },
              {
                type: 'text',
                text: `Analyze this image carefully. Identify the ${swatches} most dominant and characteristic colors that define its visual identity.

For each color, determine its approximate hex code, a common descriptive name, and suggest its role based on its visual prominence and usage in the image (e.g., 'Dominant Background', 'Primary Subject', 'Highlight/Accent', 'Neutral Complement', 'Shadow/Depth').

Additionally, provide a single sentence describing the overall mood or feeling conveyed by the image's color scheme.

Return ONLY a valid JSON object adhering strictly to this schema:
{
  "mood_description": "A single sentence describing the mood.",
  "palette": [
    {
      "hex": "#RRGGBB",
      "name": "<Descriptive Color Name>",
      "suggested_role": "<Suggested Role>"
    }
  ]
}

Ensure hex codes are accurate. Be perceptive in naming colors and suggesting roles.`,
              },
            ],
          },
        ],
      });

      console.log('📝 Received response from Anthropic:', response);

      const content = response.content[0];
      if (content.type === 'text') {
        console.log('📄 Raw response text:', content.text);
        
        // Try multiple ways to extract JSON
        let jsonString = null;
        
        // Method 1: Look for complete JSON object
        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          jsonString = jsonMatch[0];
        } else {
          // Method 2: Try to find JSON between code blocks
          const codeBlockMatch = content.text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
          if (codeBlockMatch) {
            jsonString = codeBlockMatch[1];
          } else {
            // Method 3: Look for any object-like structure
            const objectMatch = content.text.match(/\{[^}]*"mood_description"[^}]*\}/);
            if (objectMatch) {
              jsonString = objectMatch[0];
            }
          }
        }
        
        if (jsonString) {
          try {
            console.log('🔍 Extracted JSON:', jsonString);
            const parsed = JSON.parse(jsonString) as PaletteOutput;
            
            // Validate the parsed object
            if (parsed.palette && Array.isArray(parsed.palette) && parsed.palette.length > 0) {
              console.log('✅ Successfully parsed palette:', parsed);
              return parsed;
            } else {
              console.error('❌ Invalid palette structure:', parsed);
            }
          } catch (parseError) {
            console.error('❌ JSON parsing failed:', parseError);
            console.error('Attempted to parse:', jsonString);
          }
        } else {
          console.error('❌ No JSON found in response text');
          console.log('Full response text for debugging:', content.text);
        }
      } else {
        console.error('❌ Response content is not text type:', content.type);
      }
      return null;
    } catch (error) {
      console.error('💥 Error extracting palette from Anthropic:', JSON.stringify(error, null, 2));
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error name:', error.name);
        console.error('Error stack:', error.stack);
      }
      return null;
    }
  }

  static async generateCreativeIdeas(
    palette: PaletteEntry[],
    domain: string,
    customizations: Record<string, any> = {},
    additionalContext?: string
  ): Promise<string> {
    try {
      if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error('Missing ANTHROPIC_API_KEY environment variable');
      }

      const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });

      const paletteDescription = palette
        .map(p => `${p.name} (${p.hex}) - ${p.suggested_role}`)
        .join(', ');

      const customizationsText = Object.entries(customizations)
        .filter(([key, value]) => value && value !== 'Any' && value !== 'Chef\'s choice' && key !== 'text_length')
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
        .join(', ');
      
      const textLength = customizations.text_length || '300-500';

      let prompt = `You are a creative expert in ${domain}. Create inspiring and detailed ideas based on this color palette:

Color Palette: ${paletteDescription}

${customizationsText ? `Customizations: ${customizationsText}` : ''}
${additionalContext ? `Additional Context: ${additionalContext}` : ''}

Generate creative, detailed, and inspiring ideas that make the most of these colors. Be specific, creative, and provide actionable concepts. The response should be between ${textLength} words.`;

      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = response.content[0];
      return content.type === 'text' ? content.text : 'Unable to generate ideas.';
    } catch (error) {
      console.error('Error generating creative ideas:', error);
      return 'Error generating creative ideas.';
    }
  }
}