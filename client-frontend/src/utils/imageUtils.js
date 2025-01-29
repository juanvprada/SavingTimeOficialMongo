export const normalizeUrl = (path) => {
  const baseUrl = import.meta.env.VITE_API_URL || 'https://savingtimeoficial.eu-4.evennode.com';
  
  const url = baseUrl.startsWith('http') 
    ? baseUrl.replace('http://', 'https://') 
    : `https://${baseUrl}`;
  
  if (!path) return url;
  
  return path.startsWith('/')
    ? `${url}${path}`
    : `${url}/${path}`;
};