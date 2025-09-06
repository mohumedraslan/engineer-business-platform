// src/components/dashboard/ProjectSearch.tsx
'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export default function ProjectSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('query') || '');

  // Update local state when URL params change
  useEffect(() => {
    setSearchTerm(searchParams.get('query') || '');
  }, [searchParams]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    
    if (term.trim()) {
      params.set('query', term.trim());
    } else {
      params.delete('query');
    }
    
    replace(`${pathname}?${params.toString()}`);
  };

  const clearSearch = () => {
    setSearchTerm('');
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.delete('query');
    replace(`${pathname}?${params.toString()}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for projects by title, description, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-12 h-12 text-base"
          />
          {searchTerm && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button type="submit" className="sr-only">
          Search
        </Button>
      </form>
      
      {searchTerm && (
        <div className="mt-2 text-sm text-gray-600">
          <span className="flex items-center">
            <Filter className="h-3 w-3 mr-1" />
            Filtering by: <span className="font-medium ml-1">&ldquo;{searchTerm}&rdquo;</span>
          </span>
        </div>
      )}
    </div>
  );
}
