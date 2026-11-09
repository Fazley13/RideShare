import React from "react";
import cn from "@/lib/utils/cn";

export interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: number;
  online?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  size = 48,
  online = false,
  className,
  ...rest
}) => {
  const altText = typeof rest.alt === "string" ? rest.alt : "";

  return (
    <div
      style={{ width: size, height: size }}
      className={cn("relative rounded-full overflow-hidden", className)}
    >
      <img
        {...rest}
        alt={altText}
        className="w-full h-full object-cover rounded-full"
      />
      {online && (
        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-teal-500 ring-2 ring-white animate-pulse-dot" />
      )}
    </div>
  );
};

export default Avatar;
