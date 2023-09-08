import { ReactNode } from 'react';
import { MdMoreHoriz } from 'react-icons/md';

/**
 * Describes the structure for each header item.
 * - `propertyName` is the key to retrieve the value from the data. i.e. needs to map to the name of the property
 *   on type T of your data array.
 * - `displayName` is the text shown as the table header.
 */
interface Header {
  propertyName: string;
  displayName: string;
}

/**
 * Props structure for the Table component.
 * @template T
 * - `onMoreClick` function to be executed when the "More" icon is clicked.
 * - `headers` an array of header definitions for the table.
 * - `data` array of data objects to be displayed in the table. Each object should match the headers' structure.
 * - `renderCell` (optional) a custom function to render the cell. Useful if you want a custom rendering for a cell.
 */
interface TableProps<T> {
  onMoreClick: () => void;
  headers: Header[];
  data: T[];
  /**
   * Optional custom function for rendering a table cell.
   * @param item - The current data item being rendered.
   * @param header - The header definition for the current cell.
   * @returns A React node (e.g., JSX element) that will be displayed inside the table cell.
   */
  renderCell?: (item: T, header: Header) => ReactNode;
}

const Table = <T extends Record<string, string>>({
  onMoreClick,
  headers,
  data,
  renderCell,
}: TableProps<T>) => {
  return (
    <table className="table-auto text-left text-oxford">
      <thead>
        <tr className="bg-crumpet-light-100">
          {headers.map(header => (
            <th key={header.propertyName} className="p-1">
              {header.displayName}
            </th>
          ))}
          <th className="p-1 rounded-r"></th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {headers.map(header => (
              <td key={header.propertyName} className={`p-1 ${rowIndex == 0 ? 'pt-2' : ''}`}>
                {renderCell ? renderCell(row, header) : row[header.propertyName]}
              </td>
            ))}
            <td className="p-1 flex justify-end">
              <div
                className="p-1 hover:bg-crumpet-light-100 hover:cursor-pointer"
                onClick={onMoreClick}>
                <MdMoreHoriz />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
