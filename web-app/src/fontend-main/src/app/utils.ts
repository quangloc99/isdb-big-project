import {MatSnackBar} from "@angular/material/snack-bar";

export function makeFormData(data: any) {
  const res = new FormData();
  for (const [key, value] of Object.entries(data)) {
    res.set(key, value as string);
  }
  return res;
}

export function dateToYYYY_MM_DD(date: Date) {
  return date.toISOString().split('T')[0];
}

export function assignArray<T>(out: T[], inp: T[]) {
  while (out.length) out.pop();
  for (const value of inp) out.push(value);
}

export function showServerError(err: any, snackBar: MatSnackBar) {
  snackBar.open(err.error?.message ?? err?.message ?? err, '', {duration: 3000});
}
