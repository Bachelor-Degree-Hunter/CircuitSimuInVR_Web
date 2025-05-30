import React from "react";
import { Card, Input, Button } from "@material-tailwind/react";

function SearchAndAddTA({ search, setSearch, toggleAddModal }) {
  return (
    <Card>
      <div className="flex items-center justify-between p-4">
        <div className="md:w-56">
          <Input
            label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="gradient" color="green" onClick={toggleAddModal}>
            Add
          </Button>
        </div>
      </div>
    </Card>
  );
}
 
export default SearchAndAddTA;
