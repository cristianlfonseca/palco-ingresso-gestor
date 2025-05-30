
import React, { useState } from 'react';
import { Check, ChevronsUpDown, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Student } from '@/hooks/useStudents';

interface StudentComboboxProps {
  students: Student[];
  value: string;
  onValueChange: (value: string) => void;
}

const StudentCombobox = ({ students, value, onValueChange }: StudentComboboxProps) => {
  const [open, setOpen] = useState(false);

  const selectedStudent = students.find(student => student.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value === 'new' ? (
            "Novo comprador"
          ) : selectedStudent ? (
            `${selectedStudent.student_name} - ${selectedStudent.responsible_name}`
          ) : (
            "Selecione um aluno ou digite novos dados"
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar aluno..." />
          <CommandList>
            <CommandEmpty>Nenhum aluno encontrado.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="new"
                onSelect={() => {
                  onValueChange("new");
                  setOpen(false);
                }}
              >
                <User className="mr-2 h-4 w-4" />
                Novo comprador
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === "new" ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
              {students.map((student) => (
                <CommandItem
                  key={student.id}
                  value={`${student.student_name} ${student.responsible_name}`}
                  onSelect={() => {
                    onValueChange(student.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === student.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {student.student_name} - {student.responsible_name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StudentCombobox;
