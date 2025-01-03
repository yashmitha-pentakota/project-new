import { HttpInterceptorFn } from '@angular/common/http';

export const outgngInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.set('Authorization', `Bearer ${token}`);
  }
  return next(req);
};
