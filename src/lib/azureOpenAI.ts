// Call backend proxy API that handles Azure RBAC authentication
export async function callAzureOpenAI(prompt: string, imageBase64?: string): Promise<string> {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

  const response = await fetch(`${backendUrl}/api/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      imageBase64,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to validate image');
  }

  const data = await response.json();
  return data.content;
}
