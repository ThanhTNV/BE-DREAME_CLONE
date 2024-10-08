export class Utils {
  convertDateFromData(
    data: any,
    format: 'DD-MM-YYYY' | 'MM-DD-YYYY' | 'YYYY-MM-DD',
  ) {
    if (data.dob) {
      data.dob = this.convertDateToFormat(format, data.dob);
    }
    return { data: data };
  }

  convertDateToFormat(
    format: 'DD-MM-YYYY' | 'MM-DD-YYYY' | 'YYYY-MM-DD',
    date: Date,
  ) {
    const datePart = date.getDate();
    const monthPart = date.getMonth() + 1;
    const yearPart = date.getFullYear();
    switch (format) {
      case 'DD-MM-YYYY':
        return `${datePart}-${monthPart}-${yearPart}`;
      case 'MM-DD-YYYY':
        return `${monthPart}-${datePart}-${yearPart}`;
      case 'YYYY-MM-DD':
        return `${yearPart}-${monthPart}-${datePart}`;
      default:
        return `${datePart}-${monthPart}-${yearPart}`;
    }
  }
}
