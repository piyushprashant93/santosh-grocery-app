export function formatTimeAgo(dateInput: string | Date): string {
  if (!dateInput) return "Just now";
  
  const date = new Date(dateInput);
  const now = new Date();
  const secondsPast = (now.getTime() - date.getTime()) / 1000;

  if (secondsPast < 60) {
    return 'Just now';
  }
  if (secondsPast < 3600) {
    const mins = Math.floor(secondsPast / 60);
    return `${mins} min${mins > 1 ? 's' : ''} ago`;
  }
  if (secondsPast < 86400) {
    const hours = Math.floor(secondsPast / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  if (secondsPast < 172800) {
    return '1 day ago'; // As per screenshot, "1 day ago" is used instead of "Yesterday"
  }
  if (secondsPast <= 2592000) {
    const days = Math.floor(secondsPast / 86400);
    return `${days} days ago`;
  }
  if (secondsPast <= 31536000) {
    const months = Math.floor(secondsPast / 2592000);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
  const years = Math.floor(secondsPast / 31536000);
  return `${years} year${years > 1 ? 's' : ''} ago`;
}
