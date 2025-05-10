import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface JournalEntry {
  account: string;
  debit: number;
  credit: number;
}

interface JournalEntryFormProps {
  onSubmit: (data: { entries: JournalEntry[], description: string }) => void;
  isLoading?: boolean;
}

export function JournalEntryForm({ onSubmit, isLoading = false }: JournalEntryFormProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([
    { account: '', debit: 0, credit: 0 }
  ]);
  const [description, setDescription] = useState('');
  const [isValid, setIsValid] = useState(false);

  const addEntry = () => {
    setEntries([...entries, { account: '', debit: 0, credit: 0 }]);
  };

  const removeEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const updateEntry = (index: number, field: keyof JournalEntry, value: string) => {
    const newEntries = [...entries];
    
    if (field === 'debit' || field === 'credit') {
      // Parse numeric value - empty string becomes 0
      const numValue = value === '' ? 0 : Number(value);
      
      // Update the current field without affecting the other field
      newEntries[index][field] = numValue;
    } else {
      // Handle text fields
      newEntries[index][field] = value;
    }
    
    setEntries(newEntries);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onSubmit({ entries, description });
    }
  };

  useEffect(() => {
    const validateForm = () => {
      // All accounts must be filled
      const allAccountsFilled = entries.every(entry => (entry.account || '').trim() !== '');
      
      // For each entry, either debit or credit must be filled (not empty)
      const allDebitOrCreditFilled = entries.every(entry => {
        const hasDebit = entry.debit !== undefined && entry.debit !== null && entry.debit.toString() !== '';
        const hasCredit = entry.credit !== undefined && entry.credit !== null && entry.credit.toString() !== '';
        return hasDebit && hasCredit;
      });
      
      
      // For debugging
      console.log({
        allAccountsFilled,
        allDebitOrCreditFilled,
        entries
      });

      // Form is valid when all accounts are filled and each entry has either debit or credit
      setIsValid(allAccountsFilled && allDebitOrCreditFilled);
    };

    validateForm();
  }, [entries, description]);

  // No longer need to calculate totals

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Journal Entries
        </label>
        {entries.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 p-2 bg-white dark:bg-dark-accent rounded-lg border dark:border-gray-700">
            <input
              type="text"
              placeholder="Account name"
              value={entry.account}
              onChange={(e) => updateEntry(index, 'account', e.target.value)}
              className="flex-1 px-3 py-2 border rounded-md dark:bg-dark-accent dark:border-gray-700 dark:text-white"
              disabled={isLoading}
              required
            />
            <input
              type="number"
              placeholder="Debit"
              value={entry.debit === 0 ? '' : entry.debit}
              onChange={(e) => updateEntry(index, 'debit', e.target.value)}
              className="w-24 px-3 py-2 border rounded-md dark:bg-dark-accent dark:border-gray-700 dark:text-white"
              disabled={isLoading}
              min="0"
              step="0.01"
            />
            <input
              type="number"
              placeholder="Credit"
              value={entry.credit === 0 ? '' : entry.credit}
              onChange={(e) => updateEntry(index, 'credit', e.target.value)}
              className="w-24 px-3 py-2 border rounded-md dark:bg-dark-accent dark:border-gray-700 dark:text-white"
              disabled={isLoading}
              min="0"
              step="0.01"
            />
            {entries.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeEntry(index)}
                className="text-red-500 hover:text-red-700"
                disabled={isLoading}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={addEntry}
          className="w-full"
          disabled={isLoading}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Entry
        </Button>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Description (Optional)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter a description for these journal entries..."
          className="w-full px-3 py-2 border rounded-md dark:bg-dark-accent dark:border-gray-700 dark:text-white"
          rows={3}
          disabled={isLoading}
        />
      </div>



      <Button
        type="submit"
        className="w-full"
        disabled={!isValid || isLoading}
      >
        {isLoading ? 'Analyzing...' : 'Analyze Entries'}
      </Button>
    </form>
  );
}