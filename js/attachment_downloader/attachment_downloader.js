const downloadURL = (data, fileName) => {
  const tempLink = document.createElement('a');
  tempLink.href = data;
  tempLink.download = fileName;
  document.body.appendChild(tempLink);
  tempLink.style = 'display: none';
  tempLink.click();
  tempLink.remove();
};

export const downloadAttachment = (data, fileName, contentType) => {
  const blob = new Blob([data], { type: contentType });
  const url = window.URL.createObjectURL(blob);
  downloadURL(url, fileName);
  setTimeout(() => window.URL.revokeObjectURL(url), 1000);
};

