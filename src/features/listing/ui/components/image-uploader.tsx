"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useCallback } from "react";
import { TbPhotoPlus } from "react-icons/tb";

declare global {
    var cloudinary: any;
}

interface ImageUploaderProps {
    onChange: (value: string) => void;
    value: string;
}

export const ImageUploader = ({ value, onChange }: ImageUploaderProps) => {
    const handleUpload = useCallback(
        (results: any) => {
            onChange(results.info.secure_url);
        },
        [onChange],
    );

    return (
        <CldUploadWidget
            onSuccess={handleUpload}
            uploadPreset="myairbnb"
            onOpen={() => {
                setTimeout(() => {
                    document.body.style.pointerEvents = "auto";
                }, 100);
            }}
            options={{
                maxFiles: 1,
            }}
        >
            {({ open }) => {
                return (
                    <div
                        onClick={(e) => {
	                   e.stopPropagation();
                           open();
                        }}
                        className="relative cursor-pointer hover:opacity-70 transition border-dashed border-2 p-20 border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-600"
                    >
                        <TbPhotoPlus size={50} />
                        <div className="font-semibold text-lg">
                            Click to upload
                        </div>
                        {value && (
                            <div className="absolute inset-0 w-full h-full">
                                <Image
                                    src={value}
                                    alt="Upload"
                                    fill
                                    style={{
                                        objectFit: "cover",
                                    }}
                                    loading="eager"
                                />
                            </div>
                        )}
                    </div>
                );
            }}
        </CldUploadWidget>
    );
};
