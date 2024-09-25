const formatDate = (date) => {
  const options = { year: "numeric", month: "long", day: "2-digit" };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

export { formatDate };
