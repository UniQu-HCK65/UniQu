function formatDate(date) {
  const dateFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  const timeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  const formattedDate = date.toLocaleDateString("id-ID", dateFormatOptions);
  const formattedTime = date.toLocaleTimeString("en-GB", timeFormatOptions);

  const fullFormattedDateTime = `${formattedDate}, ${formattedTime}`;
  return fullFormattedDateTime;
}

module.exports = { formatDate };
