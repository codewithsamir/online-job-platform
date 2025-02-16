import React, { useState } from "react";
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
import { checkArray } from "@/lib/checkarray";
import { Button } from "@/components/ui/button";
import Jobapplicationstatus from "@/components/dashboard/Jobapplicationstatus"; // Import Modal

interface TableColumn {
  header: string;
  accessor: string;
  className?: string;
}

interface GenericTableProps {
  caption?: string;
  columns: TableColumn[];
  data: Record<string, any>[];
  footer?: { label: string; value: string };
  action?: boolean;
  
}

export default function DashboardTable({
  caption,
  columns,
  data,
  footer,
  action,
  
}: GenericTableProps) {
  const datas = checkArray(data);

  // Modal state
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (application: any) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Table>
        {caption && <TableCaption>{caption}</TableCaption>}

        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index} className={`${column.className} text-white`}>
                {column.header}
              </TableHead>
            ))}
            {action && <TableHead className="text-white">Actions</TableHead>}
          </TableRow>
        </TableHeader>

        <TableBody>
          {datas.length > 0 ? (
            datas.map((row: any, rowIndex: number) => (
              <TableRow key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex} className={column.className}>
                    {column.accessor === "status" ? (
                      <Button
                        variant="outline"
                        className={`px-3 py-1 rounded-md ${
                          row[column.accessor] === "Pending"
                            ? "bg-yellow-500 text-white"
                            : row[column.accessor] === "Confirmed"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                        onClick={() => openModal(row)}
                      >
                        {row[column.accessor]}
                      </Button>
                    ) : isValidURL(row[column.accessor]) ? (
                      <a
                        href={row[column.accessor]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                      >
                        Open Link
                      </a>
                    ) : (
                      row[column.accessor]
                    )}
                  </TableCell>
                ))}
                {action && (
                  <TableCell>
                    <Button onClick={() => openModal(row)}>Edit Status</Button>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + (action ? 1 : 0)} className="text-center">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>

        {footer && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={columns.length - 1}>{footer.label}</TableCell>
              <TableCell className="text-right">{footer.value}</TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>

      {/* Status Modal */}
      {selectedApplication && (
        <Jobapplicationstatus
          isOpen={isModalOpen}
          onClose={closeModal}
          application={selectedApplication}
          
        />
      )}
    </>
  );
}

// Function to check if the value is a valid URL
function isValidURL(value: string) {
  try {
    new URL(value);
    return true;
  } catch (_) {
    return false;
  }
}
