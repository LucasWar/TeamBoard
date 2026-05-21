import { useState, useEffect } from "react";
import userImage from "../assets/userImage.png";
import { Avatar } from "radix-ui";
import { cn } from "../app/utils/cn";

interface ImageInputProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  className?: string;
  preview?: string | null
}

export function ImageInput({ onChange, value, className, preview }: ImageInputProps) {
  const [image, setImage] = useState<string | null>(null);
  const [imageDefault, setImageDefault] = useState<string>(userImage);

  useEffect(() => {
    if (preview) {
      setImageDefault(
        `${import.meta.env.VITE_BASE_URL}/uploads/users/${preview}`
      );
    }
  }, [preview]);

  useEffect(() => {
    if (!value) {
      setImage(null);
      return;
    }

    const url = URL.createObjectURL(value);
    setImage(url);

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
          <Avatar.Root className={cn("inline-flex size-45 items-center justify-center overflow-hidden rounded-full", className)}>
            <Avatar.Image
              className="size-full object-cover"
              src={image || imageDefault}
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