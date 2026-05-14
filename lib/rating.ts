export const computeReviewStats = (reviews: Array<{ rating?: number }> = []) => {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return { totalRating: 0, avgRating: 0 };
  }

  const totalRating = reviews.reduce((sum, review) => {
    if (typeof review?.rating === "number") {
      return sum + review.rating;
    }
    return sum;
  }, 0);

  const avgRating = totalRating / reviews.length;
  return { totalRating, avgRating: Number(avgRating.toFixed(1)) };
};
