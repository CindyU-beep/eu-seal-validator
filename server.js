import express from 'express';
import cors from 'cors';
import { AzureOpenAI } from 'openai';
import { DefaultAzureCredential } from '@azure/identity';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Azure OpenAI configuration
const endpoint = process.env.AZURE_OPENAI_ENDPOINT || 'https://henkel-llm-proc-aoai-eastus2-eznq7.openai.azure.com/';
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-5';
const apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-12-01-preview';

// Get Azure AD token using DefaultAzureCredential
const credential = new DefaultAzureCredential();

async function getAzureOpenAIClient() {
  try {
    // Create a token provider function for Azure AD authentication
    const azureADTokenProvider = async () => {
      const tokenResponse = await credential.getToken('https://cognitiveservices.azure.com/.default');
      console.log('🔑 Got Azure AD token, expires at:', new Date(tokenResponse.expiresOnTimestamp));
      return tokenResponse.token;
    };
    
    console.log('🔧 Creating Azure OpenAI client with:');
    console.log('   Endpoint:', endpoint);
    console.log('   Deployment:', deployment);
    console.log('   API Version:', apiVersion);
    
    const client = new AzureOpenAI({
      endpoint,
      azureADTokenProvider,
      apiVersion,
      deployment,
      response_format: { type: "json_object" }
    });

    return client;
  } catch (error) {
    console.error('❌ Failed to get Azure credentials:', error.message);
    console.error('💡 Make sure you are logged in with: az login');
    throw error;
  }
}

app.post('/api/validate', async (req, res) => {
  try {
    const { prompt, imageBase64 } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const client = await getAzureOpenAIClient();

    const messages = [
      {
        role: 'user',
        content: imageBase64
          ? [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64,
                },
              },
            ]
          : prompt,
      },
    ];

    const response = await client.chat.completions.create({
    model: deployment,
    messages,
    temperature: 1,
    max_completion_tokens: 16384,
    });

    const content = response.choices[0]?.message?.content || '';
    res.json({ content });
  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to process validation request' 
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Validation API is running',
    endpoint,
    deployment 
  });
});

app.listen(port, () => {
  console.log(`🚀 Validation API server running on http://localhost:${port}`);
  console.log(`📍 Using Azure OpenAI endpoint: ${endpoint}`);
  console.log(`🤖 Deployment: ${deployment}`);
  console.log(`🔑 Authentication: Azure AD (RBAC)`);
  console.log(`💡 Test the server: http://localhost:${port}/health`);
});
