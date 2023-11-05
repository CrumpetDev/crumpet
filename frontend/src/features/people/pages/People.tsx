import { useState } from 'react';
import { Table } from '../components';

const People = () => {
  const data = [
    { name: 'Jane Doe', age: 30 },
    { name: 'John Doe', age: 32 },
    { name: 'Super duper long name', age: 400000000 },
    // ... more data
  ];

  // This JSON would be generated based on user-defined columns.
  const columnJson = [
    { accessor: 'name', header: 'Name' },
    { accessor: 'age', header: 'Age' },
    // ... more columns
  ];

  // Using state to dynamically manage columns
  const [columns, setColumns] = useState(columnJson);

  // Handler to add a new column
  const handleAddColumn = () => {
    // Example of a new column. You might want to make this more dynamic.
    const newColumn = {
      accessor: `newColumn${columns.length}`, // Ensure the accessor is unique
      header: `New Column ${columns.length}`,
    };
    setColumns(prevColumns => [...prevColumns, newColumn]);
  };

  return (
    <div className="w-full h-full container px-6 py-8">
      <span>People</span>
      <Table data={data} columnJson={columnJson} />
    </div>
  );
};

export default People;
