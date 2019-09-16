export const timeConverter = UNIX_timestamp => {
  const a = new Date(UNIX_timestamp * 100)
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]
  const year = a.getFullYear()
  const month = months[a.getMonth()]
  const date = a.getDate()
  const hour = a.getHours()
  const min = a.getMinutes()
  const sec = a.getSeconds()
  const time =
    date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec
  return time
}

export const isBrowser = typeof window !== "undefined"
