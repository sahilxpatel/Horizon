export const getImageSrc = (image: unknown, fallback = "/tour-images/tour-img01.jpg") => {
  if (typeof image === "string" && image.trim()) {
    return image;
  }

  if (image && typeof image === "object" && "src" in image) {
    const src = (image as { src?: unknown }).src;
    if (typeof src === "string" && src.trim()) {
      return src;
    }
  }

  return fallback;
};
