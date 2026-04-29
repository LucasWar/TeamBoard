import { useState, useEffect } from "react";
import userImage from "../../../assets/userImage.png";
import { Avatar } from "radix-ui";

interface ImageInputProps {
  value?: File | null;
  onChange: (file: File | null) => void;
}

export function ImageInput({ onChange, value }: ImageInputProps) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(value);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
  };

  return (
    <>
      <label htmlFor="imageInput">
        <div className="flex items-center justify-center gap-3">
          <Avatar.Root className="inline-flex size-45 items-center justify-center overflow-hidden rounded-full">
            <Avatar.Image
              className="size-full object-cover"
              src={preview || userImage}
              alt="User avatar"
            />
          </Avatar.Root>
        </div>
      </label>

      <input
        id="imageInput"
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={{ display: "none" }}
      />
    </>
  );
}