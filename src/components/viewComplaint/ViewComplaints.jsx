import React, { useState, useEffect } from "react";
import axios from "axios";
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
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function ViewComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3001/complaints")
      .then(response => {
        setComplaints(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const uniqueDepartments = [...new Set(complaints.map(complaint => complaint.department))];

  const filteredComplaints = selectedDepartment
    ? complaints.filter(complaint => complaint.department === selectedDepartment)
    : complaints;

  return (
    <div>
      <div className='text-3xl text-black flex justify-center mt-[3dvh] mb-[0dvh]'>Complaints</div>
      
      {/* Dropdown for filtering by department */}
      <div className="mb-[3dvh] w-[95%] text-black  flex justify-end ">
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="">All Departments</option>
          {uniqueDepartments.map(department => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </select>
      </div>

      <Table className="">
        <TableHeader className="bg-black">
          <TableRow >
            <TableHead className="text-white">Category</TableHead>
            <TableHead className="text-white">Department</TableHead>
            <TableHead className="text-white">PNR Number</TableHead>
            <TableHead className="text-white">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredComplaints.map((complaint) => (
            <TableRow key={complaint.pnrNumber}>
              <TableCell className="font-medium">{complaint.category}</TableCell>
              <TableCell>{complaint.department}</TableCell>
              <TableCell>{complaint.pnrNumber}</TableCell>
              <Dialog>
                <DialogTrigger asChild>
                  <TableCell><Button>View</Button></TableCell>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="mb-[3%]">Description</DialogTitle>
                    <DialogDescription>
                      {complaint.description}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                      <Button className="mt-[8%]" type="button" variant="secondary">
                        Close
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
