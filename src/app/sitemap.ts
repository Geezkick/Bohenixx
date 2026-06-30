import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://www.bohenix.africa', lastModified: new Date() },
    { url: 'https://www.bohenix.africa/about', lastModified: new Date() },
    { url: 'https://www.bohenix.africa/products', lastModified: new Date() },
    { url: 'https://www.bohenix.africa/services', lastModified: new Date() },
    { url: 'https://www.bohenix.africa/contact', lastModified: new Date() },
  ];
}
