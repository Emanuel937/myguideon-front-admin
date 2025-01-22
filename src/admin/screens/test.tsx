import React, { useState } from "react";
import { TextField, Autocomplete, Chip } from "@mui/material";

const CountrySearch = () => {
  const [tags, setTags] = useState<string[]>([]);

  const handleTagsChange = (event: any, value: string[]) => {
    setTags(value);
  };

  return (
    <Autocomplete
      multiple
      freeSolo
      options={[]}
      value={tags}
      onChange={handleTagsChange}
      renderTags={(value: string[], getTagProps) =>
        value.map((option, index) => (
          <Chip
            variant="outlined"
            label={option}
            {...getTagProps({ index })}
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Add tags"
          placeholder="Type and press enter"
        />
      )}
    />
  );
};

export default CountrySearch;
