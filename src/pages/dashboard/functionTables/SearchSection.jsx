import React from "react";
import { Card, Input } from "@material-tailwind/react";

function SearchSection({ search, setSearch }) {
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
      </div>
    </Card>
  );
}

export default SearchSection;
