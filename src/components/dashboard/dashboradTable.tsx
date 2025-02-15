import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TableColumn {
  header: string;
  accessor: string; // Key in the data object
  className?: string; // Optional class for styling
}

interface GenericTableProps {
  caption?: string; // Optional table caption
  columns: TableColumn[]; // Array of column definitions
  data: Record<string, any>[]; // Array of objects representing rows
  footer?: { label: string; value: string }; // Optional footer
}

export default function DashboardTable({
  caption,
  columns,
  data,
  footer,
}: GenericTableProps) {
  return (
    <Table>
      {/* Table Caption */}
      {caption && <TableCaption>{caption}</TableCaption>}

      {/* Table Header */}
      <TableHeader>
        <TableRow>
          {columns.map((column, index) => (
            <TableHead key={index} className={`${column.className} text-white`}>
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      {/* Table Body */}
      <TableBody>
        {data.length > 0 ? (
          data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column, colIndex) => (
                <TableCell
                  key={colIndex}
                  className={column.className}
                >
                  {row[column.accessor]}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center">
              No data available
            </TableCell>
          </TableRow>
        )}
      </TableBody>

      {/* Table Footer */}
      {footer && (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={columns.length - 1}>{footer.label}</TableCell>
            <TableCell className="text-right">{footer.value}</TableCell>
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
}