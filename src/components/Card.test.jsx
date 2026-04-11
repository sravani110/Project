import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Card from './Card';

describe('Card component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders a YouTube card with metadata, tags, and opens the URL on click', () => {
    const item = {
      title: 'React Testing Library',
      description: 'A great video about testing components.',
      duration: '12:34',
      views: '5.4K',
      url: 'https://example.com/video',
      thumbnail: '/thumbnail.jpg',
      tags: ['react', 'testing', 'vitest', 'coverage'],
      technologies: ['React', 'Vitest'],
    };

    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    const { container } = render(<Card item={item} type="youtube" />);

    expect(screen.getByRole('heading', { name: /react testing library/i })).toBeTruthy();
    expect(screen.getByText('12:34')).toBeTruthy();
    expect(screen.getByText('5.4K views')).toBeTruthy();
    expect(screen.getByText(/view video/i)).toBeTruthy();
    expect(screen.getByText('react')).toBeTruthy();
    expect(screen.getByText('testing')).toBeTruthy();
    expect(screen.getByText('vitest')).toBeTruthy();
    expect(screen.queryByText('coverage')).toBeNull();
    expect(screen.getByText('React')).toBeTruthy();
    expect(screen.getByText('Vitest')).toBeTruthy();

    const card = container.querySelector('.card');
    fireEvent.click(card);
    expect(openSpy).toHaveBeenCalledWith('https://example.com/video', '_blank', 'noopener,noreferrer');
  });

  it('renders a Udemy card with rating, students, price, and course link text', () => {
    const item = {
      title: 'Fullstack Course',
      description: 'Learn fullstack development.',
      rating: 4.8,
      students: '18K',
      price: '$19.99',
      url: 'https://example.com/course',
      tags: ['fullstack'],
    };

    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    render(<Card item={item} type="udemy" />);

    expect(screen.getByText('⭐ 4.8')).toBeTruthy();
    expect(screen.getByText('18K students')).toBeTruthy();
    expect(screen.getByText('$19.99')).toBeTruthy();
    expect(screen.getByText(/view course/i)).toBeTruthy();
    fireEvent.click(screen.getByText(/view course/i));
    expect(openSpy).toHaveBeenCalledWith('https://example.com/course', '_blank', 'noopener,noreferrer');
  });

  it('renders a project card with client and completion date metadata', () => {
    const item = {
      title: 'Portfolio Website',
      description: 'A customer-facing portfolio project.',
      client: 'Acme Corp',
      completionDate: 'April 2026',
      url: 'https://example.com/project',
      tags: ['web', 'portfolio'],
    };

    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    render(<Card item={item} type="project" />);

    expect(screen.getByText('Acme Corp')).toBeTruthy();
    expect(screen.getByText('April 2026')).toBeTruthy();
    expect(screen.getByText(/view project/i)).toBeTruthy();
    fireEvent.click(screen.getByText(/view project/i));
    expect(openSpy).toHaveBeenCalledWith('https://example.com/project', '_blank', 'noopener,noreferrer');
  });

  it('renders gracefully when no URL is provided and does not show the link action', () => {
    const item = {
      title: 'Draft Card',
      description: 'This card has no external link.',
    };

    const { container } = render(<Card item={item} />);

    expect(screen.getByText(/draft card/i)).toBeTruthy();
    expect(screen.getByText(/this card has no external link./i)).toBeTruthy();
    expect(container.querySelector('.card-link')).toBeNull();
    expect(window.getComputedStyle(container.querySelector('.card')).cursor).toBe('default');
  });
});
