"use client";

import { useState } from "react";
import { TagAutocomplete } from "@/components/upload/TagAutocomplete";

type UploadTagsFieldProps = {
  availableTags: readonly string[];
};

export function UploadTagsField({ availableTags }: UploadTagsFieldProps) {
  const [value, setValue] = useState("");

  return (
    <div className="full-field upload-tags-field">
      <TagAutocomplete
        availableTags={availableTags}
        label="Tags separadas por virgula"
        onChange={setValue}
        value={value}
      />
      <small>Use termos consistentes para melhorar a busca na galeria.</small>
    </div>
  );
}