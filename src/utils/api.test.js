import { describe, expect, it } from 'vitest';
import { filterItems } from './api.js';

describe('filterItems', () => {
  const items = [
    {
      title: 'Docker Fundamentals',
      description: 'Learn Docker and containerization.',
      tags: ['Docker', 'Containers'],
      category: 'DevOps',
      technologies: ['Docker', 'Kubernetes'],
      client: 'Acme Corp',
      completionDate: 'Jan 2024',
      duration: '3:00',
      price: '$29.99'
    },
    {
      title: 'React Best Practices',
      description: 'Frontend development with React and Vite.',
      tags: ['React', 'Vite'],
      category: 'Frontend',
      technologies: ['React', 'JavaScript'],
      client: 'WebCorp',
      completionDate: 'Feb 2024',
      duration: '2:15',
      price: '$19.99'
    }
  ];

  it('returns items when search matches title', () => {
    const result = filterItems(items, 'react', '', '');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('React Best Practices');
  });

  it('returns items when search matches tags', () => {
    const result = filterItems(items, 'containers', '', '');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Docker Fundamentals');
  });

  it('returns items when search matches category', () => {
    const result = filterItems(items, 'frontend', '', '');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('React Best Practices');
  });

  it('returns items when search matches technologies', () => {
    const result = filterItems(items, 'kubernetes', '', '');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Docker Fundamentals');
  });

  it('returns items when search matches client', () => {
    const result = filterItems(items, 'acme', '', '');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Docker Fundamentals');
  });

  it('returns items when search matches price', () => {
    const result = filterItems(items, '$19.99', '', '');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('React Best Practices');
  });
});
