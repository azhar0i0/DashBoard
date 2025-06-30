
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
  defaultCategories: string[];
  placeholder?: string;
  customCategories: string[];
  onAddCustomCategory: (category: string) => void;
  onRemoveCustomCategory: (category: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  value,
  onChange,
  defaultCategories,
  placeholder = "Select category",
  customCategories,
  onAddCustomCategory,
  onRemoveCustomCategory
}) => {
  const [showAddInput, setShowAddInput] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const allCategories = [...defaultCategories, ...customCategories];

  const handleAddCategory = () => {
    if (newCategory.trim() && !allCategories.includes(newCategory.trim())) {
      onAddCustomCategory(newCategory.trim());
      onChange(newCategory.trim());
      setNewCategory('');
      setShowAddInput(false);
    }
  };

  return (
    <div className="space-y-2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {defaultCategories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
          {customCategories.length > 0 && (
            <>
              <SelectItem value="separator" disabled className="text-xs text-gray-500">
                ──── Custom Categories ────
              </SelectItem>
              {customCategories.map((category) => (
                <SelectItem key={category} value={category} className="flex items-center justify-between">
                  <span>{category}</span>
                </SelectItem>
              ))}
            </>
          )}
        </SelectContent>
      </Select>

      {showAddInput ? (
        <div className="flex gap-2">
          <Input
            placeholder="Enter new category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            className="text-sm"
          />
          <Button size="sm" onClick={handleAddCategory} disabled={!newCategory.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => {
            setShowAddInput(false);
            setNewCategory('');
          }}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowAddInput(true)}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Custom Category
        </Button>
      )}

      {customCategories.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {customCategories.map((category) => (
            <span
              key={category}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
            >
              {category}
              <button
                onClick={() => onRemoveCustomCategory(category)}
                className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
