import { Dog, Accessibility, Clock, Users } from 'lucide-react';

export type FilterType = 'all' | 'family' | 'accessibility' | 'pet_friendly' | 'open_now';

interface FilterBarProps {
  activeFilters: FilterType[];
  onFilterChange: (filters: FilterType[]) => void;
}

const filters: { id: FilterType; label: string; icon: React.ReactNode }[] = [
  { id: 'open_now', label: 'Open Now', icon: <Clock className="w-4 h-4" /> },
  { id: 'family', label: 'Family', icon: <Users className="w-4 h-4" /> },
  { id: 'accessibility', label: 'Accessible', icon: <Accessibility className="w-4 h-4" /> },
  { id: 'pet_friendly', label: 'Pet Friendly', icon: <Dog className="w-4 h-4" /> },
];

export function FilterBar({ activeFilters, onFilterChange }: FilterBarProps) {
  const toggleFilter = (filterId: FilterType) => {
    if (activeFilters.includes(filterId)) {
      onFilterChange(activeFilters.filter(f => f !== filterId));
    } else {
      onFilterChange([...activeFilters, filterId]);
    }
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => toggleFilter(filter.id)}
          data-active={activeFilters.includes(filter.id)}
          className="filter-chip flex items-center gap-2 whitespace-nowrap flex-shrink-0"
        >
          {filter.icon}
          {filter.label}
        </button>
      ))}
    </div>
  );
}
