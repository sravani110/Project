import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import FilterBar from './FilterBar';

afterEach(() => cleanup());

describe('FilterBar component', () => {
  it('renders search input and propagates search changes', () => {
    const onSearchChange = vi.fn();
    render(
      <FilterBar
        searchTerm=""
        onSearchChange={onSearchChange}
        categories={[]}
        selectedCategory=""
        onCategoryChange={() => {}}
        sortOptions={[]}
        selectedSort=""
        onSortChange={() => {}}
        onClearFilters={() => {}}
      />
    );

    const input = screen.getByPlaceholderText(/search.../i);
    expect(input).toBeTruthy();

    fireEvent.change(input, { target: { value: 'react' } });
    expect(onSearchChange).toHaveBeenCalledWith('react');
  });

  it('shows clear search button when searchTerm exists and clears on click', () => {
    const onSearchChange = vi.fn();
    render(
      <FilterBar
        searchTerm="hello"
        onSearchChange={onSearchChange}
        categories={[]}
        selectedCategory=""
        onCategoryChange={() => {}}
        sortOptions={[]}
        selectedSort=""
        onSortChange={() => {}}
        onClearFilters={() => {}}
      />
    );

    const clearButton = screen.getByRole('button', { name: /clear search/i });
    expect(clearButton).toBeTruthy();

    fireEvent.click(clearButton);
    expect(onSearchChange).toHaveBeenCalledWith('');
  });

  it('toggles the filters panel when the filter button is clicked', () => {
    render(
      <FilterBar
        searchTerm=""
        onSearchChange={() => {}}
        categories={['Web', 'Design']}
        selectedCategory=""
        onCategoryChange={() => {}}
        sortOptions={[{ value: 'newest', label: 'Newest' }]}
        selectedSort="newest"
        onSortChange={() => {}}
        onClearFilters={() => {}}
      />
    );

    const toggleButton = screen.getByRole('button', { name: /filters/i });
    expect(toggleButton).toBeTruthy();
    expect(screen.queryByText(/category/i)).toBeNull();

    fireEvent.click(toggleButton);
    expect(screen.getByText(/category/i)).toBeTruthy();
    expect(screen.getByText(/sort by/i)).toBeTruthy();
  });

  it('renders category options and triggers category changes', () => {
    const onCategoryChange = vi.fn();
    render(
      <FilterBar
        searchTerm=""
        onSearchChange={() => {}}
        categories={['Web', 'Mobile']}
        selectedCategory="Web"
        onCategoryChange={onCategoryChange}
        sortOptions={[]}
        selectedSort=""
        onSortChange={() => {}}
        onClearFilters={() => {}}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /filters/i }));
    const [categorySelect] = screen.getAllByRole('combobox');
    expect(categorySelect).toBeTruthy();

    fireEvent.change(categorySelect, { target: { value: 'Mobile' } });
    expect(onCategoryChange).toHaveBeenCalledWith('Mobile');
  });

  it('renders sort options and triggers sort changes', () => {
    const onSortChange = vi.fn();
    render(
      <FilterBar
        searchTerm=""
        onSearchChange={() => {}}
        categories={[]}
        selectedCategory=""
        onCategoryChange={() => {}}
        sortOptions={[
          { value: 'newest', label: 'Newest' },
          { value: 'popular', label: 'Most Popular' }
        ]}
        selectedSort="newest"
        onSortChange={onSortChange}
        onClearFilters={() => {}}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /filters/i }));
    const [sortSelect] = screen.getAllByRole('combobox');
    expect(sortSelect).toBeTruthy();

    fireEvent.change(sortSelect, { target: { value: 'popular' } });
    expect(onSortChange).toHaveBeenCalledWith('popular');
  });

  it('calls onClearFilters when Clear All Filters is clicked', () => {
    const onClearFilters = vi.fn();
    render(
      <FilterBar
        searchTerm=""
        onSearchChange={() => {}}
        categories={['Web']}
        selectedCategory="Web"
        onCategoryChange={() => {}}
        sortOptions={[{ value: 'newest', label: 'Newest' }]}
        selectedSort="newest"
        onSortChange={() => {}}
        onClearFilters={onClearFilters}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /filters/i }));
    const clearButton = screen.getByRole('button', { name: /clear all filters/i });
    expect(clearButton).toBeTruthy();

    fireEvent.click(clearButton);
    expect(onClearFilters).toHaveBeenCalled();
  });
});
